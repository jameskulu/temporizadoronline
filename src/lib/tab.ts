/** Browser tab title + dynamic favicon countdown. */
import { formatShortClock } from './format';

export const DEFAULT_TITLE = 'Temporizador Online — Cronômetro, Pomodoro e Intervalos';

let faviconEl: HTMLLinkElement | null = null;

export function updateTitle(timeSec: number | null, extra?: string): void {
	if (timeSec === null) {
		document.title = DEFAULT_TITLE;
		return;
	}
	const time = extra ? `${formatShortClock(timeSec)} ${extra}` : formatShortClock(timeSec);
	document.title = `${time} — Temporizador Online`;
}

/** Renders the current minutes onto a 32px canvas favicon (muted + readable). */
export function updateFavicon(timeSec: number | null, opts: { finished?: boolean } = {}): string | null {
	const canvas = document.createElement('canvas');
	canvas.width = 32;
	canvas.height = 32;
	const g = canvas.getContext('2d');
	if (!g) return null;

	const finished = opts.finished;
	const bg = finished ? '#d70015' : '#1d1d1f';
	roundRect(g, 0, 0, 32, 32, 7);
	g.fillStyle = bg;
	g.fill();

	if (finished) {
		g.fillStyle = '#ffffff';
		g.font = 'bold 20px system-ui, sans-serif';
		g.textAlign = 'center';
		g.textBaseline = 'middle';
		g.fillText('!', 16, 17);
	} else if (timeSec !== null) {
		const mins = Math.ceil(timeSec / 60);
		g.fillStyle = '#f5f5f7';
		g.font = '700 17px system-ui, -apple-system, sans-serif';
		g.textAlign = 'center';
		g.textBaseline = 'middle';
		const label = timeSec >= 3600 ? `${Math.floor(timeSec / 3600)}h` : String(mins);
		g.fillText(timeSec < 60 && timeSec > 0 ? String(timeSec) : timeSec === 0 ? '0' : label, 16, 17);
	} else {
		// idle: draw a small ring + dot
		g.strokeStyle = '#f5f5f7';
		g.lineWidth = 3;
		g.beginPath();
		g.arc(16, 16, 9, 0, Math.PI * 2);
		g.stroke();
		g.fillStyle = '#2997ff';
		g.beginPath();
		g.arc(16, 16, 2.6, 0, Math.PI * 2);
		g.fill();
	}

	const url = canvas.toDataURL('image/png');
	if (!faviconEl) {
		faviconEl = document.createElement('link');
		faviconEl.rel = 'icon';
		faviconEl.type = 'image/png';
		document.head.appendChild(faviconEl);
	}
	if (faviconEl.href !== url) faviconEl.href = url;
	return url;
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
	g.beginPath();
	g.moveTo(x + r, y);
	g.arcTo(x + w, y, x + w, y + h, r);
	g.arcTo(x + w, y + h, x, y + h, r);
	g.arcTo(x, y + h, x, y, r);
	g.arcTo(x, y, x + w, y, r);
	g.closePath();
}