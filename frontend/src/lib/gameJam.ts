// Game jam formunun seçenekleri. Anahtarlar backend/helpers/jamInput.js'teki
// DISCIPLINES ve QUESTIONS ile aynı olmalı; değişirse ikisi birlikte değişir.

export const DISCIPLINES = [
  { id: 'developer', label: 'Oyun Programlama (Developer)' },
  { id: 'artist', label: '2D / 3D Sanat ve Tasarım (Artist)' },
  { id: 'designer', label: 'Oyun Tasarımı (Game Designer)' },
  { id: 'sound', label: 'Ses ve Müzik Tasarımı (Sound Designer)' },
  { id: 'narrative', label: 'Hikaye / Metin Yazarlığı (Narrative Designer)' },
  { id: 'other', label: 'Diğer' },
] as const;

export const ANSWER_KEYS = ['A', 'B', 'C', 'D'] as const;
export type AnswerKey = (typeof ANSWER_KEYS)[number];

export const QUESTIONS = [
  {
    id: 'teamwork',
    title: 'Takım Çalışması ve İletişim',
    text: 'Jam sırasında takımdan biri aniden iletişim kurmayı bıraktı ve görevini teslim etmedi. İlk tepkin ne olur?',
    options: [
      'Kendi işimi bırakıp onun eksik kalan görevini tamamlamaya çalışırım.',
      'Takım kanalında durumu belirtip görev dağılımını hemen yeniden organize ederiz.',
      'Organizasyon ekibine/mentörlere ulaşıp durumu bildiririm.',
      'Kalan sürede projeyi onun eksik parçası olmadan da çalışacak şekilde kapsamını (scope) küçültürüm.',
    ],
  },
  {
    id: 'scope',
    title: 'Kapsam ve Zaman Yönetimi',
    text: 'Etkinliğin bitmesine 6 saat kaldı ama oyunun ana mekaniği henüz tam olarak çalışmıyor. Ne yaparsın?',
    options: [
      'Son saniyeye kadar düzeltmek için kod yazmaya/tasarlamaya devam ederim.',
      'Mekaniği basitleştirip, çalışan ve daha küçük bir sürüme (MVP) dönüştürürüm.',
      'Hatayı olduğu gibi bırakıp görsellik ve ses kalitesiyle durumu kurtarmaya odaklanırım.',
      'Pes etmeden sabahlarım, yetişmezse de olduğu haliyle yüklerim.',
    ],
  },
  {
    id: 'conflict',
    title: 'Fikir Ayrılığı ve Kriz Yönetimi',
    text: 'Tema açıklandıktan sonra takımla beyin fırtınası yapıyorsunuz ve sizin fikrinizle arkadaşınızın fikri tamamen çakışıyor. Nasıl ilerlersiniz?',
    options: [
      'Kendi fikrimin neden daha iyi olduğunu ikna edene kadar savunurum.',
      'İki fikri de birleştirip tek bir oyun yapmaya çalışırım.',
      'Oylama yaparız, çoğunluk ne derse veya Game Designer hangisini seçerse onu hızlıca kabul ederim.',
      'İki fikrin de 1 saatlik hızlı prototipini yapıp hangisinin daha eğlenceli olduğuna bakarız.',
    ],
  },
  {
    id: 'motivation',
    title: 'Motivasyon ve Jam Amacı',
    text: 'Bu Game Jam’den temel beklentin ve birincil hedefin nedir?',
    options: [
      'Birinci olmak ve ödülü kazanmak.',
      'Portfolyoma tamamlanmış bir oyun eklemek ve yeni teknikler öğrenmek.',
      'Yeni insanlarla tanışmak, takımla keyifli zaman geçirmek ve network yapmak.',
      'Kendi sınırlarımı zorlamak ve fikirlerimi test etmek.',
    ],
  },
  {
    id: 'feedback',
    title: 'Geri Bildirim ve Değerlendirme',
    text: 'Projeniz bitti, bir jüri/mentör oyununuzu inceledi ve mekaniklerin hiç eğlenceli olmadığını söyledi. Ne hissedersin/yaparsın?',
    options: [
      'Süre kısıtlı olduğu için anlayışla karşılar, nereleri geliştirebileceğimi sorarım.',
      'Jam oyunlarının mükemmel olamayacağını savunup fikrimi açıklarım.',
      'Moralim bozulur ama notlarımı alıp bir sonraki projede dikkat ederim.',
      'Oyunun detaylarının yeterince anlaşılmadığını düşünüp tekrar anlatmaya çalışırım.',
    ],
  },
] as const;

export type QuestionId = (typeof QUESTIONS)[number]['id'];

export const MAX_MEMBERS = 3; // lider hariç: ekip 2–4 kişi

export type JamPerson = {
  name: string;
  birthDate: string; // YYYY-MM-DD
  university: string;
  department: string;
  cvUrl: string;
  projectUrl: string;
  disciplines: string[];
  otherDiscipline: string;
  mediaConsent: boolean; // yalnızca lider için anlamlı, üyelerde hep false
};

export type JamLeader = JamPerson & { email: string; phone: string };

export type JamApplicationBody = {
  teamName: string;
  leader: JamLeader;
  members: JamPerson[];
  answers: Record<QuestionId, AnswerKey>;
  rulesConsent: true;
  kvkkConsent: true;
};

export type JamApplication = Omit<JamApplicationBody, 'rulesConsent' | 'kvkkConsent'> & {
  _id: string;
  createdAt: string;
};

// Etkinlik gününe göre değil, bugüne göre yaş
export const ageOf = (birthDate: string): number => {
  const b = new Date(`${birthDate}T00:00:00`);
  const now = new Date();
  return now.getFullYear() - b.getFullYear() - (now < new Date(now.getFullYear(), b.getMonth(), b.getDate()) ? 1 : 0);
};

export const disciplineLabel = (id: string): string => DISCIPLINES.find((d) => d.id === id)?.label ?? id;
