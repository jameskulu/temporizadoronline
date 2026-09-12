/** Shareable timer URLs + Web Share / clipboard / QR helpers. */
import type { Initial } from './types';
import { initialFromConfig, type TimerConfig } from './types';

export const SITE_URL = 'https://meutemporizadoronline.com';

/** Clean duration slugs that map to canonical SEO pages. */
export const PRETTY_SECONDS = new Map<number, string>([
	[60, '1-minuto'],
	[180, '3-minutos'],
	[300, '5-minutos'],
	[600, '10-minutos'],
	[900, '15-minutos'],
	[1200, '20-minutos'],
	[1500, '25-minutos'],
	[1800, '30-minutos'],
	[2700, '45-minutos'],
	[3600, '60-minutos'],
]);

export function configPath(initial: Initial): string {
	const mode = initial.mode || 'timer';
	const q = (params: Record<string, string>): string => {
		const qs = new URLSearchParams(params).toString();
		return qs ? `?${qs}` : '';
	};
	switch (mode) {
		case 'stopwatch':
			return '/cronometro/';
		case 'pomodoro': {
			const p: Record<string, string> = { f: String(initial.focusSec ?? 1500) };
			if (initial.shortBreakSec && initial.shortBreakSec !== 300) p.sb = String(initial.shortBreakSec);
			if (initial.longBreakSec && initial.longBreakSec !== 900) p.lb = String(initial.longBreakSec);
			if (initial.rounds && initial.rounds !== 8) p.rd = String(initial.rounds);
			if (initial.roundsBeforeLongBreak && initial.roundsBeforeLongBreak !== 4)
				p.rbl = String(initial.roundsBeforeLongBreak);
			return `/pomodoro/${q(p)}`;
		}
		case 'interval': {
			const p: Record<string, string> = { w: String(initial.workSec ?? 30), r: String(initial.restSec ?? 15) };
			if (initial.rounds && initial.rounds !== 8) p.rd = String(initial.rounds);
			if (initial.prepareSec && initial.prepareSec > 0) p.p = String(initial.prepareSec);
			return `/intervalos/${q(p)}`;
		}
		case 'meditation':
			return `/meditacao/${q(initial.seconds ? { s: String(initial.seconds) } : {})}`;
		case 'sequence':
			if (initial.steps?.length) {
				return `/sequencias/?seq=${encodeBase64Json(initial.steps)}`;
			}
			return '/sequencias/';
		default: {
			const seconds = initial.seconds ?? 300;
			const pretty = PRETTY_SECONDS.get(Math.round(seconds));
			if (pretty) return `/temporizador/${pretty}/`;
			const p: Record<string, string> = { s: String(Math.round(seconds)) };
			if (initial.keepRunning) p.kr = '1';
			return `/temporizador/${q(p)}`;
		}
	}
}

export function sharePath(initial: Initial): string {
	return configPath(initial);
}

export function buildShareUrl(initial: Initial): string {
	const path = sharePath(initial);
	return path.startsWith('http') ? path : `${SITE_URL}${path}`;
}

export function encodeBase64Json(value: unknown): string {
	const json = JSON.stringify(value);
	const bytes = new TextEncoder().encode(json);
	let bin = '';
	for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
	return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeBase64Json<T>(value: string): T | null {
	try {
		const b64 = value.replace(/-/g, '+').replace(/_/g, '/');
		const bin = atob(b64);
		const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
		return JSON.parse(new TextDecoder().decode(bytes)) as T;
	} catch {
		return null;
	}
}

export async function copyToClipboard(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		try {
			const ta = document.createElement('textarea');
			ta.value = text;
			ta.style.position = 'fixed';
			ta.style.opacity = '0';
			document.body.appendChild(ta);
			ta.select();
			const ok = document.execCommand('copy');
			ta.remove();
			return ok;
		} catch {
			return false;
		}
	}
}

export function canNativeShare(): boolean {
	return typeof navigator !== 'undefined' && !!navigator.share;
}

export async function nativeShare(payload: { title: string; text: string; url: string }): Promise<boolean> {
	if (!canNativeShare()) return false;
	try {
		await navigator.share(payload);
		return true;
	} catch {
		return false;
	}
}

/** Lazy-load the dependency-free QR generator and produce an SVG data URL. */
export async function qrDataUrl(text: string): Promise<string> {
	const mod = (await import('qrcode-generator')) as unknown as {
		default?: unknown;
		qrcode?: unknown;
	};
	const fac = (mod.default ?? mod.qrcode ?? mod) as (typeNumber: number, errorCorrectionLevel: string) => {
		addData: (t: string) => void;
		make: () => void;
		isDark: (r: number, c: number) => boolean;
		getModuleCount: () => number;
	};
	const qr = fac(0, 'M');
	qr.addData(text);
	qr.make();
	const size = qr.getModuleCount();
	const scale = 4;
	const pad = 24;
	const px = (size + 2) * scale + pad * 2;
	const cells = (): string => {
		let out = '';
		for (let r = 0; r < size; r++) {
			for (let c = 0; c < size; c++) {
				if (qr.isDark(r, c)) {
					const x = pad + (c + 1) * scale;
					const y = pad + (r + 1) * scale;
					out += `<rect x="${x}" y="${y}" width="${scale}" height="${scale}"/>`;
				}
			}
		}
		return out;
	};
	const svg =
		`<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 ${px} ${px}">` +
		`<rect width="${px}" height="${px}" fill="#ffffff"/>${cells()}</svg>`;
	return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/** Build a share payload from a config + pretty human label. */
export function payloadFor(config: TimerConfig, label?: string): { title: string; text: string; url: string } {
	const url = buildShareUrl(initialFromConfig(config, label));
	const title = label ? `${label} — Temporizador Online` : `Temporizador Online ${label ?? ''}`.trim();
	const text = `Configure um temporizador: ${label ?? url}`;
	return { title: title.trim(), text, url };
}