/** Big timer display — four styles: digital, circular, bar, minimal. */
import type { DisplayStyle } from '../types';

export interface DisplayModel {
	timeText: string;
	/** remaining fraction 0..1, or null for count-up displays */
	fraction: number | null;
	finished: boolean;
	running: boolean;
	initial: boolean;
}

interface Refs {
	wrap: HTMLElement;
	time: HTMLElement;
	ring?: SVGCircleElement;
	bar?: HTMLElement;
	style: DisplayStyle;
	container: HTMLElement;
}

export class Display {
	private refs: Refs | null = null;
	private last = '';
	private wasFinished = false;

	constructor(private container: HTMLElement, private style: DisplayStyle) {}

	setStyle(style: DisplayStyle): void {
		if (this.style === style && this.refs) return;
		this.style = style;
		this.refs = null;
		this.container.innerHTML = '';
	}

	reset(): void {
		this.wasFinished = false;
	}

	private build(): Refs {
		const c = this.container;
		c.innerHTML = '';
		const wrap = document.createElement('div');
		wrap.className = 't-display flex items-center justify-center select-none';

		if (this.style === 'circular') {
			const svgNS = 'http://www.w3.org/2000/svg';
			const svg = document.createElementNS(svgNS, 'svg');
			svg.setAttribute('viewBox', '0 0 300 300');
			svg.setAttribute('class', 'block w-full h-full max-w-[min(80vw,560px)] transition-transform duration-500');
			const track = document.createElementNS(svgNS, 'circle');
			track.setAttribute('cx', '150');
			track.setAttribute('cy', '150');
			track.setAttribute('r', '138');
			track.setAttribute('fill', 'none');
			track.setAttribute('stroke', 'var(--color-hairline)');
			track.setAttribute('stroke-width', '7');
			const ring = document.createElementNS(svgNS, 'circle');
			ring.setAttribute('cx', '150');
			ring.setAttribute('cy', '150');
			ring.setAttribute('r', '138');
			ring.setAttribute('fill', 'none');
			ring.setAttribute('stroke', 'var(--color-accent)');
			ring.setAttribute('stroke-width', '7');
			ring.setAttribute('stroke-linecap', 'round');
			ring.setAttribute('stroke-dasharray', '867');
			ring.setAttribute('stroke-dashoffset', '0');
			ring.setAttribute('transform', 'rotate(-90 150 150)');
			svg.append(track, ring);

			// layers: SVG ring with the time centered
			const inner = document.createElement('div');
			inner.className = 'relative w-full max-w-[min(80vw,560px)]';
			const mask = document.createElement('div');
			mask.className = 'absolute inset-0 flex items-center justify-center pointer-events-none';
			const span = document.createElement('span');
			span.className = 'text-[clamp(2.4rem,13vw,6.5rem)] font-semibold tracking-tight tabular';
			span.setAttribute('aria-live', 'off');
			mask.append(span);
			inner.append(svg, mask);
			wrap.append(inner);
			c.append(wrap);

			return {
				wrap,
				container: c,
				time: span,
				ring,
				style: this.style,
			};
		}

		const time = document.createElement('div');
		time.className = this.contentClass();
		time.setAttribute('aria-live', 'off');
		wrap.append(time);

		let bar: HTMLElement | undefined;
		if (this.style === 'bar') {
			const track = document.createElement('div');
			track.className = 'mt-6 h-2 w-full max-w-[560px] rounded-full overflow-hidden';
			track.style.backgroundColor = 'var(--color-hairline)';
			bar = document.createElement('div');
			bar.className = 'h-full rounded-full transition-[width] duration-300 ease-linear';
			bar.style.backgroundColor = 'var(--color-accent)';
			bar.style.width = '100%';
			track.append(bar);
			wrap.append(track);
			wrap.classList.add('flex-col', 'gap-1', 'w-full');
		}

		c.append(wrap);
		return { wrap, container: c, time, bar, style: this.style };
	}

	private contentClass(): string {
		switch (this.style) {
			case 'minimal':
				return 'text-[clamp(2.4rem,12vw,5.5rem)] font-semibold tracking-tight tabular';
			case 'bar':
				return 'text-[clamp(2.6rem,12vw,6rem)] font-semibold tracking-tight tabular w-full text-center';
			default:
				return 'text-[clamp(3rem,16vw,7.5rem)] font-semibold tracking-tight tabular';
		}
	}

	private fit(text: string): void {
		const w = this.container.clientWidth;
		const len = text.length;
		if (!w || len < 2) return;
		const base = this.style === 'minimal' ? 5.5 : this.style === 'bar' ? 6 : 7.5;
		const fs = Math.min(Math.round((w / len) * 1.35), 300);
		const el = this.refs?.time;
		if (el) {
			el.style.fontSize = `${Math.min(fs, base * 16)}px`;
		}
	}

	render(model: DisplayModel): void {
		if (!this.refs) this.refs = this.build();
		const r = this.refs;
		const finishedNow = model.finished && !this.wasFinished;

		if (model.timeText !== this.last) {
			this.last = model.timeText;
			r.time.textContent = model.timeText;
			if (this.style === 'digital' || this.style === 'minimal' || this.style === 'bar') this.fit(model.timeText);
		}

		if (r.ring && r.time) {
			if (finishedNow) {
				r.ring.style.stroke = 'var(--color-danger)';
				r.wrap.classList.add('t-finish-pulse');
			} else if (this.wasFinished && !model.finished) {
				r.ring.style.stroke = 'var(--color-accent)';
			}
			const frac = model.fraction ?? 0;
			const circumference = 867;
			r.ring.style.strokeDashoffset = String(circumference * (1 - frac));
		}

		if (r.bar) {
			if (finishedNow) r.bar.style.backgroundColor = 'var(--color-danger)';
			else if (this.wasFinished && !model.finished) r.bar.style.backgroundColor = 'var(--color-accent)';
			r.bar.style.width = `${Math.round((model.fraction ?? 0) * 100)}%`;
		}

		if (finishedNow) this.wasFinished = true;
		else if (!model.finished) this.wasFinished = false;
	}
}