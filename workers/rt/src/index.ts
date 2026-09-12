/**
 * Real-time session relay used by /room/:id WebSocket endpoint.
 * One Durable Object per live room. See src/room.ts for the room protocol.
 */
import { Room } from './room';
export { Room };

interface Env {
	ROOM: DurableObjectNamespace<Room>;
}

const ROOM_RE = /^\/room\/([A-Z2-9]{5})$/;

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === '/' || url.pathname === '/health') {
			return new Response('ok', { status: 200 });
		}

		const match = url.pathname.match(ROOM_RE);
		if (!match) return new Response('not found', { status: 404 });

		if (request.method !== 'GET') return new Response('expected GET', { status: 400 });
		if (request.headers.get('Upgrade') !== 'websocket') {
			return new Response('expected websocket upgrade', { status: 426 });
		}

		const id = env.ROOM.idFromName(match[1]);
		const stub = env.ROOM.get(id);
		return stub.fetch(request);
	},
} satisfies ExportedHandler<Env>;