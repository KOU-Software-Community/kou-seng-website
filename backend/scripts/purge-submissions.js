// Başvuru (submissions) kayıtlarını kalıcı olarak siler.
//
// Silinen kayıtlar başvuranların kişisel verilerini içerir (ad, soyad, öğrenci
// numarası, e-posta, telefon). Silme GERİ ALINAMAZ, bu yüzden betik silmeden
// önce her zaman diske JSON yedek yazar, yedeği geri okuyup doğrular ve
// doğrulayamazsa silmeye hiç geçmez. Yedeksiz silme yolu bilerek yoktur.
//
// Kapsam MUTLAKA açıkça verilir; varsayılan bir "hepsi" davranışı yoktur:
//   --all                  tüm başvurular (genel üyelik + tüm teknik takımlar)
//   --category <ad>        sadece o technicalCategory ("web", "ai", "game"...)
//   --type general|technical   submissionType'a göre daralt
//
// --all için ayrıca --expect <sayı> zorunludur. Koleksiyondaki gerçek sayı
// beklenenle birebir tutmazsa betik durur. Bu, yanlış veritabanına bağlanmayı
// ve "sandığımdan fazla kayıt varmış" durumunu yakalar.
//
// Kullanım (backend/ dizininden):
//   node scripts/purge-submissions.js --all --dry-run
//   node scripts/purge-submissions.js --all --expect 772 --confirm
//   node scripts/purge-submissions.js --category web --dry-run
//   node scripts/purge-submissions.js --category web --confirm
//   node scripts/purge-submissions.js --all --expect 772 --export-only
//
//   --out <yol>   yedek dosyası yolu (varsayılan backups/ altına tarihli)
//
// Not: backend ESM ("type": "module"). backups/ .gitignore'da.

import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKEND_ROOT = path.join(__dirname, "..");
dotenv.config({ path: path.join(BACKEND_ROOT, ".env") });

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => {
  const i = args.indexOf(f);
  return i !== -1 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : d;
};

const dryRun = has("--dry-run");
const exportOnly = has("--export-only");
const confirmed = has("--confirm");
const all = has("--all");
const category = val("--category", null);
const type = val("--type", null);
const expect = val("--expect", null);

const filter = {};
if (category) filter.technicalCategory = category;
if (type) filter.submissionType = type;

const scopeLabel = all
  ? "TÜM BAŞVURULAR"
  : [category && `technicalCategory="${category}"`, type && `submissionType="${type}"`].filter(Boolean).join(" + ");

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const slug = all ? "all" : [category, type].filter(Boolean).join("-");
const outPath = path.resolve(
  val("--out", path.join(BACKEND_ROOT, "backups", `submissions-${slug}-${stamp}.json`))
);

function fail(msg, code = 2) {
  console.error(msg);
  process.exit(code);
}

async function main() {
  // --- Niyet kontrolleri: hepsi veritabanına bağlanmadan ÖNCE.
  if (!all && !category && !type) {
    fail(
      "Kapsam belirtilmedi. Varsayılan olarak hiçbir şey silinmez.\n" +
      "  Tümü          : --all --expect <sayı>\n" +
      "  Tek kategori  : --category web\n" +
      "  Tek tip       : --type general"
    );
  }
  if (all && (category || type)) {
    fail("--all ile --category/--type birlikte kullanılamaz. Ya hepsi, ya daraltılmış kapsam.");
  }
  if (!dryRun && !exportOnly && !confirmed) {
    fail(
      "Silme için --confirm gerekli.\n" +
      "  Önce ne silineceğini gör : --dry-run\n" +
      "  Sadece yedek al          : --export-only\n" +
      "  Yedekle ve sil           : --confirm"
    );
  }
  if (all && !dryRun && expect === null) {
    fail("--all ile silme/yedekleme için --expect <sayı> zorunlu. Önce --all --dry-run çalıştırıp sayıyı gör.");
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) fail("MONGODB_URI tanımlı değil (backend/.env).");

  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const submissions = db.collection("submissions");

  const total = await submissions.countDocuments({});
  console.log(`Bağlandı : ${mongoose.connection.name}`);
  console.log(`Kapsam   : ${scopeLabel}`);
  console.log(`Koleksiyondaki toplam kayıt: ${total}\n`);

  const docs = await submissions.find(filter).toArray();
  console.log(`Eşleşen kayıt: ${docs.length}${all ? "  (= tüm koleksiyon)" : ` / ${total}`}`);

  if (docs.length === 0) {
    console.log("Silinecek bir şey yok.");
    await mongoose.disconnect();
    return;
  }

  // Kompozisyon — kişisel veriyi ekrana dökmeden ne silineceğini göster.
  const tally = (key, fn) => {
    const m = docs.reduce((a, d) => ((a[fn(d)] = (a[fn(d)] || 0) + 1), a), {});
    console.log(`  ${key.padEnd(12)}`, m);
  };
  tally("tip", (d) => d.submissionType || "(yok)");
  tally("kategori", (d) => d.technicalCategory || "(genel)");
  tally("durum", (d) => d.status || "(yok)");
  const dates = docs.map((d) => d.createdAt).filter(Boolean).sort();
  if (dates.length) {
    console.log(`  tarih        ${new Date(dates[0]).toISOString().slice(0, 10)} — ${new Date(dates[dates.length - 1]).toISOString().slice(0, 10)}`);
  }

  if (dryRun) {
    console.log("\nDry run — yedek de silme de yapılmadı.");
    if (all) console.log(`Silmek için: --all --expect ${docs.length} --confirm`);
    await mongoose.disconnect();
    return;
  }

  // --- Beklenen sayı kontrolü: tutmuyorsa baktığın şey sandığın şey değildir.
  if (all && Number(expect) !== docs.length) {
    console.error(`\nDURDURULDU: --expect ${expect} verildi ama koleksiyonda ${docs.length} kayıt var.`);
    console.error("Yanlış veritabanına bağlanmış olabilirsin ya da kayıt sayısı değişmiş. Hiçbir şey silinmedi.");
    await mongoose.disconnect();
    process.exit(1);
  }

  // --- Yedek: silmeden önce, her zaman.
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(docs, null, 2), "utf8");

  const readBack = JSON.parse(fs.readFileSync(outPath, "utf8"));
  if (!Array.isArray(readBack) || readBack.length !== docs.length) {
    console.error(`\nHATA: yedek doğrulanamadı (${readBack?.length} / ${docs.length}). Silme yapılmadı.`);
    await mongoose.disconnect();
    process.exit(1);
  }
  console.log(`\nYedek yazıldı ve doğrulandı: ${outPath}`);
  console.log(`  ${readBack.length} kayıt, ${(fs.statSync(outPath).size / 1024).toFixed(1)} KB`);

  if (exportOnly) {
    console.log("\n--export-only — silme yapılmadı.");
    await mongoose.disconnect();
    return;
  }

  const res = await submissions.deleteMany(filter);
  console.log(`\nSilinen kayıt: ${res.deletedCount}`);

  const left = await submissions.countDocuments(filter);
  if (left) {
    console.error(`HATA: ${left} kayıt hâlâ duruyor.`);
    await mongoose.disconnect();
    process.exit(1);
  }
  console.log("Tamam. Kapsamdaki kayıtlar silindi.");
  console.log(`Geri yüklemek gerekirse yedek burada: ${outPath}`);

  await mongoose.disconnect();
}

main().catch(async (e) => {
  console.error("Hata:", e.message);
  try { await mongoose.disconnect(); } catch { /* zaten kapalı */ }
  process.exit(1);
});
