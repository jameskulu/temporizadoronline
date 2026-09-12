/**
 * Real-time "live room" client. Connects to the /room/:id WebSocket relay
 * (see workers/rt) and mirrors the host's authoritative timer snapshot.
 *
 * Timestamps in the mirrors are absolute (epoch ms) so every connected device
 * renders the same countdown without per-second traffic; only state changes
 * (start/pause/reset/phase/config) cross the wire.
 */
import { SITE_URL } from './share';

export type LiveRole = 'host' | 'viewer';
export type LiveStatus = 'idle' | 'connecting' | 'open' | 'reconnecting' | 'lost' | 'closed';

export interface LivePhase {
	label: string;
	kind: string;
	round: number;
	totalRounds: number;
	stepIndex: number;
	stepCount: number;
	overtime: boolean;
}

export type LiveMirror =
	| { t: 'tick'; end: number; duration: number }
	| { t: 'tock'; start: number; base: number }
	| { t: 'idle'; rem: number; duration: number }
	| { t: 'stop'; base: number };

export interface RoomStatePkg {
	cfg: Record<string, unknown>;
	phase: LivePhase;
	mirror: LiveMirror;
	at: number;
}

export interface LiveEvents {
	onState?: (pkg: RoomStatePkg | null, role: LiveRole) => void;
	onRole?: (role: LiveRole) => void;
	onMembers?: (count: number) => void;
	onStatus?: (status: LiveStatus) => void;
	onHostLost?: () => void;
}

interface ServerMsg {
	type: 'welcome' | 'state' | 'role' | 'members' | 'hostlost';
	role?: LiveRole;
	state?: RoomStatePkg | null;
	count?: number;
}

const ROOM_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // excludes 0,1,I,O

export function genRoomId(len = 5): string {
	const r = new Uint32Array(len);
	crypto.getRandomValues(r);
	let out = '';
	for (let i = 0; i < len; i++) out += ROOM_CHARS[r[i] % ROOM_CHARS.length];
	return out;
}

/** Local dev talks to a local wrangler instance; production uses rt.<sitedomain>. */
function rtBase(): string {
	const host = typeof location !== 'undefined' ? location.hostname : 'localhost';
	if (host === 'localhost' || host === '127.0.0.1') return 'ws://localhost:8787';
	return `wss://rt.${new URL(SITE_URL).host}`;
}

export class LiveRoom {
	roomId: string;
	role: LiveRole = 'viewer';
	connected = false;

	private ws: WebSocket | null = null;
	private events: LiveEvents;
	private pingTimer: number | null = null;
	private retries = 0;
	private closed = false;
	/** Consecutive failed reconnects before giving up and reporting 'lost'. */
	maxRetries = 3;

	constructor(roomId: string, events: LiveEvents = {}) {
		this.roomId = roomId;
		this.events = events;
	}

	connect(): void {
		if (this.closed) return;
		if (typeof window !== 'undefined') {
			window.addEventListener('offline', this.onOffline);
		}
		this.events.onStatus?.(this.retries ? 'reconnecting' : 'connecting');
		const ws = new WebSocket(`${rtBase()}/room/${this.roomId}`);
		this.ws = ws;
		ws.addEventListener('open', () => {
			this.connected = true;
			this.retries = 0;
			this.events.onStatus?.('open');
			this.startPing();
		});
		ws.addEventListener('message', (e) => this.onMessage(e.data));
		ws.addEventListener('close', () => this.onClose());
		ws.addEventListener('error', () => {
			/* a close event always follows */
		});
	}

	private onOffline = (): void => {
		if (this.closed) return;
		this.connected = false;
		this.stopPing();
		this.events.onStatus?.('lost');
		this.events.onHostLost?.();
	};

	private onMessage(raw: unknown): void {
		let msg: ServerMsg;
		try {
			msg = JSON.parse(String(raw)) as ServerMsg;
		} catch {
			return;
		}
		switch (msg.type) {
			case 'welcome':
				this.role = msg.role ?? 'viewer';
				this.events.onRole?.(this.role);
				this.events.onState?.(msg.state ?? null, this.role);
				break;
			case 'role':
				this.role = msg.role ?? 'viewer';
				this.events.onRole?.(this.role);
				break;
			case 'state':
				this.events.onState?.(msg.state ?? null, this.role);
				break;
			case 'members':
				this.events.onMembers?.(msg.count ?? 0);
				break;
			case 'hostlost':
				this.connected = false;
				this.stopPing();
				this.events.onHostLost?.();
				break;
		}
	}

	private onClose(): void {
		this.connected = false;
		this.stopPing();
		if (this.closed) {
			this.events.onStatus?.('closed');
			return;
		}
		if (this.retries >= this.maxRetries || (typeof navigator !== 'undefined' && !navigator.onLine)) {
			this.events.onStatus?.('lost');
			this.events.onHostLost?.();
			return;
		}
		const delay = Math.min(1000 * 2 ** this.retries, 8000);
		this.retries++;
		this.events.onStatus?.('reconnecting');
		window.setTimeout(() => this.connect(), delay);
	}

	private startPing(): void {
		this.stopPing();
		this.pingTimer = window.setInterval(() => {
			if (this.ws?.readyState === WebSocket.OPEN) {
				this.ws.send('{"type":"hello"}');
			}
		}, 25_000);
	}

	private stopPing(): void {
		if (this.pingTimer !== null) {
			clearInterval(this.pingTimer);
			this.pingTimer = null;
		}
	}

	/** Host only: publish the current authoritative room snapshot. */
	publishState(pkg: RoomStatePkg): void {
		if (this.closed || !this.connected || this.role !== 'host' || !this.ws) return;
		if (this.ws.readyState !== WebSocket.OPEN) return;
		this.ws.send(JSON.stringify({ type: 'state', state: pkg }));
	}

	/** Host leaving/refreshing: send leave message and close socket immediately. */
	leave(): void {
		if (this.closed) return;
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			try {
				this.ws.send(JSON.stringify({ type: 'leave' }));
			} catch {
				/* already closing */
			}
		}
		this.close();
	}

	close(): void {
		this.closed = true;
		if (typeof window !== 'undefined') {
			window.removeEventListener('offline', this.onOffline);
		}
		this.stopPing();
		try {
			this.ws?.close(1000, 'host left');
		} catch {
			/* already closed */
		}
		this.ws = null;
		this.connected = false;
	}
}