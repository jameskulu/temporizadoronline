/** Preset data: quick presets, use-case categories, sample sequences. */
import type { Initial, SequenceStep } from './types';

export interface LaunchPreset {
	label: string;
	initial: Initial;
	hint?: string;
}

export const QUICK_PRESETS: LaunchPreset[] = [
	{ label: '1 min', initial: { seconds: 60 } },
	{ label: '5 min', initial: { seconds: 300 } },
	{ label: '10 min', initial: { seconds: 600 } },
	{ label: '15 min', initial: { seconds: 900 } },
	{ label: '20 min', initial: { seconds: 1200 } },
	{ label: '25 min', initial: { seconds: 1500 } },
	{ label: '30 min', initial: { seconds: 1800 } },
	{ label: '45 min', initial: { seconds: 2700 } },
	{ label: '60 min', initial: { seconds: 3600 } },
];

const steps = (
	list: Array<[string, number, SequenceStep['sound']]>,
): SequenceStep[] =>
	list.map(([name, seconds, sound], i) => ({ id: `s${i}-${name}`, name, seconds, sound }));

const HIIT: Initial = {
	mode: 'interval',
	workSec: 40,
	restSec: 20,
	rounds: 8,
	prepareSec: 5,
	label: 'HIIT',
};
const TABATA: Initial = {
	mode: 'interval',
	workSec: 20,
	restSec: 10,
	rounds: 8,
	prepareSec: 3,
	label: 'Tabata',
};
const BOXING: Initial = { mode: 'interval', workSec: 180, restSec: 60, rounds: 12, prepareSec: 10, label: 'Boxe' };
const WORKOUT: Initial = { mode: 'interval', workSec: 45, restSec: 15, rounds: 20, prepareSec: 5, label: 'Treino' };

export const CATEGORIES: Array<{ name: string; items: LaunchPreset[] }> = [
	{
		name: 'Estudos',
		items: [
			{ label: 'Pomodoro', initial: { mode: 'pomodoro', label: 'Pomodoro' }, hint: 'Foco 25 min + pausas' },
			{ label: 'Trabalho profundo', initial: { seconds: 3000, label: 'Trabalho profundo' }, hint: '50 minutos' },
			{ label: 'Pausa de estudos', initial: { seconds: 600, label: 'Pausa de estudos' }, hint: '10 minutos' },
			{ label: 'Prova', initial: { seconds: 3600, label: 'Prova' }, hint: '60 minutos' },
		],
	},
	{
		name: 'Exercícios',
		items: [
			{ label: 'HIIT', initial: HIIT, hint: '40 s esforço · 20 s descanso' },
			{ label: 'Tabata', initial: TABATA, hint: '20 s esforço · 10 s descanso' },
			{ label: 'Boxe', initial: BOXING, hint: '3 min por round' },
			{ label: 'Treino', initial: WORKOUT, hint: '45 s esforço · 15 s descanso' },
			{ label: 'Descanso', initial: { seconds: 60, label: 'Descanso' }, hint: '1 minuto entre séries' },
		],
	},
	{
		name: 'Cozinha',
		items: [
			{ label: '1 minuto', initial: { seconds: 60, label: 'Cozinha' }, hint: 'Ovos, chá' },
			{ label: '5 minutos', initial: { seconds: 300, label: 'Cozinha' }, hint: 'Arroz, vegetais' },
			{ label: '10 minutos', initial: { seconds: 600, label: 'Cozinha' }, hint: 'Massas, peixes' },
			{ label: '15 minutos', initial: { seconds: 900, label: 'Cozinha' }, hint: 'Assados, molhos' },
			{ label: '30 minutos', initial: { seconds: 1800, label: 'Cozinha' }, hint: 'Pratos completos' },
		],
	},
	{
		name: 'Outros',
		items: [
			{ label: 'Meditação', initial: { mode: 'meditation', seconds: 600, label: 'Meditação' }, hint: '10 minutos' },
			{ label: 'Sala de aula', initial: { seconds: 2400, label: 'Sala de aula' }, hint: '40 minutos' },
			{ label: 'Apresentação', initial: { seconds: 900, label: 'Apresentação' }, hint: '15 minutos' },
			{ label: 'Reunião', initial: { seconds: 1800, label: 'Reunião' }, hint: '30 minutos' },
			{ label: 'Soneca', initial: { seconds: 1200, label: 'Soneca' }, hint: '20 minutos' },
		],
	},
];

export const SAMPLE_SEQUENCES: Array<{ name: string; steps: SequenceStep[] }> = [
	{
		name: 'Treino completo',
		steps: steps([
			['Aquecimento', 300, 'beep'],
			['Exercício', 180, 'digital'],
			['Descanso', 60, 'beep'],
			['Exercício', 180, 'digital'],
			['Descanso', 60, 'beep'],
			['Relaxamento', 300, 'zen'],
		]),
	},
	{
		name: 'Foco por blocos',
		steps: steps([
			['Estudo', 1500, 'digital'],
			['Pausa', 300, 'chime'],
			['Estudo', 1500, 'digital'],
			['Pausa longa', 900, 'zen'],
		]),
	},
];

export const DEFAULT_ROUNDS = 8;
export const DEFAULT_FOCUS = 1500;
export const DEFAULT_SHORT_BREAK = 300;
export const DEFAULT_LONG_BREAK = 900;
export const ROUNDS_BEFORE_LONG = 4;