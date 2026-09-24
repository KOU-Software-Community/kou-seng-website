// Duyuru HTML'i için izin listesi: yalnızca editörün ürettiği biçimlendirme
// etiketleri kalır, hiçbir öznitelik taşınmaz; diğer her şey düz metne döner.
// Aynı liste backend/controllers/announcementsController.js'de; biri değişirse
// diğeri de değişmeli.
//
// Ayrıştırma DOMParser ile yapılır: canlı dokümanda innerHTML'e yazmanın
// aksine bu doküman pasiftir, ayrıştırma sırasında olay işleyicisi çalışmaz
// ve kaynak yüklenmez. Yalnızca tarayıcıda çağrılır.
const ALLOWED_TAGS = ['p', 'br', 'ul', 'ol', 'li', 'strong', 'b'];

const cleanNode = (node: Node): Node | null => {
  if (node.nodeType === Node.TEXT_NODE) {
    return document.createTextNode(node.textContent || '');
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const tagName = (node as Element).tagName.toLowerCase();
  if (!ALLOWED_TAGS.includes(tagName)) {
    return document.createTextNode(node.textContent || '');
  }

  const cleanElement = document.createElement(tagName);
  node.childNodes.forEach(child => {
    const cleanChild = cleanNode(child);
    if (cleanChild) cleanElement.appendChild(cleanChild);
  });
  return cleanElement;
};

export const sanitizeHTML = (html?: string): string => {
  if (!html) return '';

  const parsed = new DOMParser().parseFromString(html, 'text/html').body;
  const cleanDiv = document.createElement('div');
  parsed.childNodes.forEach(child => {
    const cleanChild = cleanNode(child);
    if (cleanChild) cleanDiv.appendChild(cleanChild);
  });
  return cleanDiv.innerHTML;
};
