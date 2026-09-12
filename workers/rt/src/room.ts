/**
 * Room Durable Object: one instance per live-sharing session.
 *
 * Semantics:
 * - First connection becomes the HOST. While the host is connected, only it
 *   may publish room state ({ type: 'state' }); every other member is a
 *   viewer.
 * - When the host disconnects (page refresh / connection lost), every
 *   remaining member is sent { type: 'hostlost' } and the persisted state is
 *   cleared: the timer is considered lost and members must refresh the page
 *   to restart. The next member to (re)join becomes the fresh host.
 * - The latest state is persisted so a late joiner always receives the
 *   current snapshot while the room is alive.
 *
 * Wire protocol (JSON):
 *   client -> server  { type: 'hello' }                 keepalive
 *                     { type: 'state', state: RoomStatePkg }  host only
 *   server -> client  { type: 'welcome', role, state } on connect
 *                     { type: 'state',  state }         state changed
 *                     { type: 'hostlost' }              host disconnected
 *                     { type: 'members', count }        membership changed
 */
import { DurableObject } from 'cloudflare:workers';

interface Env {
	ROOM: DurableObjectNamespace<Room>;
}

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

type ServerMsg =
	| { type: 'welcome'; role: 'host' | 'viewer'; state: RoomStatePkg | null }
	| { type: 'state'; state: RoomStatePkg }
	| { type: 'hostlost' }
	| { type: 'members'; count: number };

type ClientMsg = { type: 'state'; state: RoomStatePkg } | { type: 'hello' } | { type: 'leave' };

const STATE_KEY = 'state';

export class Room extends DurableObject<Env> {
	private sessions = new Map<WebSocket, string>();
	private hostId: string | null = null;
	private roomState: RoomStatePkg | null = null;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		ctx.blockConcurrencyWhile(async () => {
			this.roomState = (await ctx.storage.get<RoomStatePkg>(STATE_KEY)) ?? null;
		});
	}

	async fetch(request: Request): Promise<Response> {
		const pair = new WebSocketPair();
		const [client, server] = Object.values(pair);
		server.accept();

		const id = crypto.randomUUID();
		this.sessions.set(server, id);
		const isHost = this.hostId === null;
		if (isHost) this.hostId = id;

		server.addEventListener('message', (e) => this.onMessage(server, e.data));
		server.addEventListener('close', () => this.onClose(server));
		server.addEventListener('error', () => this.onClose(server));

		this.send(server, {
			type: 'welcome',
			role: isHost ? 'host' : 'viewer',
			state: this.roomState,
		});
		this.broadcastMembers();

		return new Response(null, { status: 101, webSocket: client });
	}

	private onMessage(ws: WebSocket, raw: string | ArrayBuffer): void {
		let msg: ClientMsg;
		try {
			msg = JSON.parse(String(raw)) as ClientMsg;
		} catch {
			return;
		}
		if (msg.type === 'hello') return;

		const sessionId = this.sessions.get(ws);
		if (!sessionId || sessionId !== this.hostId) return;

		if (msg.type === 'leave') {
			this.hostId = null;
			void this.ctx.storage.delete(STATE_KEY);
			this.broadcast({ type: 'hostlost' });
			return;
		}

		this.roomState = msg.state;
		void this.ctx.storage.put(STATE_KEY, this.roomState);
		this.broadcast({ type: 'state', state: this.roomState }, ws);
	}

	private onClose(ws: WebSocket): void {
		const id = this.sessions.get(ws);
		this.sessions.delete(ws);

		if (id && id === this.hostId) {
			// The host is gone (refresh/connection lost): the timer is lost.
			// Clear the room state and tell everyone left to refresh the page.
			this.hostId = null;
			void this.ctx.storage.delete(STATE_KEY);
			this.broadcast({ type: 'hostlost' });
		}
		this.broadcastMembers();
	}

	private send(ws: WebSocket, msg: ServerMsg): void {
		try {
			ws.send(JSON.stringify(msg));
		} catch {
			/* socket already closed */
		}
	}

	private broadcast(msg: ServerMsg, except?: WebSocket): void {
		for (const w of this.sessions.keys()) {
			if (w !== except) this.send(w, msg);
		}
	}

	private broadcastMembers(): void {
		this.broadcast({ type: 'members', count: this.sessions.size });
	}
}