/** Client bootstrap: reads the island root and creates the app. */
import { App, applyHtmlTheme } from './app';
import { initTip } from './ui/tip';
import { setStrings } from './strings';
import type { Initial } from './types';
import { getLangFromPath } from '../i18n/utils';
import type { Lang } from '../i18n/ui';

type Scope = 'full' | 'compact';

export function boot(): void {
	ready(() => {
		const root = document.getElementById('t-app');
		if (!root) return;
		if (root.getAttribute('data-booted') === 'true') return;
		root.setAttribute('data-booted', 'true');

		let initial: Initial | undefined;
		let scope: Scope = 'full';
		const rawInitial = root.getAttribute('data-initial');
		if (rawInitial) {
			try {
				initial = JSON.parse(rawInitial) as Initial;
			} catch {
				initial = undefined;
			}
		}
		const rawScope = root.getAttribute('data-scope');
		if (rawScope === 'compact') scope = 'compact';

		const lang = (root.getAttribute('data-lang') as Lang | null) ?? getLangFromPath(window.location.pathname);
		setStrings(lang);

		applyHtmlTheme();
		initTip();
		new App(root, { initial, scope });
		registerServiceWorker();
	});
}

export function ready(fn: () => void): void {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', fn, { once: true });
	} else {
		fn();
	}
}

function registerServiceWorker(): void {
	if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return;
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js').catch(() => {
			/* offline support is a progressive enhancement */
		});
	});
}