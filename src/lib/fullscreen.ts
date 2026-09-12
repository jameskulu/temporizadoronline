/** Presentation ("fullscreen") mode: class-driven so it works on all browsers,
 * with a best-effort native Fullscreen API request on top. */
const PRESENT_CLASS = 't-present';

export function isPresenting(): boolean {
	return document.body.classList.contains(PRESENT_CLASS);
}

export async function enter(): Promise<void> {
	document.body.classList.add(PRESENT_CLASS);
	await tryNative(true);
}

export async function exit(): Promise<void> {
	document.body.classList.remove(PRESENT_CLASS);
	await tryNative(false);
}

export async function toggle(): Promise<void> {
	if (isPresenting()) await exit();
	else await enter();
}

async function tryNative(want: boolean): Promise<void> {
	// Focus the native fullscreen on the timer island itself, not the whole page.
	const node = document.querySelector<HTMLElement>('#t-app') ?? document.documentElement;
	const el = node as HTMLElement & {
		requestFullscreen?: () => Promise<void>;
		webkitRequestFullscreen?: () => void;
	};
	const doc = document as Document & {
		webkitFullscreenElement?: Element | null;
		webkitExitFullscreen?: () => void;
	};
	const supported = !!el.requestFullscreen || !!el.webkitRequestFullscreen;
	if (!supported) return;
	try {
		const nativeOn = document.fullscreenElement || doc.webkitFullscreenElement;
		if (want && !nativeOn) {
			if (el.requestFullscreen) await el.requestFullscreen();
			else el.webkitRequestFullscreen?.();
		} else if (!want && nativeOn) {
			if (document.exitFullscreen) await document.exitFullscreen();
			else doc.webkitExitFullscreen?.();
		}
	} catch {
		/* class-based presentation already applied */
	}
}

/** Watch native fullscreen exit (Esc) so our presentation chrome follows. */
export function onNativeChange(cb: (on: boolean) => void): void {
	document.addEventListener('fullscreenchange', () => {
		if (!document.fullscreenElement) cb(false);
	});
	document.addEventListener('webkitfullscreenchange', () => {
		const doc = document as Document & { webkitFullscreenElement?: Element | null };
		if (!doc.webkitFullscreenElement) cb(false);
	});
}