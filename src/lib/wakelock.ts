/** Screen Wake Lock helper with graceful fallback. */
let sentinel: WakeLockSentinel | null = null;
let requested = false;

const nav = navigator as Navigator & {
	wakeLock?: { request: (type?: 'screen') => Promise<WakeLockSentinel> };
};

export function isSupported(): boolean {
	return typeof nav.wakeLock?.request === 'function';
}

export async function request(): Promise<boolean> {
	requested = true;
	if (!isSupported()) return false;
	try {
		if (!sentinel) {
			sentinel = await nav.wakeLock!.request('screen');
			sentinel.addEventListener('release', () => {
				if (requested) {
					// Auto-released (e.g. tab hidden); try to re-acquire what stays visible
					if (!document.hidden) void request();
				}
			});
		}
		return true;
	} catch {
		return false;
	}
}

export function release(): void {
	requested = false;
	if (sentinel) {
		void sentinel.release().catch(() => {});
		sentinel = null;
	}
}

/** Call on visibility change; re-acquires the lock if still wanted. */
export function onVisibility(forget: boolean): void {
	if (forget) {
		release();
		return;
	}
	if (requested && !document.hidden && !sentinel && isSupported()) void request();
}