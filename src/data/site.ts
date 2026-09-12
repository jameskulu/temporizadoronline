import { SITE_URL } from '../lib/share';

export const SITE_NAME = 'Temporizador Online';
export const SITE_TAGLINE = 'Cronômetro, pomodoro, intervalos e contagem regressiva sem instalar nada.';

export function canonical(path: string): string {
	return `${SITE_URL}${path}`;
}

export function webAppJsonLd(): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: SITE_NAME,
		url: SITE_URL,
		applicationCategory: 'UtilitiesApplication',
		operatingSystem: 'Any',
		inLanguage: 'pt-BR',
		offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
	};
}

export function faqJsonLd(entries: Array<{ q: string; a: string }>): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: entries.map((e) => ({
			'@type': 'Question',
			name: e.q,
			acceptedAnswer: { '@type': 'Answer', text: e.a },
		})),
	};
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((it, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: it.name,
			item: canonical(it.path),
		})),
	};
}

/** Minutes variants used for the /temporizador/* pages and quick presets. */
export const MINUTE_PAGES: Array<{ minutes: number; slug: string; label: string }> = [
	{ minutes: 1, slug: '1-minuto', label: 'Temporizador de 1 minuto' },
	{ minutes: 3, slug: '3-minutos', label: 'Temporizador de 3 minutos' },
	{ minutes: 5, slug: '5-minutos', label: 'Temporizador de 5 minutos' },
	{ minutes: 10, slug: '10-minutos', label: 'Temporizador de 10 minutos' },
	{ minutes: 15, slug: '15-minutos', label: 'Temporizador de 15 minutos' },
	{ minutes: 20, slug: '20-minutos', label: 'Temporizador de 20 minutos' },
	{ minutes: 25, slug: '25-minutos', label: 'Temporizador de 25 minutos' },
	{ minutes: 30, slug: '30-minutos', label: 'Temporizador de 30 minutos' },
	{ minutes: 45, slug: '45-minutos', label: 'Temporizador de 45 minutos' },
	{ minutes: 60, slug: '60-minutos', label: 'Temporizador de 1 hora' },
];

export const TOOL_LINKS: Array<{ path: string; label: string; hint: string }> = [
	{ path: '/temporizador/', label: 'Temporizador', hint: 'Contagem regressiva simples' },
	{ path: '/cronometro/', label: 'Cronômetro', hint: 'Conta o tempo com voltas' },
	{ path: '/pomodoro/', label: 'Pomodoro', hint: 'Foco com pausas' },
	{ path: '/intervalos/', label: 'Intervalos', hint: 'HIIT, tabata e treino' },
	{ path: '/meditacao/', label: 'Meditação', hint: 'Caminho de respiração' },
	{ path: '/sequencias/', label: 'Sequências', hint: 'Etapas com avisos' },
	{ path: '/temporizador-tabata/', label: 'Tabata', hint: '20 s de esforço, 10 s de descanso' },
	{ path: '/temporizador-hiit/', label: 'HIIT 40×20', hint: 'Esforço máximo e descanso' },
	{ path: '/temporizador-para-estudos/', label: 'Estudos', hint: 'Blocos de foco com pausas' },
	{ path: '/temporizador-para-exercicios/', label: 'Exercícios', hint: 'Descansos entre séries' },
	{ path: '/temporizador-para-cozinha/', label: 'Cozinha', hint: 'Ovo, arroz e forno na hora' },
	{ path: '/temporizador-para-meditacao/', label: 'Meditação guiada', hint: 'Sons suaves para praticar' },
];