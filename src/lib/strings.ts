/** pt-BR UI strings. */
import type { Mode } from './types';

export const STR = {
	appName: 'Temporizador Online',
	start: 'Iniciar',
	pause: 'Pausar',
	resume: 'Retomar',
	reset: 'Redefinir',
	restart: 'Recomeçar',
	stopwatch: 'Cronômetro',
	lap: 'Volta',
	addMinute: 'Adicionar 1 minuto',
	subMinute: 'Subtrair 1 minuto',
	finished: 'Concluído',
	ready: 'Pronto',
	overtime: 'Tempo extra',
	skip: 'Pular',
	fullscreen: 'Tela cheia',
	share: 'Compartilhar',
	settings: 'Configurações',
	help: 'Ajuda e atalhos',
	mute: 'Silenciar',
	unmute: 'Ativar som',
	close: 'Fechar',
	copied: 'Link copiado!',
	copyLink: 'Copiar link',
	qrCode: 'Código QR',
	qrHint: 'Abra no celular com a câmera',
	newTimer: 'Novo timer',
	timerLabel: (n: number) => `Timer ${n}`,
	timeShort: 'Tempo',
	phaseLabel: 'Fase',
	roundOf: (r: number, total: number) => `Rodada ${r} de ${total}`,
	stepOf: (i: number, total: number) => `Etapa ${i} de ${total}`,
	configButton: 'Configurar',
	presetButton: 'Presets',
	keyboardHint: 'Espaço inicia/pausa · R redefine · F tela cheia · M som · ? ajuda',
	keepScreen: 'Manter tela ligada',
	notifications: 'Notificações do navegador',
	vibration: 'Vibração no celular',
	soundTest: 'Testar som',
	chooseSound: 'Som do alarme',
	displayStyle: 'Estilo do mostrador',
	themeSetting: 'Tema',
	overtimeSetting: 'Continuar contando após zero',
	autoRestart: 'Recomeçar sozinho',
	autoAdvance: 'Avançar fases automaticamente',
	volume: 'Volume',
	popular: 'Temporizadores populares',
	useCases: 'Temporizadores para cada tarefa',
	recent: 'Usados recentemente',
	customPresets: 'Meus presets',
	addPreset: 'Salvar este tempo',
	presetName: 'Nome do preset',
} as const;

export const MODE_NAMES: Record<Mode, string> = {
	timer: 'Temporizador',
	stopwatch: 'Cronômetro',
	pomodoro: 'Pomodoro',
	interval: 'Intervalos',
	meditation: 'Meditação',
	sequence: 'Sequências',
};

export const SOUND_NAMES: Record<string, string> = {
	beep: 'Bipe',
	digital: 'Digital',
	chime: 'Sineta',
	zen: 'Zen',
	bell: 'Campainha',
};

export const DISPLAY_NAMES: Record<string, string> = {
	digital: 'Digital',
	circular: 'Progresso circular',
	bar: 'Barra de progresso',
	minimal: 'Mínimo',
};

export const THEME_NAMES: Record<string, string> = {
	light: 'Claro',
	dark: 'Escuro',
	system: 'Sistema',
};

export const PHASE_NAMES: Record<string, string> = {
	prepare: 'Prepare-se',
	work: 'Trabalho',
	rest: 'Descanso',
	focus: 'Foco',
	shortBreak: 'Pausa curta',
	longBreak: 'Pausa longa',
	step: 'Etapa',
	overtime: 'Tempo extra',
	elapsed: 'Tempo',
	countdown: 'Temporizador',
};

/** Screen-reader-friendly announce of remaining time. */
export function ariaRemaining(sec: number, label: string): string {
	if (sec <= 0) return label ? `${label} concluído. Tempo esgotado.` : 'Tempo esgotado.';
	const m = Math.floor(sec / 60);
	const s = sec % 60;
	const mTxt = m === 1 ? '1 minuto' : `${m} minutos`;
	const sTxt = s === 1 ? '1 segundo' : `${s} segundos`;
	return `${label ? label + ' — ' : ''}${m > 0 ? mTxt + (s > 0 ? ' e ' : '') : ''}${s > 0 ? sTxt : ''} restantes`;
}