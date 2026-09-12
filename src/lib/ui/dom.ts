/** Tiny DOM/HTML helpers used by the app UI. */
export function esc(s: string | number | undefined | null): string {
	return String(s ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

export function byId<T extends HTMLElement = HTMLElement>(id: string): T | null {
	return document.getElementById(id) as T | null;
}

export function on<T extends Element>(
	el: T | null,
	ev: string,
	fn: (e: Event & { target: EventTarget | null }) => void,
): void {
	el?.addEventListener(ev, fn as EventListener);
}

export function onDelegate<T extends HTMLElement>(
	root: HTMLElement,
	ev: string,
	selector: string,
	fn: (el: T, e: Event) => void,
): void {
	root.addEventListener(ev, (e: Event) => {
		const target = e.target as Element | null;
		const match = target?.closest<HTMLElement>(selector);
		if (match) fn(match as unknown as T, e);
	});
}

export function setText(el: HTMLElement | null, text: string): void {
	if (el) el.textContent = text;
}

/** SVG icon primitives (24x24, stroke = currentColor). */
const S = (inner: string, extra = ''): string =>
	`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${inner}</svg>`;

export const I = {
	play: S('<path d="M7 4.5v15l12-7.5z"/>'),
	pause: S('<path d="M7 5v14M17 5v14"/>'),
	plus: S('<path d="M12 5v14M5 12h14"/>'),
	minus: S('<path d="M5 12h14"/>'),
	reset: S('<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>'),
	expand: S('<path d="M8 3H4a1 1 0 0 0-1 1v4"/><path d="M16 3h4a1 1 0 0 1 1 1v4"/><path d="M8 21H4a1 1 0 0 1-1-1v-4"/><path d="M16 21h4a1 1 0 0 0 1-1v-4"/>'),
	share: S('<circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="m8.4 10.8 7.2-4.5M8.4 13.2l7.2 4.5"/>'),
	gear: S('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.09a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z"/>'),
	help: S('<circle cx="12" cy="12" r="9"/><path d="M9.2 9a2.9 2.9 0 0 1 5.6.9c0 1.9-2.8 2.2-2.8 4"/><path d="M12 17.2h.01"/>'),
	volume: S('<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M15 9a4 4 0 0 1 0 6M17.6 6.6a7.5 7.5 0 0 1 0 10.8"/>'),
	muted: S('<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="m16 9 5 6M21 9l-5 6"/>'),
	sun: S('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
	moon: S('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'),
	close: S('<path d="M6 6l12 12M18 6 6 18"/>'),
	qr: S('<rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/><path d="M14 14h3v3M20 14v.01M14 20h.01M20 20h3v-3M21 17h2"/>'),
	link: S('<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1"/>'),
	check: S('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
	up: S('<path d="m6 14 6-6 6 6"/>'),
	down: S('<path d="m6 10 6 6 6-6"/>'),
	trash: S('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),
	plusCircle: S('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'),
	bell: S('<path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M10 21a2 2 0 0 0 4 0"/>'),
	battery: S('<rect x="2.5" y="8" width="16" height="8" rx="2"/><path d="M21.5 11v2"/>'),
	star: S('<path d="m12 3 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9 6.8 19l1-5.8L3.5 9.2l5.9-.8z"/>'),
	history: S('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>'),
	flag: S('<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>'),
	skip: S('<path d="M6 5v14l9-7z"/><path d="M18 5v14"/>'),
	timer: S('<rect x="9" y="2.5" width="6" height="4" rx="1.2"/><path d="M12 13.5V9"/><circle cx="12" cy="15.5" r="6"/>'),
};