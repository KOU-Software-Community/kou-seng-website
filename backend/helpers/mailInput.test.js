import test from 'node:test';
import assert from 'node:assert/strict';
import { isSingleEmail, parseBlocks, MAX_BLOCKS, MAX_BLOCKS_JSON_LENGTH } from './mailInput.js';

test('tek adres kabul edilir', () => assert.equal(isSingleEmail('ali.veli+x@sirket.com.tr'), true));

test('virgül/noktalı virgül listesi ve başlıklı adres reddedilir', () => {
  for (const v of ['a@x.com,b@y.com', 'a@x.com;b@y.com', 'A <a@x.com>', 'a @x.com', '"a"@x.com', ['a@x.com']]) {
    assert.equal(isSingleEmail(v), false, String(v));
  }
});

test('geçerli bloklar yalnızca bilinen alanlarla döner', () => {
  const r = parseBlocks(JSON.stringify([{ type: 'paragraph', text: 'Merhaba', junk: 'x'.repeat(10) }]));
  assert.deepEqual(r, { blocks: [{ type: 'paragraph', text: 'Merhaba' }] });
});

test('bilinmeyen blok tipi ya da yanlış alan tipi reddedilir', () => {
  for (const b of [{ type: 'image', src: 'data:...' }, { type: 'paragraph', text: 1 }, { type: 'toString' }, null, 'x']) {
    assert.ok(parseBlocks(JSON.stringify([b])).error, JSON.stringify(b));
  }
});

test('büyük, boş ya da dizi olarak gelen blok verisi reddedilir', () => {
  const p = { type: 'paragraph', text: 'a' };
  assert.ok(parseBlocks(JSON.stringify([{ type: 'paragraph', text: 'a'.repeat(MAX_BLOCKS_JSON_LENGTH) }])).error);
  assert.ok(parseBlocks(JSON.stringify(Array(MAX_BLOCKS + 1).fill(p))).error);
  assert.ok(parseBlocks('[]').error);
  assert.ok(parseBlocks(['[', ']']).error);
  assert.ok(parseBlocks(undefined).error);
});

test('limitUploadBody: büyük Content-Length 413, chunked gövde sınırı aşınca kesilir', async () => {
    const { PassThrough } = await import('node:stream');
    const { limitUploadBody, MAX_REQUEST_BYTES } = await import('./mailInput.js');
    let status;
    const res = { status: (s) => { status = s; return { json: () => {} }; } };

    const big = Object.assign(new PassThrough(), { headers: { 'content-length': String(MAX_REQUEST_BYTES + 1) } });
    limitUploadBody(big, res, () => assert.fail('next çağrılmamalı'));
    assert.equal(status, 413);

    const chunked = Object.assign(new PassThrough(), { headers: {} });
    let nexted = false;
    limitUploadBody(chunked, res, () => { nexted = true; });
    assert.ok(nexted);
    chunked.write(Buffer.alloc(MAX_REQUEST_BYTES));
    await new Promise((r) => setImmediate(r));
    assert.equal(chunked.destroyed, false);
    chunked.write(Buffer.alloc(1));
    await new Promise((r) => setImmediate(r));
    assert.equal(chunked.destroyed, true);
});
