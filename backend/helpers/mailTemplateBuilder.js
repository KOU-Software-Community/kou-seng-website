/**
 * Mail şablon oluşturucu
 * Content bloklarını HTML'e çevirir ve sponsorluk mail şablonuna inject eder.
 *
 * Desteklenen blok tipleri:
 *   { type: 'paragraph', text: string }
 *   { type: 'heading',   text: string }
 *   { type: 'list',      items: Array<{ title: string, description: string }> }
 *   { type: 'signature', name: string, title: string, email: string }
 *
 * Paragraf ve liste açıklamalarında inline biçimlendirme desteklenir:
 *   **metin**   → <strong>metin</strong>   (kalın)
 *   [[metin]]   → <span class="highlight"> (vurgu)
 */

const escapeHtml = (str) => {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

/**
 * HTML escape eder, ardından **bold** ve [[highlight]] işaretleyicilerini HTML tag'lerine çevirir.
 * Sıralama önemlidir: önce escape, sonra replace (eklenen tag'ler escape edilmez).
 */
const parseInline = (str) => {
    if (typeof str !== 'string') return '';
    let result = escapeHtml(str);
    // **metin** → <strong>metin</strong>
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // [[metin]] → vurgulu span
    result = result.replace(
        /\[\[(.+?)\]\]/g,
        '<span style="color:#142850;font-weight:600;background-color:#eef4ff;padding:2px 6px;border-radius:4px;">$1</span>'
    );
    // Satır sonlarını <br> etiketine çevir
    result = result.replace(/\n/g, '<br>');
    return result;
};

const blockToHtml = (block) => {
    switch (block.type) {
        case 'paragraph':
            return `<p>${parseInline(block.text)}</p>`;

        case 'heading':
            return `<h3 style="color: #142850; margin-top: 30px;">${escapeHtml(block.text)}</h3>`;

        case 'list': {
            if (!Array.isArray(block.items) || block.items.length === 0) return '';
            const liItems = block.items
                .map((item) => {
                    const title = escapeHtml(item.title || '');
                    const desc = parseInline(item.description || '');
                    if (title && desc) {
                        return `<li><strong>${title}:</strong> ${desc}</li>`;
                    }
                    return `<li>${title || desc}</li>`;
                })
                .join('\n');
            return `<ul style="color: #555555; padding-left: 20px;">\n${liItems}\n</ul>`;
        }

        case 'signature': {
            const name = escapeHtml(block.name || '');
            const title = escapeHtml(block.title || '');
            const email = escapeHtml(block.email || '');
            return `<p style="margin-top: 20px; border-left: 3px solid #142850; padding-left: 15px;">
<strong>${name}</strong><br>
${title}<br>
<a href="mailto:${email}" style="color:#142850; text-decoration:none;">${email}</a>
</p>`;
        }

        default:
            return '';
    }
};

/**
 * Verilen blok dizisini tam HTML mail string'ine çevirir.
 * @param {Array} blocks - İçerik blokları
 * @returns {string} - Tam HTML string
 */
export const buildMailHtml = (blocks) => {
    const contentHtml = Array.isArray(blocks)
        ? blocks.map(blockToHtml).filter(Boolean).join('\n')
        : '';

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KOÜ Yazılım Kulübü</title>
<style>
body {
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f0f2f5;
  margin: 0;
  padding: 0;
  color: #333333;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
.container {
  max-width: 600px;
  margin: 40px auto;
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 10px 25px rgba(20, 40, 80, 0.1);
  overflow: hidden;
}
.header {
  background-color: #142850;
  background-image: linear-gradient(135deg, #142850 0%, #274985 100%);
  padding: 40px 20px;
  text-align: center;
}
.content {
  padding: 40px 30px;
}
p {
  margin-bottom: 20px;
  color: #555555;
  font-size: 16px;
}
.footer {
  background-color: #f8f9fa;
  padding: 30px 20px;
  text-align: center;
  font-size: 13px;
  color: #888888;
  border-top: 1px solid #eeeeee;
}
.footer a {
  color: #142850;
  text-decoration: none;
  font-weight: 600;
  margin: 0 1px;
}
@media screen and (max-width: 600px) {
  .container { width: 100%; margin: 0; border-radius: 0; }
  .content { padding: 25px 20px; }
}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div style="display: inline-block; text-align: center;">
      <img src="cid:logo" alt="KOÜ Yazılım Kulübü Logo" style="width: 100px; height: auto; display: inline-block; vertical-align: middle; margin-right: 30px;">
      <img src="cid:teknopark-logo" alt="Kocaeli Üniversitesi Teknopark Logo" style="width: 180px; height: auto; display: inline-block; vertical-align: middle;">
    </div>
  </div>
  <div class="content">
    ${contentHtml}
  </div>
  <div class="footer">
    <p>© 2026 KOÜ Yazılım Kulübü. Tüm hakları saklıdır.</p>
    <p>
      <a href="https://www.linkedin.com/company/yazilim-kulubu">LinkedIn</a> •
      <a href="https://www.instagram.com/kou.seng">Instagram</a> •
      <a href="https://kouseng.com/">Web Sitesi</a>
    </p>
  </div>
</div>
</body>
</html>`;
};
