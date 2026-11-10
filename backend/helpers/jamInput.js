// Game jam başvurusu girdisi (POST /gamejam). Veritabanına dokunmaz; testi
// yanında (jamInput.test.js). Seçenek anahtarları frontend'de
// components/pages/gamejam.tsx'teki listelerle aynı olmalı.
import { isSingleEmail } from './mailInput.js';

export const DISCIPLINES = {
  developer: 'Oyun Programlama (Developer)',
  artist: '2D / 3D Sanat ve Tasarım (Artist)',
  designer: 'Oyun Tasarımı (Game Designer)',
  sound: 'Ses ve Müzik Tasarımı (Sound Designer)',
  narrative: 'Hikaye / Metin Yazarlığı (Narrative Designer)',
  other: 'Diğer',
};
// Senaryo soruları yalnızca lidere; cevap A–D harfi olarak saklanır.
export const QUESTIONS = {
  teamwork: 'Takım çalışması',
  scope: 'Kapsam yönetimi',
  conflict: 'Fikir ayrılığı',
  motivation: 'Motivasyon',
  feedback: 'Geri bildirim',
};
export const MIN_MEMBERS = 1; // lider hariç: ekip 2–4 kişi
export const MAX_MEMBERS = 3;

const ANSWERS = ['A', 'B', 'C', 'D'];
const URL_RE = /^https?:\/\/[^\s]+$/i;
const PHONE_RE = /^\+?[\d\s()-]{10,20}$/;
// Tekrar kontrolü biçimden bağımsız olsun: yalnızca rakam ve baştaki + saklanır
const normalizePhone = (v) => v.trim().replace(/(?!^\+)\D/g, '');
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const text = (v, max = 100) => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
const url = (v) => typeof v === 'string' && v.length <= 500 && URL_RE.test(v);
// Takvimde gerçekten olan bir gün ve 10–100 yaş arası
const birthDate = (v, now) => {
  if (typeof v !== 'string' || !DATE_RE.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== v) return false;
  const age = (now - d) / (365.25 * 24 * 3600e3);
  return age >= 10 && age <= 100;
};

const parsePerson = (p, isLeader, now) => {
  if (!p || typeof p !== 'object' || Array.isArray(p)) return null;
  const { name, email, phone, university, department, cvUrl, projectUrl, disciplines, otherDiscipline, mediaConsent } = p;
  if (!text(name) || !text(university) || !text(department) || !birthDate(p.birthDate, now) || !url(cvUrl)) return null;
  if (projectUrl !== undefined && projectUrl !== '' && !url(projectUrl)) return null;
  if (!Array.isArray(disciplines) || disciplines.length === 0 ||
      !disciplines.every((d) => typeof d === 'string' && Object.hasOwn(DISCIPLINES, d)) || new Set(disciplines).size !== disciplines.length) return null;
  if (otherDiscipline !== undefined && otherDiscipline !== '' && !text(otherDiscipline)) return null;
  // Açık rıza kişinin kendisinden alınır: lider yalnızca kendi adına işaretler,
  // üyelerin izni etkinlikte kendilerinden sorulur (KVKK m.5/1).
  if (isLeader && typeof mediaConsent !== 'boolean') return null;
  const person = {
    name: name.trim(),
    birthDate: p.birthDate,
    university: university.trim(),
    department: department.trim(),
    cvUrl,
    projectUrl: projectUrl || '',
    disciplines,
    otherDiscipline: disciplines.includes('other') ? (otherDiscipline ?? '').trim() : '',
    mediaConsent: isLeader && mediaConsent,
  };
  if (isLeader) {
    if (!isSingleEmail(email) || typeof phone !== 'string' || !PHONE_RE.test(phone)) return null;
    const digits = normalizePhone(phone);
    if (digits.replace('+', '').length < 10) return null;
    Object.assign(person, { email: email.toLowerCase(), phone: digits });
  }
  return person;
};

/**
 * Gövdeyi doğrular; geçerliyse saklanacak nesneyi, değilse null döndürür.
 * Bilinmeyen alanlar atılır (yalnızca aşağıda okunanlar saklanır).
 */
export function parseJamApplication(body, now = new Date()) {
  const { teamName, leader, members, answers, rulesConsent, kvkkConsent } = body ?? {};
  if (!text(teamName, 60) || rulesConsent !== true || kvkkConsent !== true) return null;
  if (!Array.isArray(members) || members.length < MIN_MEMBERS || members.length > MAX_MEMBERS) return null;
  if (!answers || typeof answers !== 'object' || !Object.keys(QUESTIONS).every((q) => ANSWERS.includes(answers[q]))) return null;

  const parsedLeader = parsePerson(leader, true, now);
  const parsedMembers = members.map((m) => parsePerson(m, false, now));
  if (!parsedLeader || parsedMembers.includes(null)) return null;

  return {
    teamName: teamName.trim(),
    leader: parsedLeader,
    members: parsedMembers,
    answers: Object.fromEntries(Object.keys(QUESTIONS).map((q) => [q, answers[q]])),
  };
}
