/** Sequence editor dialog content + helpers. */
import type { SequenceStep } from '../types';
import { esc, I } from './dom';
import { formatDurationSec } from '../format';
import { SOUND_NAMES } from '../strings';
import { SAMPLE_SEQUENCES } from '../presets';

export function rowHtml(s: SequenceStep, i: number): string {
	const opts = Object.entries(SOUND_NAMES)
		.map(([v, l]) => `<option value="${v}"${v === s.sound ? ' selected' : ''}>${l}</option>`)
		.join('');
	return `<div class="seq-row flex flex-wrap items-center gap-2" data-seq-row="${i}">
		<div class="flex items-center gap-1">
			<button type="button" class="icon-btn" data-seq="up" data-idx="${i}" aria-label="Subir etapa" data-sel>${I.up}</button>
			<button type="button" class="icon-btn" data-seq="down" data-idx="${i}" aria-label="Descer etapa" data-sel>${I.down}</button>
			<button type="button" class="icon-btn text-danger" data-seq="del" data-idx="${i}" aria-label="Remover etapa" data-sel>${I.trash}</button>
		</div>
		<input class="field-input flex-1 min-w-[8rem]" type="text" data-seq-name="${i}" value="${esc(s.name)}" maxlength="40" aria-label="Nome da etapa"/>
		<input class="field-input w-24" type="number" min="1" max="21600" step="1" data-seq-sec="${i}" value="${Math.round(s.seconds)}" aria-label="Duração em segundos"/>
		<select class="field-input w-32" data-seq-sound="${i}" aria-label="Som da etapa">${opts}</select>
	</div>`;
}

export function dialogHtml(steps: SequenceStep[], tpl: { name: string } | null): string {
	const rows = steps.map(rowHtml).join('');
	const total = steps.reduce((a, s) => a + s.seconds, 0);
	const title = tpl ? `${esc(tpl.name)} — editar` : 'Minhas sequências';
	const sampleChips = SAMPLE_SEQUENCES.map(
		(t, i) => `<button type="button" class="btn-chip" data-act="tpl" data-i="${i}">${esc(t.name)}</button>`,
	).join('');
	return `<div id="seq-dialog" class="dialog-content">
		<div class="flex items-center justify-between gap-4 mb-4">
			<h2 class="text-lg font-semibold">${title}</h2>
			<button type="button" class="icon-btn" data-act="dlg-close" aria-label="Fechar">${I.close}</button>
		</div>
		<p class="text-sm text-muted mb-4">Crie uma sequência de etapas com avisos sonoros. O temporizador toca um som a cada mudança de etapa.</p>
		<div class="flex flex-wrap items-center gap-2 mb-4">
			<button type="button" class="btn-chip" data-seq="add">${I.plus}<span>Adicionar etapa</span></button>
			<span class="text-sm text-muted">Modelos:</span>
			${sampleChips}
		</div>
		<div id="seq-list" class="flex flex-col gap-2 mb-3">${rows || '<p class="text-sm text-muted">Nenhuma etapa ainda.</p>'}</div>
		<div class="flex items-center gap-2 mb-3">
			<span class="text-sm text-muted">Total: ${esc(formatDurationSec(total))}</span>
		</div>
		<div class="flex gap-2 mt-2">
			<button type="button" class="btn-primary flex-1" data-act="seq-save">Usar sequência</button>
			<button type="button" class="btn-chip" data-seq="clear">Tudo limpo</button>
		</div>
	</div>`;
}

export function templatesHtml(): string {
	return '';
}