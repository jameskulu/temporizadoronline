/**
 * Fast, viewport-aware tooltips.
 *
 * Renders `data-tip` text into a single floating chip on <body>, so it can
 * never be clipped, and clamps its position to the viewport. Long localized
 * strings stay centered on the target and never bleed off-screen.
 * Replaces native `title` tooltips (~500ms delay).
 */

const MARGIN = 8;
const GAP = 8;
const DELAY = 60;
const HIDE_SLACK = 150;

let tip: HTMLDivElement | null = null;
let arrow: HTMLSpanElement | null = null;
let current: HTMLElement | null = null;
let showTimer = 0;
let hideTimer = 0;
let bound = false;

function el(): HTMLDivElement | null {
	if (tip) return tip;
	const node = document.createElement('div');
	node.className = 'tip';
	arrow = document.createElement('span');
	arrow.className = 'tip-arrow';
	node.appendChild(arrow);
	document.body.appendChild(node);
	tip = node;
	return tip;
}

function show(target: HTMLElement): void {
	const node = el();
	if (!node || !arrow) return;
	const text = target.getAttribute('data-tip');
	if (!text) return;
	current = target;
	node.textContent = text;
	node.appendChild(arrow);

	const rect = target.getBoundingClientRect();
	const tw = node.offsetWidth;
	const th = node.offsetHeight;

	let left = rect.left + rect.width / 2 - tw / 2;
	left = Math.max(MARGIN, Math.min(left, window.innerWidth - tw - MARGIN));

	const placeBelow =
		rect.bottom + GAP + th <= window.innerHeight - MARGIN ||
		rect.top - GAP - th < MARGIN;

	let top: number;
	node.classList.remove('tip-above');
	if (placeBelow) {
		top = rect.bottom + GAP;
		arrow.style.top = '-5px';
		arrow.style.bottom = 'auto';
	} else {
		top = rect.top - GAP - th;
		node.classList.add('tip-above');
		arrow.style.top = 'auto';
		arrow.style.bottom = '-5px';
	}

	let ax = rect.left + rect.width / 2 - left;
	ax = Math.max(12, Math.min(ax, tw - 12));
	arrow.style.left = `${Math.round(ax)}px`;

	node.style.left = `${Math.round(left)}px`;
	node.style.top = `${Math.round(top)}px`;
	node.classList.add('tip-visible');
	node.classList.add('tip-start');
	requestAnimationFrame(() => node?.classList.remove('tip-start'));
}

function hide(): void {
	window.clearTimeout(showTimer);
	window.clearTimeout(hideTimer);
	current = null;
	if (tip) tip.classList.remove('tip-visible');
}

function schedule(target: HTMLElement): void {
	if (target instanceof HTMLDetailsElement && target.open) return;
	window.clearTimeout(hideTimer);
	if (current === target && tip?.classList.contains('tip-visible')) {
		show(target);
		return;
	}
	window.clearTimeout(showTimer);
	showTimer = window.setTimeout(() => show(target), DELAY);
}

function scheduleHide(): void {
	window.clearTimeout(showTimer);
	window.clearTimeout(hideTimer);
	hideTimer = window.setTimeout(hide, HIDE_SLACK);
}

export function initTip(): void {
	if (bound) return;
	bound = true;

	document.addEventListener('pointerover', (e) => {
		const t = e.target as Element | null;
		if ((e as PointerEvent).pointerType === 'touch') return;
		const hit = t?.closest<HTMLElement>('[data-tip]');
		if (hit) schedule(hit);
	}, true);

	document.addEventListener('pointerout', (e) => {
		const t = e.target as Element | null;
		const to = (e as PointerEvent).relatedTarget as Element | null;
		if (t?.closest('[data-tip]') && !(to && t.contains(to))) scheduleHide();
	}, true);

	document.addEventListener('focusin', (e) => {
		const hit = (e.target as Element | null)?.closest<HTMLElement>('[data-tip]');
		if (hit) schedule(hit);
	});

	document.addEventListener('focusout', () => scheduleHide());

	document.addEventListener('click', hide, true);
	document.addEventListener('scroll', hide, true);
	window.addEventListener('resize', hide);
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') hide();
	});
}