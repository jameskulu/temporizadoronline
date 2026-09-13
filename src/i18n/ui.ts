/** Site-level i18n: languages, navigation chrome, tools grid and minute-page labels. */

export type Lang = 'pt' | 'en' | 'es' | 'ja' | 'fr' | 'de' | 'ko' | 'it';

export const LANGS: Lang[] = ['pt', 'en', 'es', 'ja', 'fr', 'de', 'ko', 'it'];

export const languages: Record<Lang, string> = {
	pt: 'Português',
	en: 'English',
	es: 'Español',
	ja: '日本語',
	fr: 'Français',
	de: 'Deutsch',
	ko: '한국어',
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
		cronometro: 'Cronômetro',
		pomodoro: 'Pomodoro',
		intervalos: 'Intervalos',
		meditacao: 'Meditação',
		sequencias: 'Sequências',
	},
	footer: {
		tagline: 'timer rápido, bonito e que funciona offline.',
		about: 'Sobre',
		contact: 'Contato',
		privacy: 'Política de Privacidade',
		terms: 'Termos de Uso',
	},
	noscript: 'Ative o JavaScript para usar o temporizador. Enquanto isso, veja as sugestões de tempo abaixo.',
	moreTools: 'Mais ferramentas de tempo',
	langLabel: 'Idioma',
	tools: {
		readyEyebrow: 'Temporizadores por duração',
		readyTitle: 'Contagens regressivas prontas',
		readySub: 'Escolha o tempo — e comece.',
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
		readySub: 'Pick a time — and start.',
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
		{ path: '/temporizador-hiit/', label: 'HIIT 40×20', hint: 'Max effort and rest' },
		{ path: '/temporizador-para-estudos/', label: 'Study', hint: 'Focus blocks with breaks' },
		{ path: '/temporizador-para-exercicios/', label: 'Workout', hint: 'Rest between sets' },
		{ path: '/temporizador-para-cozinha/', label: 'Cooking', hint: 'Eggs, rice and oven on time' },
		{ path: '/temporizador-para-meditacao/', label: 'Guided meditation', hint: 'Soft sounds to practice' },
	],
};

const uiEs: UiDict = {
	nav: {
		temporizador: 'Temporizador',
		cronometro: 'Cronómetro',
		pomodoro: 'Pomodoro',
		intervalos: 'Intervalos',
		meditacao: 'Meditación',
		sequencias: 'Secuencias',
	},
	footer: {
		tagline: 'un temporizador rápido, bonito y que funciona sin conexión.',
		about: 'Nosotros',
		contact: 'Contacto',
		privacy: 'Política de Privacidad',
		terms: 'Términos de Uso',
	},
	noscript: 'Activa JavaScript para usar el temporizador. Mientras tanto, mira las sugerencias de tiempo de abajo.',
	moreTools: 'Más herramientas de tiempo',
	langLabel: 'Idioma',
	tools: {
		readyEyebrow: 'Temporizadores por duración',
		readyTitle: 'Cuentas regresivas listas',
		readySub: 'Elige el tiempo — y empieza.',
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
		{ path: '/cronometro/', label: 'Cronómetro', hint: 'Cuenta el tiempo con vueltas' },
		{ path: '/pomodoro/', label: 'Pomodoro', hint: 'Enfoque con pausas' },
		{ path: '/intervalos/', label: 'Intervalos', hint: 'HIIT, tabata y entrenamiento' },
		{ path: '/meditacao/', label: 'Meditación', hint: 'Un camino de respiración' },
		{ path: '/sequencias/', label: 'Secuencias', hint: 'Pasos con avisos' },
		{ path: '/temporizador-tabata/', label: 'Tabata', hint: '20 s de esfuerzo, 10 s de descanso' },
		{ path: '/temporizador-hiit/', label: 'HIIT 40×20', hint: 'Esfuerzo máximo y descanso' },
		{ path: '/temporizador-para-estudos/', label: 'Estudios', hint: 'Bloques de enfoque con pausas' },
		{ path: '/temporizador-para-exercicios/', label: 'Ejercicios', hint: 'Descansos entre series' },
		{ path: '/temporizador-para-cozinha/', label: 'Cocina', hint: 'Huevo, arroz y horno a tiempo' },
		{ path: '/temporizador-para-meditacao/', label: 'Meditación guiada', hint: 'Sonidos suaves para practicar' },
	],
};

const uiJa: UiDict = {
	nav: {
		temporizador: 'タイマー',
		cronometro: 'ストップウォッチ',
		pomodoro: 'ポモドーロ',
		intervalos: 'インターバル',
		meditacao: '瞑想',
		sequencias: 'シーケンス',
	},
	footer: {
		tagline: '速くて美しく、オフラインでも動作するタイマー。',
		about: 'このサイトについて',
		contact: 'お問い合わせ',
		privacy: 'プライバシーポリシー',
		terms: '利用規約',
	},
	noscript: 'タイマーを使用するにはJavaScriptを有効にしてください。その間、下の時間の提案をご覧ください。',
	moreTools: 'その他の時間ツール',
	langLabel: '言語',
	tools: {
		readyEyebrow: '時間ごとのタイマー',
		readyTitle: 'すぐ使えるカウントダウン',
		readySub: '時間を選んですぐにスタート。',
		min: '分',
	},
	unit: {
		minute: () => '分',
		hour: '時間',
	},
	minutePageLabel: (minutes: number) =>
		minutes === 60 ? '1時間タイマー' : `${minutes}分タイマー`,
	toolLinks: [
		{ path: '/temporizador/', label: 'タイマー', hint: 'シンプルなカウントダウン' },
		{ path: '/cronometro/', label: 'ストップウォッチ', hint: 'ラップ付きで時間を計測' },
		{ path: '/pomodoro/', label: 'ポモドーロ', hint: '休憩付きの集中' },
		{ path: '/intervalos/', label: 'インターバル', hint: 'HIIT、タバタ、トレーニング' },
		{ path: '/meditacao/', label: '瞑想', hint: '呼吸のガイド' },
		{ path: '/sequencias/', label: 'シーケンス', hint: '各ステップで合図' },
		{ path: '/temporizador-tabata/', label: 'タバタ', hint: '20秒運動・10秒休憩' },
		{ path: '/temporizador-hiit/', label: 'HIIT 40×20', hint: '全力運動と休憩' },
		{ path: '/temporizador-para-estudos/', label: '勉強', hint: '休憩付きの集中ブロック' },
		{ path: '/temporizador-para-exercicios/', label: 'トレーニング', hint: 'セット間の休憩' },
		{ path: '/temporizador-para-cozinha/', label: '料理', hint: '卵、ごはん、オーブンを時間通りに' },
		{ path: '/temporizador-para-meditacao/', label: 'ガイド付き瞑想', hint: 'やさしい音で練習' },
	],
};

const uiFr: UiDict = {
	nav: {
		temporizador: 'Minuteur',
		cronometro: 'Chronomètre',
		pomodoro: 'Pomodoro',
		intervalos: 'Intervalles',
		meditacao: 'Méditation',
		sequencias: 'Séquences',
	},
	footer: {
		tagline: 'un minuteur rapide, joli et qui fonctionne hors ligne.',
		about: 'À propos',
		contact: 'Contact',
		privacy: 'Politique de confidentialité',
		terms: "Conditions d'utilisation",
	},
	noscript: 'Activez JavaScript pour utiliser le minuteur. En attendant, consultez les suggestions de temps ci-dessous.',
	moreTools: "Plus d'outils de temps",
	langLabel: 'Langue',
	tools: {
		readyEyebrow: 'Minuteurs par durée',
		readyTitle: 'Comptes à rebours prêts',
		readySub: 'Choisissez un temps — et lancez.',
		min: 'min',
	},
	unit: {
		minute: (n: number) => (n <= 1 ? 'minute' : 'minutes'),
		hour: 'heure',
	},
	minutePageLabel: (minutes: number) =>
		minutes === 60 ? 'Minuteur de 1 heure' : `Minuteur de ${minutes} minutes`,
	toolLinks: [
		{ path: '/temporizador/', label: 'Minuteur', hint: 'Compte à rebours simple' },
		{ path: '/cronometro/', label: 'Chronomètre', hint: "Compte le temps avec des tours" },
		{ path: '/pomodoro/', label: 'Pomodoro', hint: 'Concentration avec pauses' },
		{ path: '/intervalos/', label: 'Intervalles', hint: 'HIIT, tabata et entraînement' },
		{ path: '/meditacao/', label: 'Méditation', hint: 'Un chemin respiratoire' },
		{ path: '/sequencias/', label: 'Séquences', hint: 'Étapes avec alertes' },
		{ path: '/temporizador-tabata/', label: 'Tabata', hint: '20 s d’effort, 10 s de repos' },
		{ path: '/temporizador-hiit/', label: 'HIIT 40×20', hint: 'Effort maximal et repos' },
		{ path: '/temporizador-para-estudos/', label: 'Études', hint: 'Blocs de concentration avec pauses' },
		{ path: '/temporizador-para-exercicios/', label: 'Exercices', hint: 'Repos entre les séries' },
		{ path: '/temporizador-para-cozinha/', label: 'Cuisine', hint: 'Œuf, riz et four à l’heure' },
		{ path: '/temporizador-para-meditacao/', label: 'Méditation guidée', hint: 'Des sons doux pour pratiquer' },
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
		tagline: 'ein schneller, schöner Timer, der offline funktioniert.',
		about: 'Über uns',
		contact: 'Kontakt',
		privacy: 'Datenschutzerklärung',
		terms: 'Nutzungsbedingungen',
	},
	noscript: 'Aktivieren Sie JavaScript, um den Timer zu nutzen. In der Zwischenzeit finden Sie unten Zeitvorschläge.',
	moreTools: 'Weitere Zeittools',
	langLabel: 'Sprache',
	tools: {
		readyEyebrow: 'Timer nach Dauer',
		readyTitle: 'Fertige Countdowns',
		readySub: 'Zeit wählen — und loslegen.',
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
		{ path: '/temporizador-hiit/', label: 'HIIT 40×20', hint: 'Maximale Anstrengung und Ruhe' },
		{ path: '/temporizador-para-estudos/', label: 'Lernen', hint: 'Fokusblöcke mit Pausen' },
		{ path: '/temporizador-para-exercicios/', label: 'Training', hint: 'Pausen zwischen Sätzen' },
		{ path: '/temporizador-para-cozinha/', label: 'Kochen', hint: 'Ei, Reis und Ofen pünktlich' },
		{ path: '/temporizador-para-meditacao/', label: 'Geführte Meditation', hint: 'Sanfte Klänge zum Üben' },
	],
};

const uiKo: UiDict = {
	nav: {
		temporizador: '타이머',
		cronometro: '스톱워치',
		pomodoro: '포모도로',
		intervalos: '인터벌',
		meditacao: '명상',
		sequencias: '시퀀스',
	},
	footer: {
		tagline: '빠르고 아름답고 오프라인에서도 작동하는 타이머.',
		about: '소개',
		contact: '문의',
		privacy: '개인정보 처리방침',
		terms: '이용약관',
	},
	noscript: '타이머를 사용하려면 JavaScript를 활성화하세요. 그동안 아래 시간 제안을 확인하세요.',
	moreTools: '더 많은 시간 도구',
	langLabel: '언어',
	tools: {
		readyEyebrow: '시간별 타이머',
		readyTitle: '바로 쓰는 카운트다운',
		readySub: '시간을 고르고 바로 시작하세요.',
		min: '분',
	},
	unit: {
		minute: () => '분',
		hour: '시간',
	},
	minutePageLabel: (minutes: number) =>
		minutes === 60 ? '1시간 타이머' : `${minutes}분 타이머`,
	toolLinks: [
		{ path: '/temporizador/', label: '타이머', hint: '간단한 카운트다운' },
		{ path: '/cronometro/', label: '스톱워치', hint: '랩으로 시간 측정' },
		{ path: '/pomodoro/', label: '포모도로', hint: '휴식과 함께하는 집중' },
		{ path: '/intervalos/', label: '인터벌', hint: 'HIIT, 타바타, 운동' },
		{ path: '/meditacao/', label: '명상', hint: '호흡 가이드' },
		{ path: '/sequencias/', label: '시퀀스', hint: '단계마다 알림' },
		{ path: '/temporizador-tabata/', label: '타바타', hint: '20초 운동, 10초 휴식' },
		{ path: '/temporizador-hiit/', label: 'HIIT 40×20', hint: '최대 운동과 휴식' },
		{ path: '/temporizador-para-estudos/', label: '공부', hint: '휴식이 있는 집중 블록' },
		{ path: '/temporizador-para-exercicios/', label: '운동', hint: '세트 사이 휴식' },
		{ path: '/temporizador-para-cozinha/', label: '요리', hint: '계란, 밥, 오븐을 제때에' },
		{ path: '/temporizador-para-meditacao/', label: '가이드 명상', hint: '부드러운 소리로 연습' },
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
		readySub: 'Scegli il tempo — e parti.',
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
		{ path: '/temporizador-hiit/', label: 'HIIT 40×20', hint: 'Sforzo massimo e riposo' },
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