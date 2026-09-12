/** Time formatting helpers (pt-BR aware). */

/** "mmm:ss" -> always at least mm:ss; hours appear only when >= 3600s. */
export function formatClock(totalSec: number, opts: { hours?: boolean; sign?: boolean } = {}): string {
	const sign = totalSec < 0 ? '-' : opts.sign ? '+' : '';
	const abs = Math.max(0, Math.round(Math.abs(totalSec)));
	const h = Math.floor(abs / 3600);
	const m = Math.floor((abs % 3600) / 60);
	const s = abs % 60;
	const mm = String(m).padStart(2, '0');
	const ss = String(s).padStart(2, '0');
	if (h > 0 || opts.hours) return `${sign}${String(h).padStart(2, '0')}:${mm}:${ss}`;
	return `${sign}${mm}:${ss}`;
}

/** Full duration with units in pt-BR, e.g. "5 minutos" or "1 hora e 30 minutos". */
export function formatDurationSec(totalSec: number): string {
	const abs = Math.round(Math.abs(totalSec));
	const h = Math.floor(abs / 3600);
	const m = Math.floor((abs % 3600) / 60);
	const s = abs % 60;
	const parts: string[] = [];
	if (h > 0) parts.push(`${h} ${h === 1 ? 'hora' : 'horas'}`);
	if (m > 0) parts.push(`${m} ${m === 1 ? 'minuto' : 'minutos'}`);
	if (s > 0 && h === 0) parts.push(`${s} ${s === 1 ? 'segundo' : 'segundos'}`);
	return parts.length ? parts.join(' e ') : '0 minutos';
}

export function formatInt(n: number): string {
	return new Intl.NumberFormat('pt-BR').format(n);
}

export function formatMinutes(minutes: number): string {
	return minutes === 1 ? '1 minuto' : `${minutes} minutos`;
}

/** Short clock for chips: mm:ss (no hours) */
export function formatShortClock(sec: number): string {
	return formatClock(sec, {});
}

export function clamp(n: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, n));
}