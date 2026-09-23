// check:content — public/data/*.json içindeki kişi kayıtlarını ve gerçek görsel
// dosyalarını doğrular. Bu kontroller hiçbir type check'ten ve build'den geçmez:
// JSON veri, Next build'i public/ yollarını doğrulamaz, ve bir dosyanin uzantisi
// icerigi hakkinda hicbir sey soylemez.
//
// Yakaladigi gercek hatalar:
//   - JSON'daki gorsel yolu diskte yok  -> sayfada 404, build sessiz gecer
//   - .jpeg uzantili ama icerigi HEIC    -> tarayici render edemez, build sessiz gecer
//   - leaderMessage.author uyelerde yok  -> ayrilmis bir liderin adi sayfada kalir
//   - skills alani eksik                 -> teamDetail.tsx `member.skills.length` ile patlar
//
// ÖNEMLİ: bu betik hiçbir zaman sessizce atlamaz. Ölçemedigi her sey FAIL'dir.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
const DATA = join(PUBLIC, 'data');

const failures = [];
const ok = (t, d) => console.log(`  ok    ${t.padEnd(16)} ${d}`);
const bad = (t, d) => { console.log(`  FAIL  ${t.padEnd(16)} ${d}`); failures.push(`${t}: ${d}`); };

/** Dosyanin gercek formatini magic byte'lardan okur. Uzantiya guvenmez. */
function sniff(buf) {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg';
  if (buf.length >= 8 && buf.toString('latin1', 0, 8) === '\x89PNG\r\n\x1a\n') return 'png';
  if (buf.length >= 12 && buf.toString('latin1', 4, 8) === 'ftyp') {
    const brand = buf.toString('latin1', 8, 12);
    if (/^(heic|heix|hevc|mif1|msf1|avif)$/.test(brand)) return `heif(${brand})`;
    return `iso(${brand})`;
  }
  if (buf.length >= 6 && /^GIF8[79]a$/.test(buf.toString('latin1', 0, 6))) return 'gif';
  if (buf.length >= 12 && buf.toString('latin1', 0, 4) === 'RIFF' && buf.toString('latin1', 8, 12) === 'WEBP') return 'webp';
  if (buf.toString('latin1', 0, 200).includes('<svg')) return 'svg';
  return null;
}

/** JPEG/PNG boyutlarini header'dan okur. Okuyamazsa null doner (= FAIL). */
function dimensions(buf, kind) {
  if (kind === 'png') {
    if (buf.length < 24) return null;
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  if (kind === 'jpeg') {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
      const len = buf.readUInt16BE(i + 2);
      // SOF0..SOF15, DHT/DAC/SOS haric
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
    return null;
  }
  return null;
}

function checkImage(label, webPath) {
  // Bilesenler (about.tsx, teamDetail.tsx) yolunda "placeholder" gecen kaydi
  // hic yuklemez, ikon fallback render eder. Dosya aranmaz — kasitli.
  if (webPath.includes('placeholder')) { ok(label, `${webPath} (placeholder -> ikon fallback)`); return; }
  if (!webPath.startsWith('/')) { bad(label, `gorsel yolu "/" ile baslamali: ${webPath}`); return; }

  const fp = join(PUBLIC, webPath.slice(1));
  if (!existsSync(fp)) { bad(label, `gorsel diskte yok: ${webPath}`); return; }

  let buf;
  try { buf = readFileSync(fp); } catch (e) { bad(label, `okunamadi ${webPath}: ${e.message}`); return; }

  const kind = sniff(buf);
  if (kind === null) { bad(label, `format taninmadi (olculemedi): ${webPath}`); return; }
  if (!['jpeg', 'png', 'webp', 'gif', 'svg'].includes(kind)) {
    bad(label, `tarayici render edemez: ${webPath} gercek format=${kind}`);
    return;
  }

  if (kind === 'jpeg' || kind === 'png') {
    const dim = dimensions(buf, kind);
    if (!dim) { bad(label, `boyut okunamadi (olculemedi): ${webPath}`); return; }
    const ratio = dim.w / dim.h;
    if (Math.abs(ratio - 1) > 0.02) {
      bad(label, `kare degil: ${webPath} ${dim.w}x${dim.h} — kartlar AspectRatio 1/1 + object-cover, kirpilir`);
      return;
    }
    const kb = Math.round(buf.length / 1024);
    if (kb > 300) { bad(label, `cok buyuk: ${webPath} ${kb}KB (avatar icin <300KB)`); return; }
    ok(label, `${webPath} ${kind} ${dim.w}x${dim.h} ${kb}KB`);
  } else {
    ok(label, `${webPath} ${kind}`);
  }
}

function checkPerson(label, m, { requireSkills }) {
  for (const k of ['name', 'role', 'image', 'department', 'github', 'linkedin']) {
    if (!(k in m)) { bad(label, `"${k}" alani eksik`); return; }
    if (typeof m[k] !== 'string') { bad(label, `"${k}" string olmali`); return; }
  }
  if (!m.name.trim()) { bad(label, 'name bos'); return; }
  if (!m.role.trim()) { bad(label, 'role bos'); return; }
  // teamDetail.tsx `member.skills.length` diyor — optional chaining yok.
  // skills eksikse sayfa runtime'da patlar, build gecer.
  if (requireSkills && !Array.isArray(m.skills)) {
    bad(label, 'skills dizi degil — teamDetail.tsx member.skills.length ile patlar');
    return;
  }
  for (const k of ['github', 'linkedin', 'kaggle']) {
    const v = m[k];
    if (v && !/^https?:\/\//.test(v)) { bad(label, `${k} mutlak URL degil: ${v}`); return; }
  }
  checkImage(label, m.image);
}

console.log('about/data.json — yonetim kurulu');
{
  const p = join(DATA, 'about', 'data.json');
  if (!existsSync(p)) bad('about', `dosya yok: ${p}`);
  else {
    const d = JSON.parse(readFileSync(p, 'utf8'));
    if (!Array.isArray(d.boardMembers) || d.boardMembers.length === 0) bad('about', 'boardMembers bos veya dizi degil');
    else {
      // about.tsx satirlari 2 + 2 + kalan olarak boluyor; 7 kisi 2/2/3 verir.
      if (d.boardMembers.length < 4) bad('about', `boardMembers ${d.boardMembers.length} kisi — about.tsx 2+2+kalan bolüyor, satirlar bozulur`);
      for (const m of d.boardMembers) checkPerson(m.name || '(isimsiz)', m, { requireSkills: false });
    }
  }
}

console.log('\nteams/*.json — takimlar');
{
  const dir = join(DATA, 'teams');
  if (!existsSync(dir)) bad('teams', `klasor yok: ${dir}`);
  else {
    const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
    if (files.length === 0) bad('teams', 'hic takim dosyasi yok');
    for (const f of files) {
      const d = JSON.parse(readFileSync(join(dir, f), 'utf8'));
      const slug = d.slug ?? f;
      if (!Array.isArray(d.members)) { bad(slug, 'members dizi degil'); continue; }
      const names = d.members.map((m) => m.name);
      const author = d?.leaderMessage?.author;
      if (!author) bad(slug, 'leaderMessage.author yok');
      else if (!names.includes(author)) {
        // Lider ismi members[] disinda ikinci bir yerde daha duruyor; biri
        // guncellenip digeri unutulursa ayrilmis kisinin adi sayfada kalir.
        bad(slug, `leaderMessage.author "${author}" members[] icinde yok (${names.join(', ') || 'bos'})`);
      } else ok(slug, `leaderMessage.author = ${author}`);
      for (const m of d.members) checkPerson(`${slug}/${m.name || '(isimsiz)'}`, m, { requireSkills: true });
    }
  }
}

console.log('\nsahipsiz gorseller (bilgi — hata degil)');
{
  const referenced = new Set();
  const collect = (p, key) => {
    if (!existsSync(p)) return;
    const d = JSON.parse(readFileSync(p, 'utf8'));
    for (const m of d[key] ?? []) if (m.image) referenced.add(m.image);
  };
  collect(join(DATA, 'about', 'data.json'), 'boardMembers');
  const tdir = join(DATA, 'teams');
  if (existsSync(tdir)) for (const f of readdirSync(tdir)) collect(join(tdir, f), 'members');

  const walk = (d) => existsSync(d) ? readdirSync(d).flatMap((e) => {
    const p = join(d, e);
    return statSync(p).isDirectory() ? walk(p) : [p];
  }) : [];
  const orphans = walk(join(PUBLIC, 'profile'))
    .map((p) => '/' + p.slice(PUBLIC.length + 1).split('/').join('/'))
    .filter((w) => !referenced.has(w));
  if (orphans.length === 0) console.log('  yok');
  else for (const o of orphans) console.log(`  --    ${o}`);
}

if (failures.length) {
  console.error(`\n${failures.length} hata:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('\nHepsi gecti.');
