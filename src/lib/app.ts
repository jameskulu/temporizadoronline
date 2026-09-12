/** Application controller: wires engine, display, controls, presets, dialogs, persistence. */
import type { Initial, Mode, Preferences, RunState, SoundKind, TimerConfig } from './types';
import { THEMES } from './types';
import { defaultConfig } from './types';
import { formatClock, clamp } from './format';
import { formatDurationSec } from './format';
import { TimerEngine } from './engine';
import { Display } from './ui/display';
import { dialogHtml as seqDialogHtml } from './ui/sequence';
import type { SequenceStep } from './types';
import { SAMPLE_SEQUENCES } from './presets';
import {
	loadPrefs,
	savePrefs,
	loadCustomPresets,
	saveCustomPresets,
	loadSession,
	saveSession,
	getTheme,
	setTheme,
} from './storage';
import type { SessionState } from './storage';
import { STR, MODE_NAMES, SOUND_NAMES, DISPLAY_NAMES, THEME_NAMES } from './strings';
import { QUICK_PRESETS, CATEGORIES } from './presets';
import type { LaunchPreset } from './presets';
import { I, esc, byId } from './ui/dom';
import * as sound from './sound';
import * as wakelock from './wakelock';
import * as notify from './notify';
import * as tabLib from './tab';
import * as fs from './fullscreen';
import {
	buildShareUrl,
	copyToClipboard,
	nativeShare,
	canNativeShare,
	qrDataUrl,
	decodeBase64Json,
} from './share';
import type { PresetItem } from './types';

export interface AppOptions {
	initial?: Initial;
	scope?: 'full' | 'compact';
}

interface Card {
	id: string;
	label: string;
	engine: TimerEngine;
	lastRender: number;
}

type Scope = 'full' | 'compact';

const SESSION_MARKER = '__session__';

/** Dedicated page for each mode, used when the mode segment changes "page" behavior. */
const MODE_PATHS: Partial<Record<Mode, string>> = {
	timer: '/temporizador/',
	stopwatch: '/cronometro/',
	pomodoro: '/pomodoro/',
	interval: '/intervalos/',
	meditation: '/meditacao/',
	sequence: '/sequencias/',
};

function currentPagePath(): string {
	return location.pathname.endsWith('/') ? location.pathname : `${location.pathname}/`;
}

export function configFromInitial(ini: Initial): TimerConfig {
	const mode = ini.mode ?? 'timer';
	const base = defaultConfig(mode);
	const fallbackSteps = mode === 'sequence' ? SAMPLE_SEQUENCES[0].steps : [];
	return {
		mode,
		durationSec: ini.seconds ?? base.durationSec,
		focusSec: ini.focusSec ?? base.focusSec,
		shortBreakSec: ini.shortBreakSec ?? base.shortBreakSec,
		longBreakSec: ini.longBreakSec ?? base.longBreakSec,
		roundsBeforeLongBreak: ini.roundsBeforeLongBreak ?? base.roundsBeforeLongBreak,
		rounds: ini.rounds ?? base.rounds,
		workSec: ini.workSec ?? base.workSec,
		restSec: ini.restSec ?? base.restSec,
		prepareSec: ini.prepareSec ?? base.prepareSec,
		keepRunning: ini.keepRunning ?? base.keepRunning,
		steps: ini.steps?.length ? ini.steps : fallbackSteps,
	};
}

export class App {
	prefs: Preferences;
	private root: HTMLElement;
	private scope: Scope;
	private cards: Card[] = [];
	private activeId = '';
	private nextId = 1;
	private display: Display;
	private configOpen = false;
	private raf = 0;
	private recentKeys: string[] = [];
	private customPresets: PresetItem[] = [];
	private sessionTimer = 0;
	private pendingSequence: SequenceStep[] | null = null;
	private lastPhaseHtml = '';
	private laps: { total: number; delta: number }[] = [];

	constructor(root: HTMLElement, opts: AppOptions = {}) {
		this.root = root;
		this.scope = opts.scope ?? 'full';
		this.prefs = loadPrefs();
		this.prefs.theme = getTheme();
		this.customPresets = loadCustomPresets();
		this.recentKeys = this.prefs.recent;

		this.root.innerHTML = this.skeleton();
		const displayNode = byId('t-display') ?? this.root;
		this.display = new Display(displayNode, this.prefs.displayStyle);

		this.applyPrefsToLibs();

		const initial = this.resolveInitial(opts.initial);
		this.createCard(initial);

		this.install();
		this.renderAll();
		this.requestLoop();
	}

	/* ------------------------------ bootstrap ------------------------------ */

	private resolveInitial(pageInitial?: Initial): Initial {
		const params = new URLSearchParams(location.search);
		const hasParams = [...params.keys()].length > 0;
		const merged: Initial = {};
		if (pageInitial) Object.assign(merged, pageInitial);

		const parseIntParam = (k: string): number | undefined => {
			const v = params.get(k);
			if (v === null) return undefined;
			const n = Number(v);
			return Number.isFinite(n) && n >= 0 ? Math.round(n) : undefined;
		};

		if (params.has('mode')) {
			const m = params.get('mode') as string;
			if (['timer', 'stopwatch', 'pomodoro', 'interval', 'meditation', 'sequence'].includes(m)) {
				merged.mode = m as Mode;
			}
		}
		const bind = (k: string, field: keyof Initial): void => {
			const n = parseIntParam(k);
			if (n !== undefined) (merged[field] as number) = n;
		};
		bind('s', 'seconds');
		bind('f', 'focusSec');
		bind('sb', 'shortBreakSec');
		bind('lb', 'longBreakSec');
		bind('rd', 'rounds');
		bind('rbl', 'roundsBeforeLongBreak');
		bind('w', 'workSec');
		bind('r', 'restSec');
		bind('p', 'prepareSec');
		if (params.get('kr') === '1') merged.keepRunning = true;
		if (params.get('auto') === '1') merged.autoStart = true;
		if (params.has('seq')) {
			const steps = decodeBase64Json<SequenceStep[]>(params.get('seq')!);
			if (steps?.length) {
				merged.mode = 'sequence';
				merged.steps = steps;
			}
		}

		if (!hasParams && !pageInitial) {
			const s = loadSession();
			if (s) {
				const marker = {} as Initial;
				(marker as unknown as Record<string, unknown>)[SESSION_MARKER] = s;
				return marker;
			}
		}
		return merged;
	}

	private applyPrefsToLibs(): void {
		sound.setVolume(this.prefs.volume);
		sound.setMuted(this.prefs.muted);
		notify.setVibrateEnabled(this.prefs.vibrateEnabled);
		applyHtmlTheme();
	}

	private applyTheme(t: string): void {
		setTheme(t as 'light' | 'dark' | 'system');
		applyHtmlTheme();
	}

	/* ------------------------------ cards ------------------------------ */

	private card(): Card | undefined {
		return this.cards.find((c) => c.id === this.activeId);
	}

	private createCard(initial?: Initial): void {
		const session = (initial as unknown as Record<string, unknown>)[SESSION_MARKER] as SessionState | undefined;
		if (session) {
			const cfg = configFromInitial({ mode: session.config.mode });
			Object.assign(cfg, session.config);
			const eng = new TimerEngine(cfg);
			if (session.state === 'running' || session.state === 'paused') {
				const ph = eng.machine.initial(cfg);
				if (session.round && ph.totalRounds) ph.round = session.round;
				if (session.stepIndex >= 0) ph.stepIndex = session.stepIndex;
				eng.restore(ph, session.state as RunState, session.remainingSec);
			}
			this.addCard(eng, this.labelFor(cfg));
			return;
		}
		const cfg = configFromInitial(initial ?? {});
		const eng = new TimerEngine(cfg);
		eng.autoAdvance = this.prefs.autoAdvance;
		eng.autoRestart = this.prefs.autoRestart;
		if (initial?.keepRunning !== undefined) cfg.keepRunning = initial.keepRunning;
		else cfg.keepRunning = this.prefs.keepRunning;
		this.addCard(eng, initial?.label ?? this.labelFor(cfg));
		if (initial?.autoStart === true) eng.start();
	}

	private labelFor(cfg: TimerConfig): string {
		if (cfg.mode === 'timer' || cfg.mode === 'meditation') {
			return formatDurationSec(cfg.durationSec);
		}
		return MODE_NAMES[cfg.mode];
	}

	private addCard(eng: TimerEngine, label: string): void {
		const id = `t${this.nextId++}`;
		const card: Card = { id, engine: eng, label, lastRender: 0 };
		this.cards.push(card);
		this.activeId = id;
		eng.on((e) => this.onEngine(card, e));
	}

	private setActive(id: string): void {
		this.activeId = id;
		this.closeDialogs();
		this.renderAll();
	}

	private removeCard(id: string): void {
		const i = this.cards.findIndex((c) => c.id === id);
		if (i < 0) return;
		this.cards.splice(i, 1);
		if (this.cards.length === 0) this.createCard({});
		else if (this.activeId === id) this.setActive(this.cards[Math.min(i, this.cards.length - 1)].id);
		else this.renderAll();
	}

	private applyInitialToActive(initial: Initial): void {
		const card = this.card();
		if (!card) return;
		const cfg = configFromInitial(initial);
		const eng = new TimerEngine(cfg);
		eng.autoAdvance = this.prefs.autoAdvance;
		eng.autoRestart = this.prefs.autoRestart;
		if (initial.keepRunning !== undefined) cfg.keepRunning = initial.keepRunning;
		else cfg.keepRunning = this.prefs.keepRunning;
		card.engine = eng;
		card.label = initial.label ?? this.labelFor(cfg);
		card.lastRender = 0;
		this.laps = [];
		eng.on((e) => this.onEngine(card, e));
		if (initial.autoStart) eng.start();
		if (!initial.autoStart) this.saveSession();
		this.renderAll();
	}

	private resetActiveWith(cfg: TimerConfig): void {
		const card = this.card();
		if (!card) return;
		const eng = new TimerEngine(cfg);
		eng.autoAdvance = this.prefs.autoAdvance;
		eng.autoRestart = this.prefs.autoRestart;
		card.engine = eng;
		card.lastRender = 0;
		eng.on((e) => this.onEngine(card, e));
		this.saveSession();
		this.renderAll();
	}

	/* ------------------------------ engine events ------------------------------ */

	private onEngine(card: Card, e: { type: string; totalSec: number }): void {
		switch (e.type) {
			case 'state':
				this.saveSessionNow();
				this.renderControls();
				this.renderTabs();
				break;
			case 'phase':
				this.playPhaseSound(card.engine);
				if (card.id === this.activeId) {
					this.renderPhase();
					this.renderDisplay();
					this.renderControls();
				}
				break;
			case 'zero':
				this.onZero(card.engine);
				break;
			case 'finish':
				this.onFinish(card);
				break;
		}
	}

	private onZero(eng: TimerEngine): void {
		if (eng.phase.kind !== 'step') this.playCue(this.prefs.sound);
		notify.vibrate();
		requestAnimationFrame(() => this.renderDisplay());
	}

	private playPhaseSound(eng: TimerEngine): void {
		if (eng.config.mode === 'sequence') this.playCue(eng.phase.stepSound);
	}

	private onFinish(card: Card): void {
		const eng = card.engine;
		if (eng.config.mode === 'stopwatch') return;
		this.playCue(this.prefs.sound);
		notify.vibrate([300, 150, 300, 150, 500]);
		if (this.prefs.notifyEnabled && document.hidden) {
			notify.notifyWhenHidden({
				title: `${MODE_NAMES[eng.config.mode]} concluído`,
				body: eng.phase.label || MODE_NAMES[eng.config.mode],
			});
		}
		requestAnimationFrame(() => {
			this.renderDisplay();
			this.renderControls();
		});
		if (eng.autoRestart) {
			eng.reset();
			eng.start();
		}
		this.saveSessionNow();
	}

	/* ------------------------------ sounds ------------------------------ */

	private playCue(kind?: SoundKind): void {
		sound.playCue(kind ?? 'digital');
	}

	/* ------------------------------ display / render ------------------------------ */

	private timeText(): string {
		const card = this.card();
		if (!card) return '00:00';
		const eng = card.engine;
		const sec = eng.totalSec();
		if (eng.config.mode === 'stopwatch') return formatClock(sec);
		const overtime = eng.phase.isElapsed && eng.state !== 'idle';
		if (overtime && sec > 0) return `+${formatClock(sec)}`;
		return formatClock(sec);
	}

	private fraction(): number | null {
		const card = this.card();
		if (!card) return 0;
		const ph = card.engine.phase;
		if (ph.isElapsed) return null;
		if (ph.durationSec <= 0) return 0;
		return clamp(ph.remainingSec / ph.durationSec, 0, 1);
	}

	private renderDisplay(): void {
		const card = this.card();
		if (!card) return;
		this.display.render({
			timeText: this.timeText(),
			fraction: this.fraction(),
			finished: card.engine.state === 'finished',
			running: card.engine.state === 'running',
			initial: card.engine.state === 'idle',
		});
	}

	private renderPhase(): void {
		const el = byId('t-phase');
		if (!el) return;
		const card = this.card();
		if (!card) return;
		const ph = card.engine.phase;
		const roundTxt =
			ph.totalRounds > 0
				? ` · ${STR.roundOf(ph.round, ph.totalRounds)}`
				: ph.stepIndex >= 0 && card.engine.config.steps.length
					? ` · ${STR.stepOf(ph.stepIndex + 1, card.engine.config.steps.length)}`
					: '';
		const name = card.label ? `${esc(card.label)}` : '';
		const html = `<span class="chip">${esc(ph.label)}${roundTxt}</span>${name ? `<span class="text-sm text-muted">${name}</span>` : ''}`;
		if (html === this.lastPhaseHtml) return;
		this.lastPhaseHtml = html;
		el.innerHTML = html;
	}

	private renderControls(): void {
		const el = byId('t-controls');
		if (!el) return;
		const card = this.card();
		if (!card) return;
		const eng = card.engine;
		const st = eng.state;
		const canAdvance = !!eng.machine.onSkip(eng.config, eng.phase);
		const isElapsedFamily = eng.config.mode === 'stopwatch';

		const primary = (label: string, icon: string, act: string): string =>
			`<button type="button" class="btn-primary min-w-[11rem]" data-act="${act}">${icon}${label}</button>`;
		const chip = (act: string, label: string, icon = '', extra = ''): string =>
			`<button type="button" class="btn-chip" data-act="${act}" ${extra}>${icon}${label}</button>`;

		let main: string;
		if (st === 'running') main = primary(STR.pause, I.pause, 'toggle');
		else if (st === 'idle') main = primary(STR.start, I.play, 'toggle');
		else if (st === 'paused') main = primary(STR.resume, I.play, 'toggle');
		else main = primary(STR.restart, I.reset, 'toggle');

		const parts = [main];
		if (isElapsedFamily) {
			parts.push(chip('lap', STR.lap, I.flag));
		} else {
			parts.push(chip('add', '1 min', I.plus));
			parts.push(chip('sub', '1 min', I.minus));
		}
		if (canAdvance) parts.push(chip('skip', STR.skip, I.skip));
		parts.push(chip('reset', STR.reset, I.reset));
		parts.push(chip('fs', STR.fullscreen, I.expand));

		el.innerHTML = parts.join('');
	}

	private recordLap(): void {
		const card = this.card();
		if (!card || card.engine.config.mode !== 'stopwatch') return;
		if (card.engine.state !== 'running') return;
		const total = card.engine.totalSec();
		const prev = this.laps.length ? this.laps[this.laps.length - 1].total : 0;
		this.laps.push({ total, delta: total - prev });
		this.renderLaps();
	}

	private renderLaps(): void {
		const el = byId('t-laps');
		if (!el) return;
		const card = this.card();
		const isSw = card?.engine.config.mode === 'stopwatch';
		if (!isSw || !this.laps.length) {
			el.hidden = true;
			el.innerHTML = '';
			return;
		}
		const rows = [...this.laps]
			.reverse()
			.map((l, i) => {
				const lapNum = this.laps.length - i;
				return `<div class="lap-row">
					<span class="text-muted">${STR.lap} ${lapNum}</span>
					<span class="tabular">${formatClock(l.delta)}</span>
					<span class="tabular text-muted">${formatClock(l.total)}</span>
				</div>`;
			})
			.join('');
		el.hidden = false;
		el.innerHTML = `<div class="w-full flex flex-col gap-1 mt-2">${rows}</div>`;
	}

	private renderModeSeg(): void {
		const el = byId('t-mode');
		if (!el) return;
		const card = this.card();
		const cur = card?.engine.config.mode ?? 'timer';
		const seg = `<div class="seg" role="tablist" aria-label="Tipo de cronômetro">
			${(Object.keys(MODE_NAMES) as Array<keyof typeof MODE_NAMES>)
				.map(
					(m) =>
						`<button type="button" role="tab" aria-selected="${m === cur}" class="seg-item" data-act="mode" data-mode="${m}">${MODE_NAMES[m]}</button>`,
				)
				.join('')}
		</div>`;
		el.innerHTML = seg;
	}

	private renderTabs(): void {
		const el = byId('t-tabs');
		if (!el) return;
		if (this.cards.length <= 1) {
			el.innerHTML = '';
			return;
		}
		const chips = this.cards
			.map((c, i) => {
				const active = c.id === this.activeId;
				const time = formatClock(c.engine.totalSec());
				const running = c.engine.state === 'running';
				const inner = `<button type="button" class="tab-main" data-act="tab" data-id="${c.id}" role="tab" aria-selected="${active}">
						<span class="font-medium">${esc(c.label)}</span>
						<span class="tabular text-muted">${time}</span>
						${running ? '<span class="dot-running" aria-hidden="true"></span>' : ''}
					</button>
					<button type="button" class="chip-x" data-act="tab-close" data-id="${c.id}" aria-label="Fechar timer">×</button>`;
				void i;
				return `<span role="presentation" class="tab-chip ${active ? 'chip-active' : 'chip-inactive'}">${inner}</span>`;
			})
			.join('');
		el.innerHTML = `<div class="flex items-center gap-2 overflow-x-auto pb-1">${chips}<button type="button" class="btn-chip flex-none" data-act="new-timer">${I.plus}<span>${STR.newTimer}</span></button></div>`;
	}

	private renderConfig(): void {
		const el = byId('t-config');
		if (!el) return;
		const card = this.card();
		if (!card) return;
		const cfg = card.engine.config;
		const open = this.configOpen;
		const num = (key: string, val: number, min: number, max: number, label: string, unit: 'min' | 'sec' | 'count' = 'min'): string =>
			`<label class="flex flex-col gap-1 text-xs font-medium text-muted"><span>${label}</span>
				<input class="field-input w-24" type="number" inputmode="numeric" min="${min}" max="${max}" value="${val}" data-cfg="${key}" data-unit="${unit}"/>
			</label>`;

		let fields = '';
		if (cfg.mode === 'timer' || cfg.mode === 'meditation') {
			const d = cfg.durationSec;
			const h = Math.floor(d / 3600);
			const mi = Math.floor((d % 3600) / 60);
			const s = d % 60;
			fields = `
				<label class="flex flex-col gap-1 text-xs font-medium text-muted"><span>Horas</span><input class="field-input w-20" type="number" min="0" max="23" value="${h}" data-dur="h"/></label>
				<label class="flex flex-col gap-1 text-xs font-medium text-muted"><span>Minutos</span><input class="field-input w-20" type="number" min="0" max="59" value="${mi}" data-dur="m"/></label>
				<label class="flex flex-col gap-1 text-xs font-medium text-muted"><span>Segundos</span><input class="field-input w-20" type="number" min="0" max="59" value="${s}" data-dur="s"/></label>`;
		} else if (cfg.mode === 'pomodoro') {
			fields = [
				num('focus', cfg.focusSec / 60, 1, 120, 'Foco (min)'),
				num('short', cfg.shortBreakSec / 60, 1, 60, 'Pausa curta (min)'),
				num('long', cfg.longBreakSec / 60, 1, 120, 'Pausa longa (min)'),
				num('rounds', cfg.rounds, 1, 20, 'Ciclos', 'count'),
				num('rbl', cfg.roundsBeforeLongBreak, 1, 10, 'Longa a cada', 'count'),
			].join('');
		} else if (cfg.mode === 'interval') {
			fields = [
				num('work', cfg.workSec, 1, 3600, 'Esforço (s)', 'sec'),
				num('rest', cfg.restSec, 1, 3600, 'Descanso (s)', 'sec'),
				num('rounds', cfg.rounds, 1, 99, 'Rodadas', 'count'),
				num('prepare', cfg.prepareSec, 0, 600, 'Preparo (s)', 'sec'),
			].join('');
		} else if (cfg.mode === 'sequence') {
			fields = `<div class="flex flex-wrap items-center gap-2">
				<button type="button" class="btn-chip" data-act="seq-edit">${I.timer}${STR.configButton} sequência</button>
				<span class="text-sm text-muted">${cfg.steps.length} etapas · ${esc(formatDurationSec(cfg.steps.reduce((a, s) => a + s.seconds, 0)))}</span>
			</div>`;
		}

		const flag = (key: string, label: string, checked: boolean, tip: string): string =>
			`<label class="flex items-center gap-2 text-sm" title="${tip}">
				<input type="checkbox" class="accent-[var(--color-accent)]" data-flag="${key}" ${checked ? 'checked' : ''}/>
				<span>${label}</span>
			</label>`;
		const flags: string[] = [];
		if (cfg.mode !== 'stopwatch') flags.push(flag('keepRunning', 'Continuar após o zero', cfg.keepRunning, STR.overtimeSetting));
		if (cfg.mode === 'pomodoro' || cfg.mode === 'interval' || cfg.mode === 'sequence') {
			flags.push(flag('autoAdvance', 'Avançar fases sozinho', this.prefs.autoAdvance, STR.autoAdvance));
		}
		if (cfg.mode !== 'stopwatch') {
			flags.push(flag('autoRestart', 'Recomeçar automaticamente', this.prefs.autoRestart, STR.autoRestart));
		}

		const rows = [
			`<div class="flex flex-wrap items-end gap-4">${fields || '<span class="text-sm text-muted">Sem configurações.</span>'}</div>`,
			flags.length ? `<div class="flex flex-wrap items-center gap-x-5 gap-y-2">${flags.join('')}</div>` : '',
			`<div class="flex flex-wrap items-center gap-2">
				<button type="button" class="btn-chip" data-act="preset-add">${I.plusCircle}<span>${STR.addPreset}</span></button>
				<button type="button" class="btn-chip" data-act="share">${I.share}<span>${STR.share}</span></button>
			</div>`,
		];

		el.innerHTML = `<div class="config-wrap">
			<button type="button" class="btn-chip ml-auto" data-act="cfg-toggle" aria-expanded="${open}">${I.gear}<span>${STR.configButton}</span></button>
			<div class="config-panel rounded-[18px] p-4 mt-2 flex flex-col gap-3" id="config-panel" ${open ? '' : 'hidden'}>
				${rows.join('')}
			</div>
		</div>`;
	}

	private renderPresets(): void {
		const el = byId('t-presets');
		if (!el) return;
		const quick = QUICK_PRESETS.map(chipPreset).join('');
		let recent = '';
		if (this.recentKeys.length) {
			const items = this.recentKeys
				.map((k) => this.recentItem(k))
				.filter((r): r is { label: string; initial: Initial } => !!r);
			if (items.length) {
				recent = `<div class="mt-3">
					<p class="text-xs font-medium text-muted uppercase tracking-wide">${STR.recent}</p>
					<div class="flex flex-wrap gap-2 mt-2">${items
						.slice(0, 10)
						.map(
							(it) =>
								`<button type="button" class="chip chip-inactive" data-act="recent" data-initial='${esc(JSON.stringify(it.initial))}'>${esc(it.label)}</button>`,
						)
						.join('')}</div>
				</div>`;
			}
		}
		let custom = '';
		if (this.customPresets.length) {
			custom = `<div class="mt-3">
				<p class="text-xs font-medium text-muted uppercase tracking-wide">${STR.customPresets}</p>
				<div class="flex flex-wrap gap-2 mt-2">${this.customPresets
					.map(
						(p) =>
							`<span class="chip chip-inactive">
								<button type="button" class="tab-main" data-act="custom" data-key="${esc(p.id)}">${esc(p.name)}</button>
								<button type="button" class="chip-x" data-act="custom-del" data-key="${esc(p.id)}" aria-label="Remover">×</button>
							</span>`,
					)
					.join('')}</div>
			</div>`;
		}
		el.innerHTML = `
			<p class="text-xs font-medium text-muted uppercase tracking-wide">${STR.popular}</p>
			<div class="flex flex-wrap gap-2 mt-2">${quick}</div>
			${recent}
			${custom}`;
	}

	private renderCategories(): void {
		const el = byId('t-categories');
		if (!el) return;
		el.innerHTML = `<h2 class="text-lg font-semibold mb-3">${STR.useCases}</h2><div class="grid gap-6 sm:grid-cols-2">
			${CATEGORIES.map(
				(cat) => `<section>
					<h3 class="text-base font-semibold mb-2">${esc(cat.name)}</h3>
					<div class="flex flex-wrap gap-2">${cat.items
						.map(
							(it, i) =>
								`<button type="button" class="cat-btn" data-act="cat" data-c="${esc(cat.name)}" data-i="${i}" title="${esc(it.hint ?? '')}">${esc(it.label)}</button>`,
						)
						.join('')}</div>
				</section>`,
			).join('')}
		</div>`;
	}

	private renderChrome(): void {
		const el = byId('t-chrome');
		if (!el) return;
		const muted = this.prefs.muted;
		const theme = this.prefs.theme;
		const isDark = document.documentElement.classList.contains('dark');
		el.innerHTML = `<div class="flex items-center justify-between gap-2">
			<a href="/" class="text-sm font-semibold no-underline" style="color:var(--color-ink)">${esc(STR.appName)}</a>
			<div class="flex items-center gap-1">
				<button type="button" class="icon-btn" data-act="help" aria-label="${STR.help}" title="${STR.keyboardHint}">${I.help}</button>
				<button type="button" class="icon-btn" data-act="mute" aria-label="${muted ? STR.unmute : STR.mute}">${muted ? I.muted : I.volume}</button>
				<button type="button" class="icon-btn" data-act="theme" aria-label="Mudar tema" title="${STR.themeSetting}: ${THEME_NAMES[theme]}">${isDark ? I.sun : I.moon}</button>
			</div>
		</div>`;
	}

	private renderAll(): void {
		this.renderChrome();
		this.renderTabs();
		this.renderPhase();
		this.renderDisplay();
		this.renderControls();
		this.renderLaps();
		this.renderModeSeg();
		this.renderConfig();
		this.renderPresets();
		if (this.scope === 'full') this.renderCategories();
	}

	/* ------------------------------ loop ------------------------------ */

	private requestLoop(): void {
		const anyRunning = this.cards.some((c) => c.engine.state === 'running');
		if (anyRunning && !this.raf) {
			const loop = (): void => {
				this.raf = 0;
				const now = performance.now();
				let running = 0;
				let updated = false;
				for (const c of this.cards) {
					if (c.engine.state === 'running') {
						running++;
						c.engine.tick();
					}
					if (c.id === this.activeId && now - c.lastRender > 80) {
						c.lastRender = now;
						updated = true;
					}
				}
				if (updated) {
					this.renderDisplay();
					this.renderPhase();
					this.renderTabTitles();
				}
				if (running > 0) this.raf = requestAnimationFrame(loop);
			};
			this.raf = requestAnimationFrame(loop);
		}
	}

	private renderTabTitles(): void {
		const card = this.card();
		if (!card) return;
		const eng = card.engine;
		if (eng.config.mode === 'stopwatch') {
			tabLib.updateTitle(null);
			return;
		}
		tabLib.updateTitle(eng.totalSec());
		tabLib.updateFavicon(eng.state === 'running' ? eng.totalSec() : null);
	}

	/* ------------------------------ session persistence ------------------------------ */

	private saveSession(): void {
		clearTimeout(this.sessionTimer);
		this.sessionTimer = window.setTimeout(() => this.saveSessionNow(), 500);
	}

	private saveSessionNow(): void {
		this.saveSessionFor(this.cards[0]);
	}

	private saveSessionFor(card: Card | undefined): void {
		if (!card) {
			saveSession(null);
			return;
		}
		const eng = card.engine;
		if ((eng.config.mode === 'stopwatch' || eng.config.mode === 'timer') && eng.state === 'idle') {
			saveSession(null);
			return;
		}
		saveSession({
			config: { ...eng.config },
			phaseIndex: eng.phase.index,
			remainingSec: eng.totalSec(),
			round: eng.phase.round,
			stepIndex: eng.phase.stepIndex,
			state: eng.state === 'running' || eng.state === 'paused' ? eng.state : 'paused',
			savedAt: Date.now(),
		});
	}

	/* ------------------------------ dialogs ------------------------------ */

	private closeDialogs(): void {
		document.querySelectorAll<HTMLDialogElement>('.t-dialog').forEach((d) => {
			if (d.open) d.close();
		});
	}

	private openDialog(id: string): void {
		const dlg = byId<HTMLDialogElement>(id);
		if (!dlg || typeof dlg.showModal !== 'function') return;
		if (!dlg.open) dlg.showModal();
	}

	private openHelpDialog(): void {
		const dlg = byId('dlg-help');
		if (!dlg) return;
		const rows: Array<[string, string]> = [
			['Espaço ou Enter', 'Iniciar / pausar'],
			['R', 'Redefinir'],
			['+ / -', 'Adicionar ou tirar 1 minuto'],
			['F', 'Modo foco (tela cheia)'],
			['M', 'Som ligado / desligado'],
			['?', 'Esta ajuda'],
			['Esc', 'Fechar diálogos / sair do modo foco'],
		];
		dlg.innerHTML = `<div class="dialog-content">
			<div class="flex items-center justify-between gap-4 mb-4">
				<h2 class="text-lg font-semibold">${STR.help}</h2>
				<button type="button" class="icon-btn" data-act="dlg-close" aria-label="Fechar">${I.close}</button>
			</div>
			<table class="w-full text-sm">
				<tbody>${rows
					.map(
						([k, v]) =>
							`<tr class="border-b" style="border-color:var(--color-hairline)"><td class="py-2 font-medium whitespace-nowrap"><kbd class="kbd">${k}</kbd></td><td class="py-2 pl-4 text-muted">${v}</td></tr>`,
					)
					.join('')}
				</tbody>
			</table>
			<p class="text-xs text-muted mt-4">${STR.appName} funciona offline. Instale como aplicativo pelo menu do navegador.</p>
		</div>`;
		this.openDialog('dlg-help');
	}

	private openSettings(): void {
		const dlg = byId('dlg-settings');
		if (!dlg) return;
		const notifyState = notify.permissionState();
		const soundOpts = Object.entries(SOUND_NAMES)
			.map(([v, l]) => `<option value="${v}"${v === this.prefs.sound ? ' selected' : ''}>${l}</option>`)
			.join('');
		const displayOpts = Object.entries(DISPLAY_NAMES)
			.map(([v, l]) => `<option value="${v}"${v === this.prefs.displayStyle ? ' selected' : ''}>${l}</option>`)
			.join('');
		const themeOpts = THEMES.map(
			(t) => `<option value="${t}"${t === this.prefs.theme ? ' selected' : ''}>${THEME_NAMES[t]}</option>`,
		).join('');
		const notifyRow =
			notifyState === 'granted'
				? `<span class="text-xs text-muted">Notificações ativadas.</span>`
				: notifyState === 'denied'
					? `<span class="text-xs text-muted">Notificações bloqueadas no navegador.</span>`
					: `<button type="button" class="btn-chip" data-act="notif">${I.bell}Ativar notificações</button>`;

		dlg.innerHTML = `<div class="dialog-content">
			<div class="flex items-center justify-between gap-4 mb-4">
				<h2 class="text-lg font-semibold">${STR.settings}</h2>
				<button type="button" class="icon-btn" data-act="dlg-close" aria-label="Fechar">${I.close}</button>
			</div>
			<div class="flex flex-col gap-4">
				<label class="flex flex-col gap-1 text-sm">
					<span class="font-medium">${STR.chooseSound}</span>
					<select class="field-input w-full" data-set="sound" data-change>${soundOpts}</select>
				</label>
				<div class="flex items-center gap-3">
					<input type="range" min="0" max="100" step="1" value="${Math.round(this.prefs.volume * 100)}" class="flex-1" style="accent-color:var(--color-accent)" data-set="volume" data-input-range aria-label="${STR.volume}"/>
					<span class="text-sm tabular w-10 text-right text-muted">${Math.round(this.prefs.volume * 100)}</span>
					<button type="button" class="btn-chip" data-act="sound-test">${I.bell}${STR.soundTest}</button>
				</div>
				<label class="flex flex-col gap-1 text-sm">
					<span class="font-medium">${STR.displayStyle}</span>
					<select class="field-input w-full" data-set="display" data-change>${displayOpts}</select>
				</label>
				<label class="flex flex-col gap-1 text-sm">
					<span class="font-medium">${STR.themeSetting}</span>
					<select class="field-input w-full" data-set="theme" data-change>${themeOpts}</select>
				</label>
				<div class="flex flex-col gap-2">
					<label class="flex items-center gap-2 text-sm">
						<input type="checkbox" class="accent-[var(--color-accent)]" data-set="wake" data-change ${this.prefs.keepScreenOn ? 'checked' : ''}/>
						<span>${STR.keepScreen}</span>
					</label>
					<label class="flex items-center gap-2 text-sm">
						<input type="checkbox" class="accent-[var(--color-accent)]" data-set="vibe" data-change ${this.prefs.vibrateEnabled ? 'checked' : ''}/>
						<span>${STR.vibration}</span>
					</label>
					<div class="flex items-center gap-2 text-sm">${notifyRow}</div>
				</div>
			</div>
		</div>`;
		this.openDialog('dlg-settings');
	}

	private openSeqDialog(): void {
		const card = this.card();
		if (!card) return;
		this.pendingSequence = card.engine.config.steps.slice();
		this.renderSeqDialog(undefined);
		this.openDialog('dlg-seq');
	}

	private renderSeqDialog(tpl: { name: string } | null = null): void {
		const dlg = byId('dlg-seq');
		if (!dlg) return;
		dlg.innerHTML = seqDialogHtml(this.pendingSequence ?? [], tpl);
	}

	private openShareDialog(): void {
		const dlg = byId('dlg-share');
		if (!dlg) return;
		const url = buildShareUrl(this.initialForActive());
		dlg.innerHTML = `<div class="dialog-content">
			<div class="flex items-center justify-between gap-4 mb-4">
				<h2 class="text-lg font-semibold">${STR.share}</h2>
				<button type="button" class="icon-btn" data-act="dlg-close" aria-label="Fechar">${I.close}</button>
			</div>
			<p class="text-sm text-muted mb-3">Abrindo este link, o timer já vem configurado.</p>
			<input class="field-input w-full mb-3 text-sm" readonly value="${esc(url)}" aria-label="Link"/>
			<div class="flex flex-wrap gap-2 mb-3">
				<button type="button" class="btn-primary" data-act="share-copy">${I.link}${STR.copyLink}</button>
				<button type="button" class="btn-chip" data-act="share-native" ${canNativeShare() ? '' : 'hidden'}>${I.share}${STR.share}</button>
			</div>
			<div class="flex flex-col items-center gap-2">
				<button type="button" class="btn-chip" data-act="share-qr">${I.qr}${STR.qrCode}</button>
				<img id="share-qr-img" alt="" width="220" height="220" class="rounded-xl hidden"/>
				<span id="share-qr-hint" class="text-xs text-muted" hidden>${STR.qrHint}</span>
			</div>
			<p class="text-xs text-muted mt-3" data-share-state></p>
		</div>`;
		this.openDialog('dlg-share');
	}

	/* ------------------------------ handlers ------------------------------ */

	private async handleAct(el: HTMLElement): Promise<void> {
		const act = el.dataset.act as string | undefined;
		if (!act) return;
		switch (act) {
case 'mode': {
			const mode = el.dataset.mode as Mode;
			const target = MODE_PATHS[mode];
			if (target && currentPagePath() !== target) {
				window.location.assign(target);
				break;
			}
			this.setMode(mode);
			break;
		}
			case 'toggle':
				this.toggleActive();
				break;
			case 'reset':
				this.card()?.engine.reset();
				this.laps = [];
				this.saveSession();
				this.renderAll();
				this.requestLoop();
				break;
			case 'skip':
				this.card()?.engine.skip();
				this.saveSession();
				this.renderAll();
				this.requestLoop();
				break;
			case 'add':
				this.addTimeActive(60);
				break;
			case 'sub':
				this.addTimeActive(-60);
				break;
			case 'tab':
				this.setActive(el.dataset.id as string);
				break;
			case 'tab-close':
				this.removeCard(el.dataset.id as string);
				break;
			case 'new-timer':
				this.laps = [];
				this.createCard({});
				this.saveSession();
				this.renderAll();
				this.requestLoop();
				break;
			case 'lap':
				this.recordLap();
				break;
			case 'quick': {
				const sec = Number(el.dataset.sec);
				this.applyInitialToActive({ seconds: sec, mode: 'timer', label: formatDurationSec(sec) });
				this.remember({ label: formatDurationSec(sec), initial: { seconds: sec, mode: 'timer' } });
				break;
			}
			case 'recent': {
				const raw = el.dataset.initial;
				if (raw) {
					try {
						this.applyInitialToActive(JSON.parse(raw));
					} catch {
						/* ignore */
					}
				}
				break;
			}
			case 'custom': {
				const p = this.customPresets.find((x) => x.id === el.dataset.key);
				if (p) this.applyInitialToActive({ seconds: p.seconds, label: p.name });
				break;
			}
			case 'custom-del': {
				const id = el.dataset.key as string;
				this.customPresets = this.customPresets.filter((x) => x.id !== id);
				saveCustomPresets(this.customPresets);
				this.renderPresets();
				break;
			}
			case 'cat': {
				const cName = el.dataset.c as string;
				const i = Number(el.dataset.i);
				const item = CATEGORIES.find((c) => c.name === cName)?.items[i];
				if (item) {
					this.applyInitialToActive({ ...item.initial, label: item.label });
					this.remember(item);
				}
				break;
			}
			case 'preset-add':
				this.addCustomPreset();
				break;
			case 'fs':
				void fs.toggle();
				break;
			case 'mute':
				this.prefs.muted = !this.prefs.muted;
				sound.setMuted(this.prefs.muted);
				savePrefs(this.prefs);
				this.renderChrome();
				break;
case 'theme': {
			const isDark = document.documentElement.classList.contains('dark');
			const next = isDark ? 'light' : 'dark';
			this.prefs.theme = next;
			this.applyTheme(next);
			savePrefs(this.prefs);
			this.renderChrome();
			this.renderConfig();
			break;
		}
			case 'cfg-toggle':
				this.configOpen = !this.configOpen;
				this.renderConfig();
				break;
			case 'seq-edit':
				this.openSeqDialog();
				break;
			case 'seq-save':
				this.seqSave();
				break;
			case 'share':
				this.openShareDialog();
				break;
			case 'share-copy': {
				const url = buildShareUrl(this.initialForActive());
				const ok = await copyToClipboard(url);
				this.shareToast(ok ? STR.copied : 'Não foi possível copiar.');
				break;
			}
			case 'share-native': {
				if (canNativeShare()) void nativeShare(this.sharePayload());
				break;
			}
			case 'share-qr': {
				const img = byId<HTMLImageElement>('share-qr-img');
				if (!img) return;
				img.classList.remove('hidden');
				img.src = '';
				img.setAttribute('alt', 'Carregando QR…');
				void qrDataUrl(buildShareUrl(this.initialForActive())).then((u) => {
					img.src = u;
					img.setAttribute('alt', STR.qrCode);
					byId('share-qr-hint')?.removeAttribute('hidden');
				}).catch(() => {
					this.shareToast('QR indisponível.');
				});
				break;
			}
			case 'notif':
				void notify.askPermission().then((ok) => {
					if (ok) this.prefs.notifyEnabled = true;
					savePrefs(this.prefs);
					this.openSettings();
				});
				break;
			case 'sound-test':
				this.playCue(this.prefs.sound);
				break;
			case 'help':
				this.openHelpDialog();
				break;
			case 'settings':
				this.openSettings();
				break;
			case 'dlg-close':
				this.closeDialogs();
				break;
			case 'tpl': {
				const i = Number(el.dataset.i);
				const tpl = SAMPLE_SEQUENCES[i];
				if (tpl) {
					this.pendingSequence = tpl.steps.slice();
					this.renderSeqDialog({ name: tpl.name });
				}
				break;
			}
		}
	}

	/* ------------------------------ sequence ops ------------------------------ */

	private seqSave(): void {
		const card = this.card();
		if (!card) return;
		const steps = (this.pendingSequence ?? []).filter((s) => s.seconds > 0);
		this.configOpen = true;
		card.engine.config.steps = steps;
		card.label = `${MODE_NAMES.sequence} · ${steps.length} etapas`;
		this.closeDialogs();
		this.resetActiveWith(card.engine.config);
	}

	private shareToast(msg: string): void {
		const stateEl = byId('dlg-share')?.querySelector('[data-share-state]');
		if (stateEl) {
			stateEl.textContent = msg;
			setTimeout(() => {
				stateEl.textContent = '';
			}, 2500);
		}
	}

	private recentItem(key: string): { label: string; initial: Initial } | null {
		try {
			const parsed = JSON.parse(key) as { label?: string; initial?: Initial };
			if (parsed && typeof parsed === 'object' && parsed.initial) {
				return { label: parsed.label ?? 'Temporizador', initial: parsed.initial };
			}
			return null;
		} catch {
			const n = Number(key);
			if (Number.isFinite(n) && n > 0) return { label: formatDurationSec(n), initial: { seconds: n } };
			return null;
		}
	}

	private addCustomPreset(): void {
		const card = this.card();
		if (!card) return;
		const cfg = card.engine.config;
		const name = cfg.mode === 'timer' || cfg.mode === 'meditation' ? this.labelFor(cfg) : MODE_NAMES[cfg.mode];
		const item: PresetItem = { id: `p${Date.now()}`, name, seconds: cfg.durationSec };
		this.customPresets = [item, ...this.customPresets].slice(0, 20);
		saveCustomPresets(this.customPresets);
		this.renderPresets();
	}

	private remember(value: unknown): void {
		const key = typeof value === 'string' ? value : JSON.stringify(value);
		this.recentKeys = [key, ...this.recentKeys.filter((k) => k !== key)].slice(0, 30);
		this.prefs.recent = this.recentKeys;
		savePrefs(this.prefs);
		this.renderPresets();
	}

	private initialForActive(): Initial {
		const card = this.card();
		if (!card) return {};
		const cfg = card.engine.config;
		return {
			mode: cfg.mode,
			seconds: cfg.durationSec,
			focusSec: cfg.focusSec,
			shortBreakSec: cfg.shortBreakSec,
			longBreakSec: cfg.longBreakSec,
			rounds: cfg.rounds,
			roundsBeforeLongBreak: cfg.roundsBeforeLongBreak,
			workSec: cfg.workSec,
			restSec: cfg.restSec,
			prepareSec: cfg.prepareSec,
			steps: cfg.steps,
			keepRunning: cfg.keepRunning,
			label: card.label,
		};
	}

	private sharePayload(): { title: string; text: string; url: string } {
		const card = this.card() as Card;
		const cfg = card.engine.config;
		const label = card.label;
		return {
			title: `${MODE_NAMES[cfg.mode]} · ${label} — Temporizador Online`,
			text: `Comece agora: ${label}`,
			url: buildShareUrl(this.initialForActive()),
		};
	}

	/* ------------------------------ helpers ------------------------------ */

	private setMode(mode: Mode): void {
		const card = this.card();
		if (!card || card.engine.config.mode === mode) return;
		this.applyInitialToActive({ mode });
	}

	private toggleActive(): void {
		const card = this.card();
		if (!card) return;
		const eng = card.engine;
		if (eng.state === 'finished') eng.reset();
		eng.toggle();
		sound.unlockAudio();
		this.saveSession();
		this.renderAll();
		this.requestLoop();
	}

	private addTimeActive(delta: number): void {
		const card = this.card();
		if (!card) return;
		card.engine.addTime(delta);
		this.saveSession();
		this.renderDisplay();
		this.renderTabs();
		this.renderPhase();
	}

	private applyDurationInputs(): void {
		const card = this.card();
		if (!card) return;
		const get = (d: string): number => {
			const el = document.querySelector<HTMLInputElement>(`[data-dur="${d}"]`);
			const n = Number(el?.value ?? 0);
			return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
		};
		card.engine.config.durationSec = clamp(get('h') * 3600 + get('m') * 60 + get('s'), 0, 86400);
		this.applyConfigChange();
	}

	private applyConfigChange(): void {
		const cfg = this.card()?.engine.config;
		if (!cfg) return;
		this.resetActiveWith({ ...cfg });
		this.renderAll();
	}

	private handleChange(el: HTMLElement): void {
		const cfgKey = el.dataset.cfg;
		if (cfgKey) {
			const card = this.card();
			if (!card) return;
			const c = card.engine.config;
			const val = Number((el as HTMLInputElement).value);
			const unit = (el.dataset.unit ?? 'min') as 'min' | 'sec' | 'count';
			const mult = unit === 'min' ? 60 : 1;
			const clamped = clamp(Math.round(val) * mult, unit === 'sec' ? 1 : 0, 86400);
			const setters: Record<string, (v: number) => void> = {
				focus: (v) => (c.focusSec = v),
				short: (v) => (c.shortBreakSec = v),
				long: (v) => (c.longBreakSec = v),
				rounds: (v) => (c.rounds = Math.max(1, Math.round(v))),
				rbl: (v) => (c.roundsBeforeLongBreak = Math.max(1, Math.round(v))),
				work: (v) => (c.workSec = v),
				rest: (v) => (c.restSec = v),
				prepare: (v) => (c.prepareSec = v),
			};
			const set = setters[cfgKey];
			if (set) set(clamped);
			this.applyConfigChange();
			return;
		}
		if (el.dataset.dur) {
			this.applyDurationInputs();
			return;
		}
		const flag = el.dataset.flag;
		if (flag) {
			const on = (el as HTMLInputElement).checked;
			const card = this.card();
			if (!card) return;
			if (flag === 'keepRunning') {
				card.engine.config.keepRunning = on;
			} else if (flag === 'autoAdvance') {
				this.prefs.autoAdvance = on;
				card.engine.autoAdvance = on;
				savePrefs(this.prefs);
			} else if (flag === 'autoRestart') {
				this.prefs.autoRestart = on;
				card.engine.autoRestart = on;
				savePrefs(this.prefs);
			}
			this.saveSession();
			return;
		}
	}

	private applySetting(set: string, el: HTMLElement): void {
		const input = el as HTMLInputElement | HTMLSelectElement;
		const v = input.value;
		switch (set) {
			case 'sound':
				this.prefs.sound = v as SoundKind;
				break;
			case 'display':
				this.prefs.displayStyle = v as Preferences['displayStyle'];
				this.display.setStyle(this.prefs.displayStyle);
				this.renderDisplay();
				break;
			case 'theme':
				this.prefs.theme = v as Preferences['theme'];
				this.applyTheme(v);
				savePrefs(this.prefs);
				this.renderChrome();
				break;
			case 'volume': {
				const vol = clamp(Number(v) / 100, 0, 1);
				this.prefs.volume = vol;
				sound.setVolume(vol);
				break;
			}
			case 'wake': {
				this.prefs.keepScreenOn = (input as HTMLInputElement).checked;
				if (this.prefs.keepScreenOn) void wakelock.request();
				else wakelock.release();
				break;
			}
			case 'vibe': {
				this.prefs.vibrateEnabled = (input as HTMLInputElement).checked;
				notify.setVibrateEnabled(this.prefs.vibrateEnabled);
				break;
			}
		}
		savePrefs(this.prefs);
	}

	private handleSeqInput(el: HTMLElement): void {
		const steps = this.pendingSequence;
		if (!steps) return;
		const name = el.dataset.seqName;
		const sec = el.dataset.seqSec;
		const snd = el.dataset.seqSound;
		const idx = Number(name ?? sec ?? snd);
		const st = steps[idx];
		if (!st) return;
		const input = el as HTMLInputElement | HTMLSelectElement;
		if (name !== undefined) st.name = input.value.slice(0, 40);
		else if (sec !== undefined) {
			const n = Number(input.value);
			if (Number.isFinite(n)) st.seconds = clamp(Math.round(n), 1, 21600);
		} else if (snd !== undefined) st.sound = input.value as SoundKind;
	}

	private handleSeqOp(el: HTMLElement): void {
		const op = el.dataset.seq as string | undefined;
		if (!op) return;
		const steps = this.pendingSequence;
		if (!steps) return;
		if (op === 'add') {
			steps.push({ id: `s${Date.now()}-${steps.length}`, name: `Etapa ${steps.length + 1}`, seconds: 60, sound: 'beep' });
			this.renderSeqDialog(null);
			return;
		}
		if (op === 'clear') {
			this.pendingSequence = [];
			this.renderSeqDialog(null);
			return;
		}
		const idx = Number(el.dataset.idx);
		if (!Number.isFinite(idx)) return;
		if (op === 'up' && idx > 0) {
			[steps[idx - 1], steps[idx]] = [steps[idx], steps[idx - 1]];
		} else if (op === 'down' && idx < steps.length - 1) {
			[steps[idx], steps[idx + 1]] = [steps[idx + 1], steps[idx]];
		} else if (op === 'del') {
			steps.splice(idx, 1);
		}
		this.renderSeqDialog(null);
	}

	/* ------------------------------ wiring ------------------------------ */

	private skeleton(): string {
		const full = this.scope === 'full';
		return `<div class="app card-app flex flex-col gap-4">
			<div id="t-chrome"></div>
			<div id="t-tabs"></div>
			<div class="flex flex-col items-center gap-2" id="t-hero">
				<div id="t-phase" class="min-h-[1.6rem] flex items-center gap-2 flex-wrap justify-center"></div>
				<div id="t-display" class="w-full flex justify-center"></div>
				<div id="t-controls" class="flex flex-wrap items-center justify-center gap-3"></div>
				<div id="t-laps" class="w-full" hidden></div>
			</div>
			<div class="mt-1 flex justify-center" id="t-mode"></div>
			<div id="t-config"></div>
			<div id="t-presets"></div>
			${full ? `<div id="t-categories" class="mt-3 pt-4 border-t" style="border-color:var(--color-hairline)"></div>` : ''}
		</div>
		${dialogShell('dlg-settings')}
		${dialogShell('dlg-help')}
		${dialogShell('dlg-share')}
		${dialogShell('dlg-seq')}`;
	}

	private install(): void {
		const root = this.root;

		root.addEventListener('click', (e: Event) => {
			const t = e.target as HTMLElement;
			if (t.tagName === 'DIALOG' && (t as HTMLDialogElement).open) {
				this.closeDialogs();
				return;
			}
			const el = t.closest<HTMLElement>('[data-act],[data-seq]');
			if (!el) return;
			if (el.dataset.act) {
				this.handleAct(el);
				return;
			}
			if (el.dataset.seq) {
				this.handleSeqOp(el);
				return;
			}
		});

		root.addEventListener('change', (e: Event) => {
			const el = e.target as HTMLInputElement | HTMLSelectElement | HTMLDivElement;
			if (el.dataset?.set) {
				this.applySetting(el.dataset.set, el);
				return;
			}
			if (el.dataset?.cfg) {
				this.handleChange(el);
				return;
			}
			if (el.dataset?.dur) {
				this.handleChange(el);
				return;
			}
			if (el.dataset?.flag) {
				this.handleChange(el);
				return;
			}
			if (el.dataset?.seqName || el.dataset?.seqSec || el.dataset?.seqSound) {
				this.handleSeqInput(el);
			}
		});

		root.addEventListener('input', (e: Event) => {
			const el = e.target as HTMLInputElement;
			if (el.dataset?.inputRange !== undefined && el.dataset?.set) {
				const row = el.parentElement?.querySelector<HTMLElement>('span.tabular');
				if (row) row.textContent = el.value;
				this.applySetting(el.dataset.set, el);
			}
		});

		document.addEventListener('keydown', (e: KeyboardEvent) => this.onKey(e));
		document.addEventListener('visibilitychange', () => {
			if (this.prefs.keepScreenOn) wakelock.onVisibility(document.hidden);
		});
		fs.onNativeChange((on) => {
			if (!on && fs.isPresenting()) void fs.exit();
			this.renderControls();
		});
		window.addEventListener('resize', () => this.renderDisplay());
	}

	private onKey(e: KeyboardEvent): void {
		const t = e.target as HTMLElement | null;
		const typing =
			t instanceof HTMLInputElement || t instanceof HTMLSelectElement || t instanceof HTMLTextAreaElement || (t?.isContentEditable ?? false);
		if (typing) return;
		const anyOpen = document.querySelector('.t-dialog[open]');

		if (e.key === 'Escape') {
			if (anyOpen) {
				this.closeDialogs();
				e.preventDefault();
			} else if (fs.isPresenting()) {
				void fs.exit();
			}
			return;
		}
		if (anyOpen) return;

		const k = e.key.toLowerCase();
		if (e.key === ' ') {
			e.preventDefault();
			this.toggleActive();
		} else if (k === 'r') {
			this.card()?.engine.reset();
			this.saveSession();
			this.renderAll();
			this.requestLoop();
		} else if (e.key === '+') {
			this.addTimeActive(60);
		} else if (e.key === '-' || e.key === '_') {
			this.addTimeActive(-60);
		} else if (k === 'f') {
			void fs.toggle();
		} else if (k === 'm') {
			this.prefs.muted = !this.prefs.muted;
			sound.setMuted(this.prefs.muted);
			savePrefs(this.prefs);
			this.renderChrome();
		} else if (e.key === '?') {
			this.openHelpDialog();
		}
	}
}

/* ------------------------------ module helpers ------------------------------ */

function dialogShell(id: string): string {
	return `<dialog id="${id}" class="t-dialog"></dialog>`;
}

function chipPreset(p: LaunchPreset): string {
	const sec = p.initial.seconds ?? 300;
	return `<button type="button" class="chip chip-inactive" data-act="quick" data-sec="${sec}">${esc(p.label)}</button>`;
}

export function applyHtmlTheme(): void {
	const raw = getTheme();
	const dark =
		raw === 'dark' || (raw === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
	document.documentElement.classList.toggle('dark', dark);
}