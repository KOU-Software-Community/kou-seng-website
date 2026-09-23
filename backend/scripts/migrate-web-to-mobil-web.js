// Web takımının slug'ı "web" -> "mobil-web" olarak değişti. Bu değer üç yerde
// birden kimlik taşıyor: URL slug'ı, User.role ve Submission.technicalCategory.
// Kod tarafı güncellendi; veritabanındaki mevcut kayıtlar bu betikle taşınır.
//
// ÖNEMLİ: Kod deploy edildikten sonra role'ü hâlâ "web" olan yönetici
// hesapları teknik takım sayfasına erişemez (roleOnlyForCategory rolü
// kategoriyle birebir karşılaştırıyor) ve User.save() enum doğrulamasından
// geçemez. Bu betik deploy ile aynı bakım penceresinde çalıştırılmalı.
//
// Kullanım (backend/ dizininden):
//   node scripts/migrate-web-to-mobil-web.js --dry-run   # sadece raporlar
//   node scripts/migrate-web-to-mobil-web.js             # uygular
//   node scripts/migrate-web-to-mobil-web.js --rollback  # ters yön
//
// Not: backend ESM ("type": "module"). Mongoose driver'ına doğrudan gidiyoruz,
// böylece model şemasındaki enum doğrulaması eski değerleri okumayı engellemiyor.

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

// .env backend kökünde; betik scripts/ altından çalıştırıldığında da bulunsun.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const OLD = "web";
const NEW = "mobil-web";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const rollback = args.includes("--rollback");
const from = rollback ? NEW : OLD;
const to = rollback ? OLD : NEW;

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI tanımlı değil (backend/.env).");
    process.exit(2);
  }

  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  console.log(`Bağlandı: ${mongoose.connection.name}`);
  console.log(`Yön: "${from}" -> "${to}"${dryRun ? "  [DRY RUN — yazma yok]" : ""}\n`);

  const users = db.collection("users");
  const submissions = db.collection("submissions");

  const userCount = await users.countDocuments({ role: from });
  const subCount = await submissions.countDocuments({ technicalCategory: from });

  console.log(`users.role = "${from}"                  : ${userCount} kayıt`);
  console.log(`submissions.technicalCategory = "${from}" : ${subCount} kayıt`);

  if (userCount > 0) {
    const list = await users.find({ role: from }, { projection: { name: 1, email: 1 } }).toArray();
    console.log("\nEtkilenen yönetici hesapları:");
    for (const u of list) console.log(`  - ${u.name} <${u.email}>`);
  }

  if (dryRun) {
    console.log("\nDry run — hiçbir şey yazılmadı.");
    await mongoose.disconnect();
    // Taşınacak kayıt varsa 1 döner: "migration gerekli" sinyali.
    process.exit(userCount + subCount > 0 ? 1 : 0);
  }

  const r1 = await users.updateMany({ role: from }, { $set: { role: to } });
  const r2 = await submissions.updateMany({ technicalCategory: from }, { $set: { technicalCategory: to } });

  console.log(`\nusers güncellendi      : ${r1.modifiedCount}`);
  console.log(`submissions güncellendi: ${r2.modifiedCount}`);

  // Doğrulama: eski değerden hiç kalmamalı.
  const leftUsers = await users.countDocuments({ role: from });
  const leftSubs = await submissions.countDocuments({ technicalCategory: from });
  if (leftUsers || leftSubs) {
    console.error(`\nHATA: "${from}" değeri hâlâ duruyor (users=${leftUsers}, submissions=${leftSubs}).`);
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`\nTamam. "${from}" değerinden kayıt kalmadı.`);
  await mongoose.disconnect();
}

main().catch(async (e) => {
  console.error("Migration hatası:", e.message);
  try { await mongoose.disconnect(); } catch { /* zaten kapalı */ }
  process.exit(1);
});
