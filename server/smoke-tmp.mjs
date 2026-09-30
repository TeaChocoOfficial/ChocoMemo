// Smoke test for the deck API: signs its own session token using the app's
// configured secret, calls the endpoints, prints only statuses and bodies.
// The secret is read inside this process and never printed.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/home/teachoco/Dev/TeaChoco/TeaChoco-Application/ChocoMemo/server/');

const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]),
);
const jwt = require('/home/teachoco/Dev/TeaChoco/TeaChoco-Application/ChocoMemo/server/node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken');
const B = 'http://127.0.0.1:3942';
const USER = process.argv[2];

const token = jwt.sign(
  { userId: USER, name: 'Smoke Test', nameTag: 'smoke', role: 'user', lastLoginAt: new Date().toISOString() },
  env.JWT_SECRET,
  { expiresIn: '1h' },
);
const cookie = `access_token=${token}`;

const call = async (label, method, path, body) => {
  const res = await fetch(B + path, {
    method,
    headers: { Cookie: cookie, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  console.log(`\n[${label}] ${method} ${path} -> ${res.status}`);
  console.log(text.slice(0, 420));
  return { status: res.status, body: text ? JSON.parse(text) : null };
};

const word = (w, meaning) => ({
  word: w,
  reading: 'よみ',
  meaning,
  example: { before: [{ ch: 'は' }], segments: [{ ch: w, rt: 'よ' }], after: [{ ch: 'を' }], meaning: 'a sentence' },
});

const created = await call('create vocab', 'POST', '/api/decks', {
  type: 'vocab',
  language: 'japanese',
  name: 'Nature and animals',
  description: 'Smoke test deck',
  tags: ['Nature', ' beginner '],
  visibility: 'public',
  content: [word('山', 'mountain'), word('川', 'river')],
});

const id = created.body?.id;
if (!id) process.exit(1);

await call('read with content', 'GET', `/api/decks/${id}?include=true`);
await call('browse', 'GET', '/api/decks?language=japanese&type=vocab&limit=1');
await call('tag filter (normalised)', 'GET', '/api/decks?tag=nature');
await call('wrong content for type', 'POST', '/api/decks', {
  type: 'vocab', language: 'japanese', name: 'bad', content: [{ id: 'x', prompt: 'hi', options: ['a', 'b'], correctAnswer: 'a', type: 'meaning' }],
});
await call('exam deck', 'POST', '/api/decks', {
  type: 'exam', language: 'japanese', name: 'Quiz', visibility: 'public',
  content: [
    { type: 'meaning', prompt: '山', promptReading: 'やま', options: ['mountain', 'river'], correctAnswer: 'mountain' },
    { type: 'fillBlank', sentenceBefore: ' hiking ', sentenceAfter: ' fun', options: ['yes', 'no'], correctAnswer: 'yes' },
  ],
});
await call('invalid question variant', 'POST', '/api/decks', {
  type: 'exam', language: 'japanese', name: 'Bad quiz',
  content: [{ type: 'fillBlank', prompt: 'no prompt allowed here', options: ['a', 'b'], correctAnswer: 'a' }],
});
await call('update content (version bump)', 'PUT', `/api/decks/${id}`, {
  content: [word('海', 'sea')],
});
await call('private deck is hidden', 'POST', '/api/decks', {
  type: 'render', language: 'japanese', name: 'Private passage', visibility: 'private',
  content: [{ title: 'Hidden', lines: [{ segments: [{ ch: 'ひ' }] }], translation: 'hidden' }],
});
