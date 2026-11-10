import test from 'node:test';
import assert from 'node:assert/strict';
import { parseJamApplication } from './jamInput.js';

const NOW = new Date('2026-11-10T12:00:00Z');
const person = (extra = {}) => ({
  name: 'Ada Yılmaz', birthDate: '2004-05-17', university: 'Kocaeli Üniversitesi', department: 'Bilgisayar Müh.',
  cvUrl: 'https://drive.google.com/cv', projectUrl: '', disciplines: ['developer'], otherDiscipline: '', mediaConsent: false,
  ...extra,
});
const valid = (extra = {}) => ({
  teamName: 'Piksel Ekibi',
  leader: person({ email: 'Ada@Example.com', phone: '+90 555 123 45 67', mediaConsent: true }),
  members: [person({ name: 'Can Demir' })],
  answers: { teamwork: 'B', scope: 'B', conflict: 'D', motivation: 'B', feedback: 'A' },
  rulesConsent: true,
  kvkkConsent: true,
  ...extra,
});

test('geçerli başvuru: e-posta küçük harfe iner, bilinmeyen alan atılır', () => {
  const out = parseJamApplication({ ...valid(), status: 'accepted' }, NOW);
  assert.equal(out.leader.email, 'ada@example.com');
  assert.equal(out.members[0].email, undefined);
  assert.equal(out.status, undefined);
  assert.equal(out.members.length, 1);
  assert.equal(out.leader.phone, '+905551234567');
});

test('fotoğraf izni yalnızca liderin kendi beyanı; üyelerinki saklanmaz', () => {
  const out = parseJamApplication(valid({ members: [person({ mediaConsent: true })] }), NOW);
  assert.equal(out.leader.mediaConsent, true);
  assert.equal(out.members[0].mediaConsent, false);
  assert.ok(parseJamApplication(valid({ members: [person({ mediaConsent: undefined })] }), NOW));
});

test('ekip 2–4 kişi: 0 ya da 4 üye reddedilir', () => {
  assert.equal(parseJamApplication(valid({ members: [] }), NOW), null);
  assert.equal(parseJamApplication(valid({ members: [person(), person(), person(), person()] }), NOW), null);
  assert.ok(parseJamApplication(valid({ members: [person(), person(), person()] }), NOW));
});

test('onaylar true olmalı', () => {
  assert.equal(parseJamApplication(valid({ rulesConsent: false }), NOW), null);
  assert.equal(parseJamApplication(valid({ kvkkConsent: 'true' }), NOW), null);
});

test('cevaplar A–D ve hepsi dolu', () => {
  assert.equal(parseJamApplication(valid({ answers: { teamwork: 'E', scope: 'B', conflict: 'D', motivation: 'B', feedback: 'A' } }), NOW), null);
  assert.equal(parseJamApplication(valid({ answers: { teamwork: 'A' } }), NOW), null);
});

test('disiplin: en az bir, bilinen anahtar, tekrarsız', () => {
  assert.equal(parseJamApplication(valid({ members: [person({ disciplines: [] })] }), NOW), null);
  assert.equal(parseJamApplication(valid({ members: [person({ disciplines: ['hacker'] })] }), NOW), null);
  assert.equal(parseJamApplication(valid({ members: [person({ disciplines: ['sound', 'sound'] })] }), NOW), null);
  // ['developer'] dizisi Object.hasOwn'da 'developer'a dönüşüyordu, Mongoose 500 veriyordu
  assert.equal(parseJamApplication(valid({ members: [person({ disciplines: [['developer']] })] }), NOW), null);
  // "Diğer" seçilmediyse açıklaması saklanmaz
  assert.equal(parseJamApplication(valid({ members: [person({ otherDiscipline: 'VFX' })] }), NOW).members[0].otherDiscipline, '');
  assert.equal(parseJamApplication(valid({ members: [person({ disciplines: ['other'], otherDiscipline: 'VFX' })] }), NOW).members[0].otherDiscipline, 'VFX');
});

test('doğum tarihi: gerçek gün ve makul yaş', () => {
  assert.equal(parseJamApplication(valid({ members: [person({ birthDate: '2004-02-30' })] }), NOW), null);
  assert.equal(parseJamApplication(valid({ members: [person({ birthDate: '2020-01-01' })] }), NOW), null);
  assert.equal(parseJamApplication(valid({ members: [person({ birthDate: '17.05.2004' })] }), NOW), null);
});

test('bağlantılar http(s), lider telefonu ve e-postası zorunlu', () => {
  assert.equal(parseJamApplication(valid({ members: [person({ cvUrl: 'javascript:alert(1)' })] }), NOW), null);
  assert.equal(parseJamApplication(valid({ members: [person({ projectUrl: 'itch.io/oyun' })] }), NOW), null);
  assert.equal(parseJamApplication(valid({ leader: person({ email: 'ada@example.com' }) }), NOW), null);
  assert.equal(parseJamApplication(valid({ leader: person({ email: 'a@b.co, c@d.co', phone: '05551234567' }) }), NOW), null);
  assert.equal(parseJamApplication(valid({ leader: person({ email: 'a@b.co', phone: '----------' }) }), NOW), null);
  assert.equal(parseJamApplication(valid({ leader: person({ email: 'a@b.co', phone: '0555 123 45 67' }) }), NOW).leader.phone, '05551234567');
});

test('nesne olmayan gövde ve alanlar', () => {
  assert.equal(parseJamApplication(undefined, NOW), null);
  assert.equal(parseJamApplication(valid({ teamName: { $ne: '' } }), NOW), null);
  assert.equal(parseJamApplication(valid({ members: ['x'] }), NOW), null);
});
