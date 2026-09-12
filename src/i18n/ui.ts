/** Site-level i18n: languages, navigation chrome, tools grid and minute-page labels. */

export type Lang = 'pt' | 'en' | 'es' | 'ja' | 'fr' | 'de' | 'ko' | 'it';

export const LANGS: Lang[] = ['pt', 'en', 'es', 'ja', 'fr', 'de', 'ko', 'it'];

export const languages: Record<Lang, string> = {
	pt: 'PortuguÃªs',
	en: 'English',
	es: 'EspaÃ±ol',
	ja: 'æ—¥æœ¬èªž',
	fr: 'FranÃ§ais',
	de: 'Deutsch',
	ko: 'í•œêµ­ì–´',
	it: 'Italiano',
};

/** BCP-47 tags used in `<html lang>` and `hreflang`. */
export const langTags: Record<Lang, string> = {
	pt: 'pt-BR',
	en: 'en',
	es: 'es',
	ja: 'ja',
	fr: 'fr',
	de: 'de',
	ko: 'ko-KR',
	it: 'it',
};

/** Open Graph locale strings. */
export const ogLocales: Record<Lang, string> = {
	pt: 'pt_BR',
	en: 'en_US',
	es: 'es_ES',
	ja: 'ja_JP',
	fr: 'fr_FR',
	de: 'de_DE',
	ko: 'ko_KR',
	it: 'it_IT',
};

export const defaultLang: Lang = 'pt';
export const showDefaultLang = false;

export interface ToolLink {
	path: string;
	label: string;
	hint: string;
}

export interface UiDict {
	nav: {
		temporizador: string;
		cronometro: string;
		pomodoro: string;
		intervalos: string;
		meditacao: string;
		sequencias: string;
	};
	footer: {
		tagline: string;
		about: string;
		contact: string;
		privacy: string;
		terms: string;
	};
	noscript: string;
	moreTools: string;
	langLabel: string;
	tools: {
		readyEyebrow: string;
		readyTitle: string;
		readySub: string;
		min: string;
	};
	unit: {
		minute: (n: number) => string;
		hour: string;
	};
	minutePageLabel: (minutes: number) => string;
	toolLinks: ToolLink[];
}

const uiPt: UiDict = {
	nav: {
		temporizador: 'Temporizador',
		cronometro: 'CronÃ´metro',
		pomodoro: 'Pomodoro',
		intervalos: 'Intervalos',
		meditacao: 'MeditaÃ§Ã£o',
		sequencias: 'SequÃªncias',
	},
	footer: {
		tagline: 'timer rÃ¡pido, bonito e que funciona offline.',
		about: 'Sobre',
		contact: 'Contato',
		privacy: 'PolÃ­tica de Privacidade',
		terms: 'Termos de Uso',
	},
	noscript: 'Ative o JavaScript para usar o temporizador. Enquanto isso, veja as sugestÃµes de tempo abaixo.',
	moreTools: 'Mais ferramentas de tempo',
	langLabel: 'Idioma',
	tools: {
		readyEyebrow: 'Temporizadores por duraÃ§Ã£o',
		readyTitle: 'Contagens regressivas prontas',
		readySub: 'Escolha o tempo â€” e comece.',
		min: 'min',
	},
	unit: {
		minute: (n: number) => (n === 1 ? 'minuto' : 'minutos'),
		hour: 'hora',
	},
	minutePageLabel: (minutes: number) =>
		minutes === 60 ? 'Temporizador de 1 hora' : `Temporizador de ${minutes} minutos`,
	toolLinks: [
		{ path: '/temporizador/', label: 'Temporizador', hint: 'Contagem regressiva simples' },
		{ path: '/cronometro/', label: 'CronÃ´metro', hint: 'Conta o tempo com voltas' },
		{ path: '/pomodoro/', label: 'Pomodoro', hint: 'Foco com pausas' },
		{ path: '/intervalos/', label: 'Intervalos', hint: 'HIIT, tabata e treino' },
		{ path: '/meditacao/', label: 'MeditaÃ§Ã£o', hint: 'Caminho de respiraÃ§Ã£o' },
		{ path: '/sequencias/', label: 'SequÃªncias', hint: 'Etapas com avisos' },
		{ path: '/temporizador-tabata/', label: 'Tabata', hint: '20 s de esforÃ§o, 10 s de descanso' },
		{ path: '/temporizador-hiit/', label: 'HIIT 40Ã—20', hint: 'EsforÃ§o mÃ¡ximo e descanso' },
		{ path: '/temporizador-para-estudos/', label: 'Estudos', hint: 'Blocos de foco com pausas' },
		{ path: '/temporizador-para-exercicios/', label: 'ExercÃ­cios', hint: 'Descansos entre sÃ©ries' },
		{ path: '/temporizador-para-cozinha/', label: 'Cozinha', hint: 'Ovo, arroz e forno na hora' },
		{ path: '/temporizador-para-meditacao/', label: 'MeditaÃ§Ã£o guiada', hint: 'Sons suaves para praticar' },
	],
};

const uiEn: UiDict = {
	nav: {
		temporizador: 'Timer',
		cronometro: 'Stopwatch',
		pomodoro: 'Pomodoro',
		intervalos: 'Intervals',
		meditacao: 'Meditation',
		sequencias: 'Sequences',
	},
	footer: {
		tagline: 'a fast, beautiful timer that works offline.',
		about: 'About',
		contact: 'Contact',
		privacy: 'Privacy Policy',
		terms: 'Terms of Use',
	},
	noscript: 'Enable JavaScript to use the timer. Meanwhile, check the ready-made time suggestions below.',
	moreTools: 'More time tools',
	langLabel: 'Language',
	tools: {
		readyEyebrow: 'Timers by duration',
		readyTitle: 'Ready-made countdowns',
		readySub: 'Pick a time â€” and start.',
		min: 'min',
	},
	unit: {
		minute: (n: number) => (n === 1 ? 'minute' : 'minutes'),
		hour: 'hour',
	},
	minutePageLabel: (minutes: number) =>
		minutes === 60 ? '1 Hour Timer' : `${minutes} Minute Timer`,
	toolLinks: [
		{ path: '/temporizador/', label: 'Timer', hint: 'Simple countdown' },
		{ path: '/cronometro/', label: 'Stopwatch', hint: 'Counts time with laps' },
		{ path: '/pomodoro/', label: 'Pomodoro', hint: 'Focus with breaks' },
		{ path: '/intervalos/', label: 'Intervals', hint: 'HIIT, tabata and training' },
		{ path: '/meditacao/', label: 'Meditation', hint: 'A breathing path' },
		{ path: '/sequencias/', label: 'Sequences', hint: 'Steps with alerts' },
		{ path: '/temporizador-tabata/', label: 'Tabata', hint: '20 s effort, 10 s rest' },
		{ path: '/temporizador-hiit/', label: 'HIIT 40Ã—20', hint: 'Max effort and rest' },
		{ path: '/temporizador-para-estudos/', label: 'Study', hint: 'Focus blocks with breaks' },
		{ path: '/temporizador-para-exercicios/', label: 'Workout', hint: 'Rest between sets' },
		{ path: '/temporizador-para-cozinha/', label: 'Cooking', hint: 'Eggs, rice and oven on time' },
		{ path: '/temporizador-para-meditacao/', label: 'Guided meditation', hint: 'Soft sounds to practice' },
	],
};

const uiEs: UiDict = {
	nav: {
		temporizador: 'Temporizador',
		cronometro: 'CronÃ³metro',
		pomodoro: 'Pomodoro',
		intervalos: 'Intervalos',
		meditacao: 'MeditaciÃ³n',
		sequencias: 'Secuencias',
	},
	footer: {
		tagline: 'un temporizador rÃ¡pido, bonito y que funciona sin conexiÃ³n.',
		about: 'Nosotros',
		contact: 'Contacto',
		privacy: 'PolÃ­tica de Privacidad',
		terms: 'TÃ©rminos de Uso',
	},
	noscript: 'Activa JavaScript para usar el temporizador. Mientras tanto, mira las sugerencias de tiempo de abajo.',
	moreTools: 'MÃ¡s herramientas de tiempo',
	langLabel: 'Idioma',
	tools: {
		readyEyebrow: 'Temporizadores por duraciÃ³n',
		readyTitle: 'Cuentas regresivas listas',
		readySub: 'Elige el tiempo â€” y empieza.',
		min: 'min',
	},
	unit: {
		minute: (n: number) => (n === 1 ? 'minuto' : 'minutos'),
		hour: 'hora',
	},
	minutePageLabel: (minutes: number) =>
		minutes === 60 ? 'Temporizador de 1 hora' : `Temporizador de ${minutes} minutos`,
	toolLinks: [
		{ path: '/temporizador/', label: 'Temporizador', hint: 'Cuenta regresiva simple' },
		{ path: '/cronometro/', label: 'CronÃ³metro', hint: 'Cuenta el tiempo con vueltas' },
		{ path: '/pomodoro/', label: 'Pomodoro', hint: 'Enfoque con pausas' },
		{ path: '/intervalos/', label: 'Intervalos', hint: 'HIIT, tabata y entrenamiento' },
		{ path: '/meditacao/', label: 'MeditaciÃ³n', hint: 'Un camino de respiraciÃ³n' },
		{ path: '/sequencias/', label: 'Secuencias', hint: 'Pasos con avisos' },
		{ path: '/temporizador-tabata/', label: 'Tabata', hint: '20 s de esfuerzo, 10 s de descanso' },
		{ path: '/temporizador-hiit/', label: 'HIIT 40Ã—20', hint: 'Esfuerzo mÃ¡ximo y descanso' },
		{ path: '/temporizador-para-estudos/', label: 'Estudios', hint: 'Bloques de enfoque con pausas' },
		{ path: '/temporizador-para-exercicios/', label: 'Ejercicios', hint: 'Descansos entre series' },
		{ path: '/temporizador-para-cozinha/', label: 'Cocina', hint: 'Huevo, arroz y horno a tiempo' },
		{ path: '/temporizador-para-meditacao/', label: 'MeditaciÃ³n guiada', hint: 'Sonidos suaves para practicar' },
	],
};

const uiJa: UiDict = {
	nav: {
		temporizador: 'ã‚¿ã‚¤ãƒžãƒ¼',
		cronometro: 'ã‚¹ãƒˆãƒƒãƒ—ã‚¦ã‚©ãƒƒãƒ',
		pomodoro: 'ãƒãƒ¢ãƒ‰ãƒ¼ãƒ­',
		intervalos: 'ã‚¤ãƒ³ã‚¿ãƒ¼ãƒãƒ«',
		meditacao: 'çž‘æƒ³',
		sequencias: 'ã‚·ãƒ¼ã‚±ãƒ³ã‚¹',
	},
	footer: {
		tagline: 'é€Ÿãã¦ç¾Žã—ãã€ã‚ªãƒ•ãƒ©ã‚¤ãƒ³ã§ã‚‚å‹•ä½œã™ã‚‹ã‚¿ã‚¤ãƒžãƒ¼ã€‚',
		about: 'ã“ã®ã‚µã‚¤ãƒˆã«ã¤ã„ã¦',
		contact: 'ãŠå•ã„åˆã‚ã›',
		privacy: 'ãƒ—ãƒ©ã‚¤ãƒã‚·ãƒ¼ãƒãƒªã‚·ãƒ¼',
		terms: 'åˆ©ç”¨è¦ç´„',
	},
	noscript: 'ã‚¿ã‚¤ãƒžãƒ¼ã‚’ä½¿ç”¨ã™ã‚‹ã«ã¯JavaScriptã‚’æœ‰åŠ¹ã«ã—ã¦ãã ã•ã„ã€‚ãã®é–“ã€ä¸‹ã®æ™‚é–“ã®ææ¡ˆã‚’ã”è¦§ãã ã•ã„ã€‚',
	moreTools: 'ãã®ä»–ã®æ™‚é–“ãƒ„ãƒ¼ãƒ«',
	langLabel: 'è¨€èªž',
	tools: {
		readyEyebrow: 'æ™‚é–“ã”ã¨ã®ã‚¿ã‚¤ãƒžãƒ¼',
		readyTitle: 'ã™ãä½¿ãˆã‚‹ã‚«ã‚¦ãƒ³ãƒˆãƒ€ã‚¦ãƒ³',
		readySub: 'æ™‚é–“ã‚’é¸ã‚“ã§ã™ãã«ã‚¹ã‚¿ãƒ¼ãƒˆã€‚',
		min: 'åˆ†',
	},
	unit: {
		minute: () => 'åˆ†',
		hour: 'æ™‚é–“',
	},
	minutePageLabel: (minutes: number) =>
		minutes === 60 ? '1æ™‚é–“ã‚¿ã‚¤ãƒžãƒ¼' : `${minutes}åˆ†ã‚¿ã‚¤ãƒžãƒ¼`,
	toolLinks: [
		{ path: '/temporizador/', label: 'ã‚¿ã‚¤ãƒžãƒ¼', hint: 'ã‚·ãƒ³ãƒ—ãƒ«ãªã‚«ã‚¦ãƒ³ãƒˆãƒ€ã‚¦ãƒ³' },
		{ path: '/cronometro/', label: 'ã‚¹ãƒˆãƒƒãƒ—ã‚¦ã‚©ãƒƒãƒ', hint: 'ãƒ©ãƒƒãƒ—ä»˜ãã§æ™‚é–“ã‚’è¨ˆæ¸¬' },
		{ path: '/pomodoro/', label: 'ãƒãƒ¢ãƒ‰ãƒ¼ãƒ­', hint: 'ä¼‘æ†©ä»˜ãã®é›†ä¸­' },
		{ path: '/intervalos/', label: 'ã‚¤ãƒ³ã‚¿ãƒ¼ãƒãƒ«', hint: 'HIITã€ã‚¿ãƒã‚¿ã€ãƒˆãƒ¬ãƒ¼ãƒ‹ãƒ³ã‚°' },
		{ path: '/meditacao/', label: 'çž‘æƒ³', hint: 'å‘¼å¸ã®ã‚¬ã‚¤ãƒ‰' },
		{ path: '/sequencias/', label: 'ã‚·ãƒ¼ã‚±ãƒ³ã‚¹', hint: 'å„ã‚¹ãƒ†ãƒƒãƒ—ã§åˆå›³' },
		{ path: '/temporizador-tabata/', label: 'ã‚¿ãƒã‚¿', hint: '20ç§’é‹å‹•ãƒ»10ç§’ä¼‘æ†©' },
		{ path: '/temporizador-hiit/', label: 'HIIT 40Ã—20', hint: 'å…¨åŠ›é‹å‹•ã¨ä¼‘æ†©' },
		{ path: '/temporizador-para-estudos/', label: 'å‹‰å¼·', hint: 'ä¼‘æ†©ä»˜ãã®é›†ä¸­ãƒ–ãƒ­ãƒƒã‚¯' },
		{ path: '/temporizador-para-exercicios/', label: 'ãƒˆãƒ¬ãƒ¼ãƒ‹ãƒ³ã‚°', hint: 'ã‚»ãƒƒãƒˆé–“ã®ä¼‘æ†©' },
		{ path: '/temporizador-para-cozinha/', label: 'æ–™ç†', hint: 'åµã€ã”ã¯ã‚“ã€ã‚ªãƒ¼ãƒ–ãƒ³ã‚’æ™‚é–“é€šã‚Šã«' },
		{ path: '/temporizador-para-meditacao/', label: 'ã‚¬ã‚¤ãƒ‰ä»˜ãçž‘æƒ³', hint: 'ã‚„ã•ã—ã„éŸ³ã§ç·´ç¿’' },
	],
};

const uiFr: UiDict = {
	nav: {
		temporizador: 'Minuteur',
		cronometro: 'ChronomÃ¨tre',
		pomodoro: 'Pomodoro',
		intervalos: 'Intervalles',
		meditacao: 'MÃ©ditation',
		sequencias: 'SÃ©quences',
	},
	footer: {
		tagline: 'un minuteur rapide, joli et qui fonctionne hors ligne.',
		about: 'Ã€ propos',
		contact: 'Contact',
		privacy: 'Politique de confidentialitÃ©',
		terms: "Conditions d'utilisation",
	},
	noscript: 'Activez JavaScript pour utiliser le minuteur. En attendant, consultez les suggestions de temps ci-dessous.',
	moreTools: "Plus d'outils de temps",
	langLabel: 'Langue',
	tools: {
		readyEyebrow: 'Minuteurs par durÃ©e',
		readyTitle: 'Comptes Ã  rebours prÃªts',
		readySub: 'Choisissez un temps â€” et lancez.',
		min: 'min',
	},
	unit: {
		minute: (n: number) => (n <= 1 ? 'minute' : 'minutes'),
		hour: 'heure',
	},
	minutePageLabel: (minutes: number) =>
		minutes === 60 ? 'Minuteur de 1 heure' : `Minuteur de ${minutes} minutes`,
	toolLinks: [
		{ path: '/temporizador/', label: 'Minuteur', hint: 'Compte Ã  rebours simple' },
		{ path: '/cronometro/', label: 'ChronomÃ¨tre', hint: "Compte le temps avec des tours" },
		{ path: '/pomodoro/', label: 'Pomodoro', hint: 'Concentration avec pauses' },
		{ path: '/intervalos/', label: 'Intervalles', hint: 'HIIT, tabata et entraÃ®nement' },
		{ path: '/meditacao/', label: 'MÃ©ditation', hint: 'Un chemin respiratoire' },
		{ path: '/sequencias/', label: 'SÃ©quences', hint: 'Ã‰tapes avec alertes' },
		{ path: '/temporizador-tabata/', label: 'Tabata', hint: '20 s dâ€™effort, 10 s de repos' },
		{ path: '/temporizador-hiit/', label: 'HIIT 40Ã—20', hint: 'Effort maximal et repos' },
		{ path: '/temporizador-para-estudos/', label: 'Ã‰tudes', hint: 'Blocs de concentration avec pauses' },
		{ path: '/temporizador-para-exercicios/', label: 'Exercices', hint: 'Repos entre les sÃ©ries' },
		{ path: '/temporizador-para-cozinha/', label: 'Cuisine', hint: 'Å’uf, riz et four Ã  lâ€™heure' },
		{ path: '/temporizador-para-meditacao/', label: 'MÃ©ditation guidÃ©e', hint: 'Des sons doux pour pratiquer' },
	],
};

const uiDe: UiDict = {
	nav: {
		temporizador: 'Timer',
		cronometro: 'Stoppuhr',
		pomodoro: 'Pomodoro',
		intervalos: 'Intervalle',
		meditacao: 'Meditation',
		sequencias: 'Sequenzen',
	},
	footer: {
		tagline: 'ein schneller, schÃ¶ner Timer, der offline funktioniert.',
		about: 'Ãœber uns',
		contact: 'Kontakt',
		privacy: 'DatenschutzerklÃ¤rung',
		terms: 'Nutzungsbedingungen',
	},
	noscript: 'Aktivieren Sie JavaScript, um den Timer zu nutzen. In der Zwischenzeit finden Sie unten ZeitvorschlÃ¤ge.',
	moreTools: 'Weitere Zeittools',
	langLabel: 'Sprache',
	tools: {
		readyEyebrow: 'Timer nach Dauer',
		readyTitle: 'Fertige Countdowns',
		readySub: 'Zeit wÃ¤hlen â€” und loslegen.',
		min: 'Min.',
	},
	unit: {
		minute: (n: number) => (n === 1 ? 'Minute' : 'Minuten'),
		hour: 'Stunde',
	},
	minutePageLabel: (minutes: number) =>
		minutes === 60 ? '1-Stunden-Timer' : `${minutes}-Minuten-Timer`,
	toolLinks: [
		{ path: '/temporizador/', label: 'Timer', hint: 'Einfacher Countdown' },
		{ path: '/cronometro/', label: 'Stoppuhr', hint: 'Zeit mit Runden messen' },
		{ path: '/pomodoro/', label: 'Pomodoro', hint: 'Fokus mit Pausen' },
		{ path: '/intervalos/', label: 'Intervalle', hint: 'HIIT, Tabata und Training' },
		{ path: '/meditacao/', label: 'Meditation', hint: 'Ein Atemweg' },
		{ path: '/sequencias/', label: 'Sequenzen', hint: 'Schritte mit Hinweisen' },
		{ path: '/temporizador-tabata/', label: 'Tabata', hint: '20 s Anstrengung, 10 s Pause' },
		{ path: '/temporizador-hiit/', label: 'HIIT 40Ã—20', hint: 'Maximale Anstrengung und Ruhe' },
		{ path: '/temporizador-para-estudos/', label: 'Lernen', hint: 'FokusblÃ¶cke mit Pausen' },
		{ path: '/temporizador-para-exercicios/', label: 'Training', hint: 'Pausen zwischen SÃ¤tzen' },
		{ path: '/temporizador-para-cozinha/', label: 'Kochen', hint: 'Ei, Reis und Ofen pÃ¼nktlich' },
		{ path: '/temporizador-para-meditacao/', label: 'GefÃ¼hrte Meditation', hint: 'Sanfte KlÃ¤nge zum Ãœben' },
	],
};

const uiKo: UiDict = {
	nav: {
		temporizador: 'íƒ€ì´ë¨¸',
		cronometro: 'ìŠ¤í†±ì›Œì¹˜',
		pomodoro: 'í¬ëª¨ë„ë¡œ',
		intervalos: 'ì¸í„°ë²Œ',
		meditacao: 'ëª…ìƒ',
		sequencias: 'ì‹œí€€ìŠ¤',
	},
	footer: {
		tagline: 'ë¹ ë¥´ê³  ì•„ë¦„ë‹µê³  ì˜¤í”„ë¼ì¸ì—ì„œë„ ìž‘ë™í•˜ëŠ” íƒ€ì´ë¨¸.',
		about: 'ì†Œê°œ',
		contact: 'ë¬¸ì˜',
		privacy: 'ê°œì¸ì •ë³´ ì²˜ë¦¬ë°©ì¹¨',
		terms: 'ì´ìš©ì•½ê´€',
	},
	noscript: 'íƒ€ì´ë¨¸ë¥¼ ì‚¬ìš©í•˜ë ¤ë©´ JavaScriptë¥¼ í™œì„±í™”í•˜ì„¸ìš”. ê·¸ë™ì•ˆ ì•„ëž˜ ì‹œê°„ ì œì•ˆì„ í™•ì¸í•˜ì„¸ìš”.',
	moreTools: 'ë” ë§Žì€ ì‹œê°„ ë„êµ¬',
	langLabel: 'ì–¸ì–´',
	tools: {
		readyEyebrow: 'ì‹œê°„ë³„ íƒ€ì´ë¨¸',
		readyTitle: 'ë°”ë¡œ ì“°ëŠ” ì¹´ìš´íŠ¸ë‹¤ìš´',
		readySub: 'ì‹œê°„ì„ ê³ ë¥´ê³  ë°”ë¡œ ì‹œìž‘í•˜ì„¸ìš”.',
		min: 'ë¶„',
	},
	unit: {
		minute: () => 'ë¶„',
		hour: 'ì‹œê°„',
	},
	minutePageLabel: (minutes: number) =>
		minutes === 60 ? '1ì‹œê°„ íƒ€ì´ë¨¸' : `${minutes}ë¶„ íƒ€ì´ë¨¸`,
	toolLinks: [
		{ path: '/temporizador/', label: 'íƒ€ì´ë¨¸', hint: 'ê°„ë‹¨í•œ ì¹´ìš´íŠ¸ë‹¤ìš´' },
		{ path: '/cronometro/', label: 'ìŠ¤í†±ì›Œì¹˜', hint: 'ëž©ìœ¼ë¡œ ì‹œê°„ ì¸¡ì •' },
		{ path: '/pomodoro/', label: 'í¬ëª¨ë„ë¡œ', hint: 'íœ´ì‹ê³¼ í•¨ê»˜í•˜ëŠ” ì§‘ì¤‘' },
		{ path: '/intervalos/', label: 'ì¸í„°ë²Œ', hint: 'HIIT, íƒ€ë°”íƒ€, ìš´ë™' },
		{ path: '/meditacao/', label: 'ëª…ìƒ', hint: 'í˜¸í¡ ê°€ì´ë“œ' },
		{ path: '/sequencias/', label: 'ì‹œí€€ìŠ¤', hint: 'ë‹¨ê³„ë§ˆë‹¤ ì•Œë¦¼' },
		{ path: '/temporizador-tabata/', label: 'íƒ€ë°”íƒ€', hint: '20ì´ˆ ìš´ë™, 10ì´ˆ íœ´ì‹' },
		{ path: '/temporizador-hiit/', label: 'HIIT 40Ã—20', hint: 'ìµœëŒ€ ìš´ë™ê³¼ íœ´ì‹' },
		{ path: '/temporizador-para-estudos/', label: 'ê³µë¶€', hint: 'íœ´ì‹ì´ ìžˆëŠ” ì§‘ì¤‘ ë¸”ë¡' },
		{ path: '/temporizador-para-exercicios/', label: 'ìš´ë™', hint: 'ì„¸íŠ¸ ì‚¬ì´ íœ´ì‹' },
		{ path: '/temporizador-para-cozinha/', label: 'ìš”ë¦¬', hint: 'ê³„ëž€, ë°¥, ì˜¤ë¸ì„ ì œë•Œì—' },
		{ path: '/temporizador-para-meditacao/', label: 'ê°€ì´ë“œ ëª…ìƒ', hint: 'ë¶€ë“œëŸ¬ìš´ ì†Œë¦¬ë¡œ ì—°ìŠµ' },
	],
};

const uiIt: UiDict = {
	nav: {
		temporizador: 'Timer',
		cronometro: 'Cronometro',
		pomodoro: 'Pomodoro',
		intervalos: 'Intervalli',
		meditacao: 'Meditazione',
		sequencias: 'Sequenze',
	},
	footer: {
		tagline: 'un timer veloce, elegante e che funziona offline.',
		about: 'Chi siamo',
		contact: 'Contatti',
		privacy: 'Informativa sulla privacy',
		terms: 'Termini di servizio',
	},
	noscript: 'Attiva JavaScript per usare il timer. Nel frattempo, guarda i suggerimenti di tempo qui sotto.',
	moreTools: 'Altri strumenti per il tempo',
	langLabel: 'Lingua',
	tools: {
		readyEyebrow: 'Timer per durata',
		readyTitle: 'Conto alla rovescia pronti',
		readySub: 'Scegli il tempo â€” e parti.',
		min: 'min',
	},
	unit: {
		minute: (n: number) => (n === 1 ? 'minuto' : 'minuti'),
		hour: 'ora',
	},
	minutePageLabel: (minutes: number) =>
		minutes === 60 ? 'Timer di 1 ora' : `Timer di ${minutes} minuti`,
	toolLinks: [
		{ path: '/temporizador/', label: 'Timer', hint: 'Conto alla rovescia semplice' },
		{ path: '/cronometro/', label: 'Cronometro', hint: 'Conta il tempo con i giri' },
		{ path: '/pomodoro/', label: 'Pomodoro', hint: 'Concentrazione con pause' },
		{ path: '/intervalos/', label: 'Intervalli', hint: 'HIIT, tabata e allenamento' },
		{ path: '/meditacao/', label: 'Meditazione', hint: 'Un percorso di respirazione' },
		{ path: '/sequencias/', label: 'Sequenze', hint: 'Fasi con avvisi' },
		{ path: '/temporizador-tabata/', label: 'Tabata', hint: '20 s di sforzo, 10 s di riposo' },
		{ path: '/temporizador-hiit/', label: 'HIIT 40Ã—20', hint: 'Sforzo massimo e riposo' },
		{ path: '/temporizador-para-estudos/', label: 'Studio', hint: 'Blocchi di concentrazione con pause' },
		{ path: '/temporizador-para-exercicios/', label: 'Allenamento', hint: 'Riposi tra le serie' },
		{ path: '/temporizador-para-cozinha/', label: 'Cucina', hint: 'Uovo, riso e forno puntuali' },
		{ path: '/temporizador-para-meditacao/', label: 'Meditazione guidata', hint: 'Suoni delicati per praticare' },
	],
};

export const ui: Record<Lang, UiDict> = {
	pt: uiPt,
	en: uiEn,
	es: uiEs,
	ja: uiJa,
	fr: uiFr,
	de: uiDe,
	ko: uiKo,
	it: uiIt,
};