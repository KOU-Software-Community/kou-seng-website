import Parser from 'rss-parser';
import logger from '../helpers/logger.js';

// RSS parser için özel tiplemeler
const customFields = {
  item: [
    ['content:encoded', 'content'],
    ['dc:creator', 'creator']
  ],
};

// @desc    Birden fazla Medium RSS feed'ini çekip parse et
// @route   GET /rss
// @access  Public
export const getRssFeed = async (req, res) => {
  try {
    const urlsString = process.env.MEDIUM_RSS_URLS;

    if (!urlsString) {
      return res.status(400).json({
        success: false,
        message: 'RSS beslemesi URL parametreleri gerekli (MEDIUM_RSS_URLS)'
      });
    }

    // URL'leri virgülle ayrılmış string'den array'e çevir
    const urls = urlsString.split(',').map(url => url.trim()).filter(url => url);

    if (urls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli RSS URL bulunamadı'
      });
    }

    // Tüm RSS kaynaklarından veri çek
    const allItems = await fetchAllRssFeeds(urls);

    // Eğer hiç makale yoksa boş liste döndür
    if (allItems.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'RSS beslemelerinden makale bulunamadı',
        data: { items: [] },
        count: 0,
        sources: urls.length
      });
    }

    // Tarihe göre sırala (en yeni önce)
    allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    // Parse edilmiş item'lara dönüştür
    const parsedItems = allItems.map(item => {
      // Extract the cover image from content
      const coverImage = extractCoverImage(item.content || '');
      
      // Extract excerpt from content (removing HTML tags)
      const excerpt = extractExcerpt(item.content || '', item.contentSnippet || '');

      return {
        title: item.title || '',
        link: item.link || '',
        author: item.creator || 'Anonim Yazar',
        date: formatDate(item.pubDate || ''),
        categories: item.categories || [],
        coverImage,
        excerpt,
        source: item.source || 'Bilinmeyen Kaynak'
      };
    });

    logger.debug(`RSS beslemeleri başarıyla çekildi: ${parsedItems.length} makale (${urls.length} kaynaktan)`);

    return res.status(200).json({
      success: true,
      message: 'RSS beslemeleri başarıyla çekildi',
      data: { items: parsedItems },
      count: parsedItems.length,
      sources: urls.length
    });
  } catch (err) {
    logger.error(`RSS beslemeleri çekilirken hata: ${err.message}`);
    return res.status(500).json({
      success: false,
      message: 'RSS verilerini çekerken bir hata oluştu'
    });
  }
};

// @desc    Birden fazla RSS feed'inden veri çek
// @param   {string[]} urls - RSS URL'leri array'i
// @return  {Promise<Array>} Tüm feed'lerden gelen item'lar
const fetchAllRssFeeds = async (urls) => {
  // Medium RSS içeriğini parselamak için özel konfigürasyon
  const parser = new Parser({
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Safari/537.36',
    },
    customFields,
  });

  const allItems = [];
  const errors = [];

  // Her URL için ayrı ayrı işlem yap
  for (const url of urls) {
    try {
      logger.debug(`RSS feed çekiliyor: ${url}`);
      const feed = await parser.parseURL(url);
      
      // Her item'a kaynak bilgisi ekle
      const itemsWithSource = feed.items.map(item => ({
        ...item,
        source: extractSourceName(url)
      }));
      
      allItems.push(...itemsWithSource);
      logger.debug(`${url} kaynağından ${feed.items.length} makale çekildi`);
    } catch (err) {
      const errorMsg = `${url} kaynağından veri çekilirken hata: ${err.message}`;
      logger.error(errorMsg);
      errors.push(errorMsg);
      // Bir kaynak başarısız olsa bile diğerlerine devam et
    }
  }

  // Eğer hiç veri çekilemediyse boş liste döndür
  if (allItems.length === 0) {
    logger.error(`Hiç makale bulunamadı. Hatalar: ${errors.join(', ')}`);
    return [];
  }

  // Eğer bazı kaynaklardan veri çekilemediyse uyarı logla
  if (errors.length > 0) {
    logger.error(`${errors.length} kaynaktan veri çekilemedi, ${allItems.length} makale başarıyla çekildi`);
  }

  return allItems;
};

// @desc    URL'den kaynak adını çıkar
// @param   {string} url - RSS URL'i
// @return  {string} Kaynak adı
const extractSourceName = (url) => {
  try {
    // Medium URL'lerinden kaynak adını çıkar
    if (url.includes('medium.com/feed/')) {
      const match = url.match(/medium\.com\/feed\/(.+)/);
      if (match) {
        const source = match[1];
        // @ işaretini kaldır ve büyük harfe çevir
        return source.replace('@', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
    }
    
    // Diğer URL'ler için domain adını kullan
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'Bilinmeyen Kaynak';
  }
};

// Extract the first image URL from content
const extractCoverImage = (content) => {
  // Medium'un RSS beslemesindeki görseller genellikle bu formatta
  // <figure><img alt="" src="https://cdn-images-1.medium.com/max/1024/..." /></figure>
  
  // Daha kapsamlı regex - farklı görsel formatlarını yakalayabilir
  const imgRegexes = [
    /<img.*?src=["'](https:\/\/cdn-images-.*?\.medium\.com\/.*?)["']/i,  // Medium CDN görselleri
    /<img.*?src=["'](.*?\.(?:png|jpg|jpeg|gif|webp))["']/i,              // Herhangi bir görsel uzantısı
    /<img.*?src=["'](.*?)["']/i                                          // Genel olarak herhangi bir görsel
  ];
  
  // Regex'leri sırayla dene
  for (const regex of imgRegexes) {
    const match = content.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // Hiç görsel bulunamadı, varsayılan görseli döndür
  return '/file.svg';
};

// Extract text excerpt from HTML content
const extractExcerpt = (content, contentSnippet) => {
  // Eğer contentSnippet mevcutsa ve yeterince uzunsa, onu kullan
  if (contentSnippet && contentSnippet.length > 20) {
    const maxLength = 200;
    return contentSnippet.length > maxLength 
      ? contentSnippet.substring(0, maxLength).trim() + '...' 
      : contentSnippet.trim();
  }
  
  // Değilse HTML içeriğinden özet çıkar
  // Önce HTML etiketlerini temizle
  const plainText = content
    .replace(/<\/?[^>]+(>|$)/g, ' ')  // HTML etiketlerini kaldır
    .replace(/\s+/g, ' ')             // Fazla boşlukları tek boşluğa dönüştür
    .trim();                          // Başındaki ve sonundaki boşlukları kaldır
  
  // İlk birkaç cümleyi al
  const maxLength = 200;
  const excerpt = plainText.length > maxLength 
    ? plainText.substring(0, maxLength).trim() + '...' 
    : plainText.trim();
    
  return excerpt;
};

// Format date to desired format
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};
