import test from 'node:test';
import assert from 'node:assert/strict';
import { issuedBeforePasswordChange } from './authMiddleware.js';

const changed = new Date('2026-10-01T12:00:00.700Z');
const sec = Math.floor(changed.getTime() / 1000);

test('passwordChangedAt yoksa token geçerli', () => {
  assert.equal(issuedBeforePasswordChange(0, undefined), false);
  assert.equal(issuedBeforePasswordChange(0, null), false);
});
test('değişiklikten önceki saniyede verilen token reddedilir', () =>
  assert.equal(issuedBeforePasswordChange(sec - 1, changed), true));
test('aynı saniyede verilen yeni token geçer', () =>
  assert.equal(issuedBeforePasswordChange(sec, changed), false));
test('sonra verilen token geçer', () =>
  assert.equal(issuedBeforePasswordChange(sec + 5, changed), false));
