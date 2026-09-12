/**
 * Local smoke test for the /room/:id WebSocket relay.
 * Run against `wrangler dev --local --port 8787` (Node 22+ WebSocket is global).
 */
const BASE = process.env.RT_BASE ?? 'ws://127.0.0.1:8787';
const ROOM = process.env.RT_ROOM ?? 'SMOKE';

function makePkg(at) {
	return {
		cfg: { mode: 'timer', seconds: 300 },
		phase: { label: 'Temporizador', kind: 'countdown', round: 0, totalRounds: 0, stepIndex: -1, stepCount: 0, overtime: false },
		mirror: { t: 'idle', rem: 300, duration: 300 },
		at,
	};
}

function connect(name) {
	return new Promise((resolve, reject) => {
		const ws = new WebSocket(`${BASE}/room/${ROOM}`);
		const pending = [];
		const waiters = [];
		ws.addEventListener('open', () => {
			resolve({
				name,
				ws,
				send: (obj) => ws.send(JSON.stringify(obj)),
				next: (match = () => true) => {
					return new Promise((res, rej) => {
						const i = pending.findIndex((m) => match(m));
						if (i >= 0) return res(pending.splice(i, 1)[0]);
						waiters.push({ match, res, rej });
					});
				},
			});
		});
		ws.addEventListener('error', (e) => reject(new Error(`ws error (${name})`)));
		ws.addEventListener('message', (e) => {
			const msg = JSON.parse(e.data);
			const wi = waiters.findIndex((w) => w.match(msg));
			if (wi >= 0) waiters.splice(wi, 1)[0].res(msg);
			else pending.push(msg);
		});
	});
}

function assert(cond, label) {
	if (!cond) throw new Error(`FAIL: ${label}`);
	console.log(`ok - ${label}`);
}

function wait(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

async function main() {
	const hostC = await connect('host');
	await hostC.next((m) => m.type === 'welcome');
	assert(hostC.name === 'host', 'first connection is host');

	const viewerC = await connect('viewer');
	await viewerC.next((m) => m.type === 'welcome' && m.role === 'viewer');
	assert(viewerC.name === 'viewer', 'second connection is viewer');

	hostC.send({ type: 'state', state: makePkg(Date.now()) });
	const seen = await viewerC.next((m) => m.type === 'state');
	assert(seen.state.mirror.t === 'idle' && seen.state.cfg.mode === 'timer', 'viewer receives host state');

	await viewerC.next((m) => m.type === 'members' && m.count === 2);
	assert(true, 'members broadcast received');

	hostC.ws.close();
	const lost = await viewerC.next((m) => m.type === 'hostlost');
	assert(lost.type === 'hostlost', 'viewer receives hostlost after host leaves');

	// no crash; just close cleanly
	await wait(200);
	viewerC.ws.close();
	await wait(300);
	console.log('ALL PASS');
}

main().catch((e) => {
	console.error(e.message);
	process.exit(1);
});