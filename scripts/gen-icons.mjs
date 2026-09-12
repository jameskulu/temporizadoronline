// Generates PWA + Apple touch PNG icons from raw pixel math (no deps).
// Renders a minimalist clock: near-black rounded tile, light ring,
// accent hand pointing to 12, accent center dot.
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons');
mkdirSync(root, { recursive: true });

// ---- PNG encoding ----
const CRC_TABLE = (() => {
	const t = new Uint32Array(256);
	for (let n = 0; n < 256; n++) {
		let c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		t[n] = c >>> 0;
	}
	return t;
})();

function crc32(buf) {
	let c = 0xffffffff;
	for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
	return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
	const len = Buffer.alloc(4);
	len.writeUInt32BE(data.length);
	const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
	const crc = Buffer.alloc(4);
	crc.writeUInt32BE(crc32(body));
	return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgba) {
	const ihdr = Buffer.alloc(13);
	ihdr.writeUInt32BE(width, 0);
	ihdr.writeUInt32BE(height, 4);
	ihdr[8] = 8;
	ihdr[9] = 6;
	const raw = Buffer.alloc((width * 4 + 1) * height);
	for (let y = 0; y < height; y++) {
		raw[y * (width * 4 + 1)] = 0;
		rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
	}
	const idat = deflateSync(raw, { level: 9 });
	return Buffer.concat([
		Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		chunk('IHDR', ihdr),
		chunk('IDAT', idat),
		chunk('IEND', Buffer.alloc(0)),
	]);
}

// ---- Drawing ----
const INK = [29, 29, 31];
const RING = [245, 245, 247];
const ACCENT = [0, 102, 204];

function distToSegment(px, py, ax, ay, bx, by) {
	const dx = bx - ax;
	const dy = by - ay;
	const len2 = dx * dx + dy * dy;
	let t = len2 ? ((px - ax) * dx + (py - ay) * dy) / len2 : 0;
	t = Math.max(0, Math.min(1, t));
	return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function render(size, { fullBleed = false } = {}) {
	const buf = Buffer.alloc(size * size * 4);
	const cx = size / 2;
	const cy = size / 2;
	const rOuter = size * 0.47;
	const rInner = size * 0.33;
	const handLen = size * 0.3;
	const handW = Math.max(2.5, size * 0.06);
	const dotR = size * 0.075;
	const cornerR = fullBleed ? 0 : size * 0.215;

	// Hand segment: center -> pointing up (12 o'clock)
	const hx = cx;
	const hy = cy - handLen;

	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			const i = (y * size + x) * 4;
			const px = x + 0.5;
			const py = y + 0.5;
			const d = Math.hypot(px - cx, py - cy);

			let color = INK;
			let a = 1;

			// Ring
			if (d >= rInner && d <= rOuter) {
				const t = Math.min(d - rInner, rOuter - d);
				const ringAlpha = t < 1.2 ? Math.max(0, t / 1.2) : 1;
				color = RING;
				a = Math.min(a, ringAlpha);
			}

			// Hand
			if (distToSegment(px, py, cx, cy, hx, hy) <= handW / 2) {
				color = ACCENT;
			}

			// Center dot
			if (d <= dotR) {
				color = ACCENT;
			}

			// Rounded corner alpha
			if (cornerR > 0) {
				const cr = Math.min(
					Math.hypot(px - 0.5, py - 0.5),
					Math.hypot(px - (size - 1.5), py - 0.5),
					Math.hypot(px - 0.5, py - (size - 1.5)),
					Math.hypot(px - (size - 1.5), py - (size - 1.5)),
				);
				if (cr < cornerR) a = Math.min(a, Math.max(0, (cornerR - cr) / 1.5));
			}

			buf[i] = color[0];
			buf[i + 1] = color[1];
			buf[i + 2] = color[2];
			buf[i + 3] = Math.round(a * 255);
		}
	}
	return buf;
}

for (const size of [192, 512]) {
	writeFileSync(join(root, `icon-${size}.png`), encodePng(size, size, render(size)));
	writeFileSync(join(root, `maskable-${size}.png`), encodePng(size, size, render(size, { fullBleed: true })));
	console.log(`icon-${size}.png / maskable-${size}.png`);
}

{
	const size = 180;
	writeFileSync(join(root, 'apple-touch-icon.png'), encodePng(size, size, render(size)));
	console.log('apple-touch-icon.png');
}