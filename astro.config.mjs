// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://meutemporizadoronline.com',
	trailingSlash: 'always',
	i18n: {
		defaultLocale: 'pt',
		locales: ['pt', 'en', 'es', 'ja', 'fr', 'de', 'ko', 'it'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	integrations: [
		sitemap({
			i18n: {
				defaultLocale: 'pt',
				locales: {
					pt: 'pt-BR',
					en: 'en',
					es: 'es',
					ja: 'ja',
					fr: 'fr',
					de: 'de',
					ko: 'ko',
					it: 'it',
				},
			},
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});