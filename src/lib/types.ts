/** Shared domain types for the timer application (client + server build). */

export type Mode = 'timer' | 'stopwatch' | 'pomodoro' | 'interval' | 'meditation' | 'sequence';

export type SoundKind = 'beep' | 'digital' | 'chime' | 'zen' | 'bell';
export const SOUNDS: SoundKind[] = ['beep', 'digital', 'chime', 'zen', 'bell'];

export type DisplayStyle = 'digital' | 'circular' | 'bar' | 'minimal';
export const DISPLAY_STYLES: DisplayStyle[] = ['digital', 'circular', 'bar', 'minimal'];

export type ThemePref = 'light' | 'dark' | 'system';
export const THEMES: ThemePref[] = ['light', 'dark', 'system'];

/** State of a phase: a discrete segment of a mode (focus, work, rest, step...). */
export type PhaseKind =
	| 'countdown'
	| 'overtime'
	| 'elapsed'
	| 'focus'
	| 'shortBreak'
	| 'longBreak'
	| 'work'
	| 'rest'
	| 'prepare'
	| 'step';

export type RunState = 'idle' | 'running' | 'paused' | 'finished';

export interface SequenceStep {
	id: string;
	name: string;
	seconds: number;
	sound: SoundKind;
}

export interface TimerConfig {
	mode: Mode;
	/** Temporizador / Meditação */
	durationSec: number;
	/** Pomodoro */
	focusSec: number;
	shortBreakSec: number;
	longBreakSec: number;
	roundsBeforeLongBreak: number;
	/** Pomodoro total focus blocks; Interval total rounds */
	rounds: number;
	/** Intervalo */
	workSec: number;
	restSec: number;
	prepareSec: number;
	/** Continue counting past zero (overtime) for the timer family */
	keepRunning: boolean;
	/** Sequência */
	steps: SequenceStep[];
}

export interface Phase {
	kind: PhaseKind;
	label: string;
	/** Target duration in seconds, or Infinity for count-up phases */
	durationSec: number;
	/** True when this phase counts up (stopwatch / overtime) */
	isElapsed: boolean;
	/** Current remaining seconds (finite phases) */
	remainingSec: number;
	/** Elapsed seconds base for count-up phases */
	elapsedBase: number;
	/** Anchor timestamp (ms) when the phase started/resumed running */
	anchorTs: number;
	/** Round indicator, 1-based (0 when not applicable) */
	round: number;
	totalRounds: number;
	/** Sequence step context */
	stepIndex: number;
	stepName: string;
	stepSound: SoundKind;
	/** Monotonic ordinal; also used as a React-style key for transitions */
	index: number;
}

export interface Preferences {
	theme: ThemePref;
	sound: SoundKind;
	volume: number;
	muted: boolean;
	displayStyle: DisplayStyle;
	notifyEnabled: boolean;
	vibrateEnabled: boolean;
	keepScreenOn: boolean;
	keepRunning: boolean;
	autoRestart: boolean;
	autoAdvance: boolean;
	recent: string[];
}

export interface SettingsLike {
	theme: ThemePref;
	sound: SoundKind;
	volume: number;
	muted: boolean;
	displayStyle: DisplayStyle;
	notifyEnabled: boolean;
	vibrateEnabled: boolean;
	keepScreenOn: boolean;
	keepRunning: boolean;
	autoRestart: boolean;
	autoAdvance: boolean;
	customPresets: PresetItem[];
	sequences: SequenceStep[][];
	recent: string[];
}

export interface PresetItem {
	id: string;
	name: string;
	seconds: number;
}

/** Serializable "open this timer" payload (SEO pages, share links, presets). */
export interface Initial {
	mode?: Mode;
	seconds?: number;
	focusSec?: number;
	shortBreakSec?: number;
	longBreakSec?: number;
	rounds?: number;
	roundsBeforeLongBreak?: number;
	workSec?: number;
	restSec?: number;
	prepareSec?: number;
	steps?: SequenceStep[];
	keepRunning?: boolean;
	autoStart?: boolean;
	label?: string;
}

export function initialFromConfig(cfg: TimerConfig, label?: string): Initial {
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
		label,
	};
}

export function defaultConfig(mode: Mode = 'timer'): TimerConfig {
	return {
		mode,
		durationSec: 300,
		focusSec: 1500,
		shortBreakSec: 300,
		longBreakSec: 900,
		roundsBeforeLongBreak: 4,
		rounds: 8,
		workSec: 30,
		restSec: 15,
		prepareSec: 3,
		keepRunning: false,
		steps: [],
	};
}

export const DEFAULT_PREFS: Preferences = {
	theme: 'system',
	sound: 'digital',
	volume: 0.8,
	muted: false,
	displayStyle: 'digital',
	notifyEnabled: true,
	vibrateEnabled: true,
	keepScreenOn: false,
	keepRunning: false,
	autoRestart: false,
	autoAdvance: true,
	recent: [],
};

export const STORAGE_KEY = 'to:v1';
export const SESSION_KEY = 'to:session';