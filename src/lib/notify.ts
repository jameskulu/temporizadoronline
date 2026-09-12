/** Browser notifications + haptic vibration. */
import { clamp } from './format';

export function notificationsSupported(): boolean {
	return typeof Notification !== 'undefined';
}

export function notificationsGranted(): boolean {
	return notificationsSupported() && Notification.permission === 'granted';
}

export function permissionState(): NotificationPermission | 'unsupported' {
	return notificationsSupported() ? Notification.permission : 'unsupported';
}

export async function askPermission(): Promise<boolean> {
	if (!notificationsSupported()) return false;
	if (Notification.permission === 'granted') return true;
	const res = await Notification.requestPermission();
	return res === 'granted';
}

export interface NotifyOpts {
	title: string;
	body: string;
	icon?: string;
}

/** Only delivered when the page is hidden (in-page UI covers the visible case). */
export function notifyWhenHidden(opts: NotifyOpts): void {
	if (!document.hidden) return;
	if (!notificationsGranted()) return;
	try {
		new Notification(opts.title, {
			body: opts.body,
			icon: opts.icon || '/icons/icon-192.png',
			tag: 'temporizador-finish',
		});
	} catch {
		/* some browsers require a service worker registration */
	}
}

const vibUnsupported = typeof navigator === 'undefined' || !('vibrate' in navigator);

let vibrateEnabled = true;

export function setVibrateEnabled(on: boolean): void {
	vibrateEnabled = on;
}

export function vibrate(pattern: number | number[] = [220, 120, 220]): void {
	if (!vibrateEnabled || vibUnsupported) return;
	try {
		if (typeof pattern === 'number') navigator.vibrate?.(clamp(pattern, 0, 2000));
		else navigator.vibrate?.(pattern);
	} catch {
		/* no-op */
	}
}