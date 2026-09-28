import test from 'node:test';
import assert from 'node:assert/strict';
import { APPLICATION_SLUGS, DEFAULT_WINDOWS, isWindowOpen, windowState, toPublicWindow } from './applicationWindow.js';

const T = new Date('2026-10-01T12:00:00Z');

test('opensAt yoksa kapalı', () => {
  assert.equal(isWindowOpen({ opensAt: null, closesAt: null }, T), false);
  assert.equal(windowState({ opensAt: null, closesAt: null }, T), 'closed');
});

test('açılış anında açık', () => assert.equal(isWindowOpen({ opensAt: T, closesAt: null }, T), true));

test('açılıştan önce planlandı', () => {
  const w = { opensAt: new Date(+T + 1), closesAt: null };
  assert.equal(isWindowOpen(w, T), false);
  assert.equal(windowState(w, T), 'scheduled');
});

test('kapanış anında kapalı', () => {
  const w = { opensAt: new Date(+T - 3600e3), closesAt: T };
  assert.equal(isWindowOpen(w, T), false);
  assert.equal(windowState(w, T), 'closed');
});

test('kapanıştan hemen önce açık', () =>
  assert.equal(isWindowOpen({ opensAt: new Date(+T - 3600e3), closesAt: new Date(+T + 1) }, T), true));

test('kapanış yoksa süresiz açık', () =>
  assert.equal(isWindowOpen({ opensAt: new Date('2025-01-01T00:00:00Z'), closesAt: null }, T), true));

test('varsayılanlar: genel açık, teknikler kapalı', () => {
  assert.deepEqual(Object.keys(DEFAULT_WINDOWS), APPLICATION_SLUGS);
  assert.equal(isWindowOpen(DEFAULT_WINDOWS.general, T), true);
  for (const s of ['mobil-web', 'ai', 'game']) assert.equal(isWindowOpen(DEFAULT_WINDOWS[s], T), false);
});

test('toPublicWindow ISO döndürür', () => assert.deepEqual(
  toPublicWindow('ai', { opensAt: new Date('2026-10-01T06:00:00Z'), closesAt: null }, T),
  { slug: 'ai', opensAt: '2026-10-01T06:00:00.000Z', closesAt: null, state: 'open', isOpen: true }));
