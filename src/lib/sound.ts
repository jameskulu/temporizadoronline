/** WebAudio synthesized notification sounds — no audio files required. */
import type { SoundKind } from './types';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let volume = 0.8;
let muted = false;

function ensureCtx(): AudioContext | null {
	if (typeof window === 'undefined') return null;
	if (!ctx) {
		const AC = window.AudioContext ??
			(window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
		if (!AC) return null;
		ctx = new AC();
		master = ctx.createGain();
		master.gain.value = 0;
		master.connect(ctx.destination);
	}
	if (ctx.state === 'suspended') void ctx.resume();
	return ctx;
}

/** Must be called from a user gesture at least once (iOS unlock). */
export function unlockAudio(): void {
	const c = ensureCtx();
	c;
}

export function setVolume(v: number): void {
	volume = Math.max(0, Math.min(1, v));
}

export function setMuted(m: boolean): void {
	muted = m;
}

export function isMuted(): boolean {
	return muted;
}

interface Tone {
	freq: number;
	start: number; // seconds after phase start
	dur: number;
	type: OscillatorType;
	gain: number;
}

const PATTERNS: Record<SoundKind, Tone[]> = {
	beep: [
		{ freq: 880, start: 0, dur: 0.14, type: 'square', gain: 0.28 },
		{ freq: 880, start: 0.24, dur: 0.14, type: 'square', gain: 0.28 },
		{ freq: 880, start: 0.48, dur: 0.26, type: 'square', gain: 0.28 },
	],
	digital: [
		{ freq: 660, start: 0, dur: 0.16, type: 'square', gain: 0.2 },
		{ freq: 880, start: 0.18, dur: 0.16, type: 'square', gain: 0.2 },
		{ freq: 1174, start: 0.36, dur: 0.2, type: 'square', gain: 0.2 },
	],
	chime: [
		{ freq: 698.46, start: 0, dur: 0.9, type: 'sine', gain: 0.3 },
		{ freq: 1046.5, start: 0.02, dur: 0.8, type: 'sine', gain: 0.16 },
	],
	zen: [
		{ freq: 220, start: 0, dur: 2.2, type: 'sine', gain: 0.34 },
		{ freq: 440, start: 0.06, dur: 1.6, type: 'sine', gain: 0.12 },
		{ freq: 660, start: 0.12, dur: 1.0, type: 'sine', gain: 0.05 },
	],
	bell: [
		{ freq: 830, start: 0, dur: 0.5, type: 'triangle', gain: 0.3 },
		{ freq: 1660, start: 0.02, dur: 0.4, type: 'sine', gain: 0.1 },
	],
};

/** Short cue used on phase transitions (distinct from the finish sound). */
export function playCue(kind: string): void {
	if (muted || volume <= 0) return;
	const c = ensureCtx();
	if (!c || !master) return;
	const t = c.currentTime;
	if (kind === 'up' || kind === 'down') {
		playTone({ freq: kind === 'up' ? 587 : 440, start: 0, dur: 0.1, type: 'sine', gain: 0.14 }, t);
		return;
	}
	const k = kind as SoundKind;
	const sound = Object.prototype.hasOwnProperty.call(PATTERNS, kind) ? k : 'digital';
	for (const tone of PATTERNS[sound]) playTone(tone, t);
}

export function play(kind: SoundKind): void {
	if (muted || volume <= 0) return;
	const c = ensureCtx();
	if (!c || !master) return;
	const t = c.currentTime;
	for (const tone of PATTERNS[kind]) playTone(tone, t);
}

function playTone(tone: Tone, t: number): void {
	if (!ctx || !master) return;
	const osc = ctx.createOscillator();
	const g = ctx.createGain();
	osc.type = tone.type;
	osc.frequency.value = tone.freq;
	const peak = tone.gain * volume;
	g.gain.setValueAtTime(0.0001, t + tone.start);
	g.gain.exponentialRampToValueAtTime(peak, t + tone.start + 0.01);
	g.gain.exponentialRampToValueAtTime(0.0001, t + tone.start + tone.dur);
	osc.connect(g);
	g.connect(master);
	osc.start(t + tone.start);
	osc.stop(t + tone.start + tone.dur + 0.05);
}