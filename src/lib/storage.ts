/** localStorage persistence: user preferences, custom presets, sequences, session. */
import type { Preferences, PresetItem, SequenceStep, TimerConfig } from './types';
import { DEFAULT_PREFS, SESSION_KEY, STORAGE_KEY } from './types';

const THEME_KEY = 'to:theme';
type ThemeValue = 'light' | 'dark' | 'system';

export function safeParse<T>(raw: string | null, fallback: T): T {
	if (!raw) return fallback;
	try {
		return JSON.parse(raw) as T;
	} catch {
		return fallback;
	}
}

export function loadJson<T>(key: string, fallback: T): T {
	return safeParse(localStorage.getItem(key), fallback);
}

export function saveJson(key: string, value: unknown): void {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		/* storage full / unavailable */
	}
}

export function getTheme(): ThemeValue {
	const v = localStorage.getItem(THEME_KEY);
	return v === 'light' || v === 'dark' || v === 'system' ? v : 'system';
}

export function setTheme(t: ThemeValue): void {
	if (t === 'system') localStorage.removeItem(THEME_KEY);
	else localStorage.setItem(THEME_KEY, t);
}

export interface Store {
	prefs: Preferences;
	customPresets: PresetItem[];
	sequences: SequenceStep[][];
	session: SessionState | null;
}

export interface SessionState {
	config: TimerConfig;
	phaseIndex: number;
	remainingSec: number;
	round: number;
	stepIndex: number;
	state: 'running' | 'paused';
	savedAt: number;
}

function loadStore(): Partial<Store> {
	return safeParse(localStorage.getItem(STORAGE_KEY), {});
}

export function saveStorePartial(patch: Partial<Store>): void {
	const current = loadStore();
	saveJson(STORAGE_KEY, { ...current, ...patch });
}

export function loadPrefs(): Preferences {
	const store = loadStore();
	return { ...DEFAULT_PREFS, ...(store.prefs || {}) };
}

export function savePrefs(prefs: Preferences): void {
	saveStorePartial({ prefs });
}

export function loadCustomPresets(): PresetItem[] {
	return loadStore().customPresets || [];
}

export function saveCustomPresets(items: PresetItem[]): void {
	saveStorePartial({ customPresets: items });
}

export function loadSequences(): SequenceStep[][] {
	return loadStore().sequences || [];
}

export function saveSequences(sequences: SequenceStep[][]): void {
	saveStorePartial({ sequences });
}

export function loadSession(): SessionState | null {
	const s = safeParse(localStorage.getItem(SESSION_KEY), null as SessionState | null);
	if (!s || typeof s.savedAt !== 'number' || Date.now() - s.savedAt > 1000 * 60 * 60 * 24 * 7) {
		return null;
	}
	return s;
}

export function saveSession(s: SessionState | null): void {
	if (s) saveJson(SESSION_KEY, s);
	else localStorage.removeItem(SESSION_KEY);
}

export function rememberRecent(key: string): string[] {
	const prefs = loadPrefs();
	const recents = prefs.recent.filter((r) => r !== key);
	const next = [key, ...recents].slice(0, 30);
	savePrefs({ ...prefs, recent: next });
	return next;
}

export { THEME_KEY };