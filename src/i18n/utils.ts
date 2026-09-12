import { ui, defaultLang, showDefaultLang, LANGS } from './ui';
import type { Lang, UiDict } from './ui';

export function getLangFromUrl(url: URL): Lang {
	return getLangFromPath(url.pathname);
}

export function getLangFromPath(pathname: string): Lang {
	const [, lang] = pathname.split('/');
	if ((LANGS as string[]).includes(lang)) return lang as Lang;
	return defaultLang;
}

/** True when the given pathname (from a URL) carries a language prefix. */
export function isLocalizedPath(pathname: string): boolean {
	const [, lang] = pathname.split('/');
	return (LANGS as string[]).includes(lang);
}

/** Current language's UI dictionary (falls back to Portuguese). */
export function useTranslations(lang: Lang): UiDict {
	return ui[lang] ?? ui[defaultLang];
}

/** Translates a path into the given language's URL (no prefix for the default lang). */
export function useTranslatedPath(lang: Lang): (path: string, l?: Lang) => string {
	return function translatePath(path: string, l: Lang = lang): string {
		if (l === defaultLang && showDefaultLang === false && !path.startsWith('/')) return `/${path}`;
		if (l === defaultLang && showDefaultLang === false) return path;
		return `/${l}${path}`;
	};
}

export const localPath = (lang: Lang, path: string): string =>
	lang === defaultLang ? path : `/${lang}${path}`;

/** Strips any language prefix from a pathname, returning the default-lang-style path. */
export function stripLang(pathname: string): string {
	if (!isLocalizedPath(pathname)) return pathname;
	const slash = pathname.indexOf('/', 1);
	return slash === -1 ? '/' : pathname.slice(slash);
}

export interface LocalizedMinutePage {
	minutes: number;
	slug: string;
	label: string;
}

/** Localized MINUTE_PAGES equivalents (same slugs, translated labels). */
export function getMinutePages(lang: Lang): LocalizedMinutePage[] {
	const labels = ui[lang] ?? ui[defaultLang];
	const base = [
		{ minutes: 1, slug: '1-minuto' },
		{ minutes: 3, slug: '3-minutos' },
		{ minutes: 5, slug: '5-minutos' },
		{ minutes: 10, slug: '10-minutos' },
		{ minutes: 15, slug: '15-minutos' },
		{ minutes: 20, slug: '20-minutos' },
		{ minutes: 25, slug: '25-minutos' },
		{ minutes: 30, slug: '30-minutos' },
		{ minutes: 45, slug: '45-minutos' },
		{ minutes: 60, slug: '60-minutos' },
	];
	return base.map((b) => ({ minutes: b.minutes, slug: b.slug, label: labels.minutePageLabel(b.minutes) }));
}