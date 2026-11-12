import test from 'node:test';
import assert from 'node:assert/strict';
import { issuedBeforePasswordChange, readToken, isCrossSiteWrite } from './authMiddleware.js';

const changed = new Date('2026-10-01T12:00:00.700Z');
const sec = Math.floor(changed.getTime() / 1000);

test('passwordChangedAt yoksa token geçerli', () => {
  assert.equal(issuedBeforePasswordChange(0, undefined), false);
  assert.equal(issuedBeforePasswordChange(0, null), false);
});
test('değişiklikten önceki saniyede verilen token reddedilir', () =>
  assert.equal(issuedBeforePasswordChange(sec - 1, changed), true));
test('değişiklikle aynı saniyede verilen token reddedilir', () =>
  assert.equal(issuedBeforePasswordChange(sec, changed), true));
test('sonra verilen token geçer', () =>
  assert.equal(issuedBeforePasswordChange(sec + 5, changed), false));

test('Bearer başlığı çerezden önce gelir', () => {
  assert.deepEqual(readToken({ headers: { authorization: 'Bearer abc', cookie: '__Host-kouseng_session=xyz' } }), { token: 'abc', fromCookie: false });
});
test('oturum çerezi okunur, benzer adlı çerez karışmaz', () => {
  assert.deepEqual(readToken({ headers: { cookie: 'kouseng_session=bad; x__Host-kouseng_session=bad; __Host-kouseng_session=xyz; theme=dark' } }), { token: 'xyz', fromCookie: true });
  assert.equal(readToken({ headers: { cookie: 'theme=dark' } }), null);
  assert.equal(readToken({ headers: {} }), null);
});
test('çerezli yazma isteği yalnızca izinli Origin ile geçer (CSRF)', () => {
  process.env.CORS_ALLOWED_ORIGINS = 'https://kouseng.com, http://localhost:3000';
  assert.equal(isCrossSiteWrite({ method: 'GET', headers: {} }), false);
  assert.equal(isCrossSiteWrite({ method: 'PATCH', headers: { origin: 'https://kouseng.com' } }), false);
  assert.equal(isCrossSiteWrite({ method: 'POST', headers: { origin: 'http://localhost:3000' } }), false);
  assert.equal(isCrossSiteWrite({ method: 'POST', headers: { origin: 'https://evil.example' } }), true);
  assert.equal(isCrossSiteWrite({ method: 'DELETE', headers: {} }), true);
});
