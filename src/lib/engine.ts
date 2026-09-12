/** Timestamp-based countdown engine + per-mode phase machines. */
import type { Phase, PhaseKind, RunState, TimerConfig } from './types';

export interface EngineEvent {
	type: 'tick' | 'phase' | 'zero' | 'finish' | 'state';
	totalSec: number;
}

export interface Machine {
	initial(config: TimerConfig): Phase;
	/** Called when a finite phase reaches zero. Returns the next phase or null (finished). */
	onEnd(config: TimerConfig, ph: Phase): Phase | null;
	/** Called when the user skips the current phase. Returns next phase or null. */
	onSkip(config: TimerConfig, ph: Phase): Phase | null;
}

let _phaseOrdinal = 0;
function makePhase(
	kind: PhaseKind,
	label: string,
	durationSec: number,
	extra: Partial<Phase> = {},
): Phase {
	_phaseOrdinal++;
	return {
		kind,
		label,
		durationSec,
		isElapsed: durationSec === Infinity || kind === 'elapsed' || kind === 'overtime',
		remainingSec: durationSec === Infinity ? 0 : Math.max(0, Math.round(durationSec)),
		elapsedBase: 0,
		anchorTs: 0,
		round: 0,
		totalRounds: 0,
		stepIndex: -1,
		stepName: '',
		stepSound: 'digital',
		index: _phaseOrdinal,
		...extra,
	};
}

export function secondsFromPhase(ph: Phase, now: number): { remaining: number; elapsed: number } {
	if (ph.isElapsed) {
		const elapsed = Math.max(0, ph.elapsedBase + (ph.anchorTs ? (now - ph.anchorTs) / 1000 : 0));
		return { remaining: -Infinity, elapsed };
	}
	const remaining = ph.anchorTs
		? ph.remainingSec - (now - ph.anchorTs) / 1000
		: ph.remainingSec;
	return { remaining, elapsed: 0 };
}

/* ------------------------------ machines ------------------------------ */

export const timerMachine: Machine = {
	initial(cfg) {
		return makePhase('countdown', 'Temporizador', cfg.durationSec);
	},
	onEnd(_cfg, ph) {
		if (ph.kind === 'overtime') return null;
		return null;
	},
	onSkip(_cfg, _ph) {
		return null;
	},
};

export const stopwatchMachine: Machine = {
	initial() {
		return makePhase('elapsed', 'Cronômetro', Infinity);
	},
	onEnd() {
		return null;
	},
	onSkip() {
		return null;
	},
};

export const meditationMachine: Machine = {
	initial(cfg) {
		return makePhase('countdown', 'Meditação', cfg.durationSec);
	},
	onEnd() {
		return null;
	},
	onSkip() {
		return null;
	},
};

export const pomodoroMachine: Machine = {
	initial(cfg) {
		return makePhase('focus', 'Foco', cfg.focusSec, { round: 1, totalRounds: cfg.rounds });
	},
	onEnd(cfg, ph) {
		const round = ph.round;
		if (ph.kind === 'focus') {
			if (round >= cfg.rounds) return null; // finished after last focus
			const isLong = round % cfg.roundsBeforeLongBreak === 0;
			return makePhase(
				isLong ? 'longBreak' : 'shortBreak',
				isLong ? 'Pausa longa' : 'Pausa curta',
				isLong ? cfg.longBreakSec : cfg.shortBreakSec,
				{ round, totalRounds: cfg.rounds },
			);
		}
		return makePhase('focus', 'Foco', cfg.focusSec, {
			round: round + 1,
			totalRounds: cfg.rounds,
		});
	},
	onSkip(cfg, ph) {
		return pomodoroMachine.onEnd(cfg, ph);
	},
};

export const intervalMachine: Machine = {
	initial(cfg) {
		return cfg.prepareSec > 0
			? makePhase('prepare', 'Prepare-se', cfg.prepareSec, { round: 1, totalRounds: cfg.rounds })
			: makePhase('work', 'Trabalho', cfg.workSec, { round: 1, totalRounds: cfg.rounds });
	},
	onEnd(cfg, ph) {
		const round = ph.round || 1;
		if (ph.kind === 'prepare') {
			return makePhase('work', 'Trabalho', cfg.workSec, { round: 1, totalRounds: cfg.rounds });
		}
		if (ph.kind === 'work') {
			return makePhase('rest', 'Descanso', cfg.restSec, { round, totalRounds: cfg.rounds });
		}
		// rest
		if (round >= cfg.rounds) return null; // finished after last rest
		return makePhase('work', 'Trabalho', cfg.workSec, {
			round: round + 1,
			totalRounds: cfg.rounds,
		});
	},
	onSkip(cfg, ph) {
		return intervalMachine.onEnd(cfg, ph);
	},
};

export const sequenceMachine = (steps: TimerConfig['steps']): Machine => ({
	initial() {
		const first = steps[0];
		return makePhase('step', first?.name || 'Sequência', first?.seconds ?? 0, {
			stepIndex: 0,
			stepName: first?.name || '',
			stepSound: first?.sound ?? 'digital',
		});
	},
	onEnd(_cfg, ph) {
		const i = ph.stepIndex;
		const next = steps[i + 1];
		if (!next) return null;
		return makePhase('step', next.name, next.seconds, {
			stepIndex: i + 1,
			stepName: next.name,
			stepSound: next.sound,
		});
	},
	onSkip(_cfg, ph) {
		return this.onEnd(_cfg, ph);
	},
});

export function machineFor(cfg: TimerConfig): Machine {
	switch (cfg.mode) {
		case 'stopwatch':
			return stopwatchMachine;
		case 'pomodoro':
			return pomodoroMachine;
		case 'interval':
			return intervalMachine;
		case 'meditation':
			return meditationMachine;
		case 'sequence':
			return sequenceMachine(cfg.steps);
		default:
			return timerMachine;
	}
}

/* ------------------------------ engine ------------------------------ */

export class TimerEngine {
	config: TimerConfig;
	phase: Phase;
	state: RunState = 'idle';
	autoAdvance = true;
	autoRestart = false;
	machine: Machine;
	private listeners = new Set<(e: EngineEvent) => void>();

	constructor(config: TimerConfig) {
		this.config = config;
		this.machine = machineFor(config);
		this.phase = this.machine.initial(config);
	}

	on(cb: (e: EngineEvent) => void): void {
		this.listeners.add(cb);
	}

	private emit(e: EngineEvent): void {
		for (const cb of this.listeners) cb(e);
	}

	start(): void {
		if (this.state === 'finished' && !this.phase.isElapsed && this.phase.remainingSec <= 0 && !this.autoRestart) {
			this.reset();
		}
		this.phase.anchorTs = typeof performance !== 'undefined' ? performance.now() : Date.now();
		this.state = 'running';
		this.emit({ type: 'state', totalSec: this.totalSec() });
	}

	pause(): void {
		if (this.state !== 'running') return;
		const { remaining, elapsed } = secondsFromPhase(this.phase, nowMs());
		if (this.phase.isElapsed) this.phase.elapsedBase = elapsed;
		else this.phase.remainingSec = Math.max(0, Math.ceil(remaining));
		this.phase.anchorTs = 0;
		this.state = 'paused';
		this.emit({ type: 'state', totalSec: this.totalSec() });
	}

	toggle(): void {
		if (this.state === 'running') this.pause();
		else this.start();
	}

	reset(): void {
		this.phase = this.machine.initial(this.config);
		this.state = 'idle';
		this.emit({ type: 'phase', totalSec: this.totalSec() });
	}

	/** Advance to the next phase (after a zero or user skip). */
	private advance(next: Phase | null): boolean {
		if (next) {
			this.phase = next;
			this.phase.anchorTs = nowMs();
			return true;
		}
		this.state = 'finished';
		this.emit({ type: 'finish', totalSec: this.totalSec() });
		return false;
	}

	skip(): void {
		if (this.state === 'idle') return;
		const next = this.machine.onSkip(this.config, this.phase);
		const hadNext = this.advance(next);
		if (hadNext) this.emit({ type: 'phase', totalSec: this.totalSec() });
	}

	/** Add/subtract seconds to the current countdown (temporizador family). */
	addTime(deltaSec: number): void {
		const ph = this.phase;
		if (ph.isElapsed) return;
		if (this.state === 'running') {
			const { remaining } = secondsFromPhase(ph, nowMs());
			ph.remainingSec = Math.max(0, Math.round(remaining) + deltaSec);
			ph.anchorTs = nowMs();
		} else {
			ph.remainingSec = Math.max(0, Math.round(ph.remainingSec) + deltaSec);
		}
		this.emit({ type: 'tick', totalSec: this.totalSec() });
	}

	setDuration(sec: number): void {
		if (this.config.mode === 'timer' || this.config.mode === 'meditation') {
			this.config.durationSec = Math.max(0, Math.round(sec));
			this.reset();
		}
	}

	/** Called each animation frame while any timer runs. */
	tick(): void {
		if (this.state !== 'running') return;
		const now = nowMs();
		const { remaining } = secondsFromPhase(this.phase, now);

		if (!this.phase.isElapsed && remaining <= 0) {
			// reaches zero
			const ph = this.phase;
			ph.remainingSec = 0;
			ph.anchorTs = 0;
			this.emit({ type: 'zero', totalSec: this.totalSec() });

			const isCountdownFamily =
				this.config.mode === 'timer' || this.config.mode === 'meditation';

			if (this.config.keepRunning && isCountdownFamily) {
				// Overtime: keep counting up past zero
				this.phase = {
					...ph,
					kind: ph.kind === 'countdown' ? 'overtime' : ph.kind,
					isElapsed: true,
					durationSec: Infinity,
					elapsedBase: 0,
					anchorTs: now,
					remainingSec: 0,
				};
				this.emit({ type: 'phase', totalSec: this.totalSec() });
				return;
			}

			const next = this.machine.onEnd(this.config, ph);
			if (!next) {
				this.state = 'finished';
				this.emit({ type: 'finish', totalSec: this.totalSec() });
				return;
			}
			if (this.autoAdvance) {
				this.phase = next;
				this.phase.anchorTs = now;
				this.emit({ type: 'phase', totalSec: this.totalSec() });
			} else {
				// hold the finished phase, present the next one ready to run
				this.phase = next;
				this.phase.anchorTs = 0;
				this.state = 'paused';
				this.emit({ type: 'phase', totalSec: this.totalSec() });
			}
			return;
		}

		this.emit({ type: 'tick', totalSec: this.totalSec() });
	}

	totalSec(): number {
		const { remaining, elapsed } = secondsFromPhase(this.phase, nowMs());
		return this.phase.isElapsed ? Math.floor(elapsed) : Math.max(0, Math.ceil(remaining));
	}

	/** Restore a persisted session. */
	restore(ph: Phase, state: RunState, remainingSec: number): void {
		this.phase = ph;
		this.phase.remainingSec = remainingSec;
		this.phase.anchorTs = 0;
		this.state = state;
		this.emit({ type: 'phase', totalSec: this.totalSec() });
	}
}

function nowMs(): number {
	return typeof performance !== 'undefined' ? performance.now() : Date.now();
}