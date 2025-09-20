'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faFilter, faFileLines, faSpinner, faMagnifyingGlass, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useRssFeed } from '@/hooks/useRssFeed';

export default function Publications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { items, isLoading, error, isEmpty } = useRssFeed();
  const [articles, setArticles] = useState<typeof items>([]);

  // Kategorileri dinamik olarak çıkartma
  const allCategories = Array.from(
    new Set(
      items.flatMap(article => article.categories)
    )
  );

  // Makaleleri filtrele
  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = items.filter(article => {
        const matchesSearch = 
          searchTerm === '' || 
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.author.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategories = 
          selectedCategories.length === 0 ||
          article.categories.some(category => selectedCategories.includes(category));
        
        return matchesSearch && matchesCategories;
      });
      
      setArticles(filtered);
    }, 300); // Arama animasyonunu gösterebilmek için kısa bir gecikme
    
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategories, items]);

  // Kategori seçimi işleyicisi
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Arkaplanda dinamik renk sınıfları oluşturan yardımcı fonksiyon
  const getCoverColorClass = (id: string) => {
    const index = parseInt(id) % 4;
    const colorClasses = [
      'from-primary/30 to-primary/10',
      'from-secondary/30 to-secondary/10',
      'from-accent/30 to-accent/10',
      'from-muted to-muted/50',
    ];
    return colorClasses[index];
  };

  return (
    <main className="flex flex-col gap-8 pt-8">
      {/* Başlık ve Açıklama */}
      <section className="container">
        <div className="mb-6 mx-auto text-center max-w-3xl">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Yayınlar</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Kulüp üyelerimizin yazılım dünyasına dair bilgi ve deneyimlerini paylaştıkları makaleler. 
            Medium üzerinden paylaşılan bu içerikler, çeşitli konularda derinlemesine bilgiler sunar.
          </p>
        </div>
      </section>

      {/* Arama ve Filtreleme */}
      <section className="container">
        <div className="flex flex-col gap-4 mb-8 max-w-3xl mx-auto">
          {/* Arama Kutusu */}
          <div className="relative max-w-full w-full">
            <FontAwesomeIcon 
              icon={faMagnifyingGlass} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" 
            />
            <Input
              placeholder="Makale ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* Kategori Filtreleme - Kaydırılabilir Alan */}
          {allCategories.length > 0 && (
            <div className="relative">
              <div className="flex overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                <div className="flex gap-2">
                  {allCategories.map(category => (
                    <Button 
                      key={category}
                      variant={selectedCategories.includes(category) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategoryToggle(category)}
                      className="rounded-full text-xs whitespace-nowrap"
                    >
                      <FontAwesomeIcon icon={faFilter} className="mr-1 h-3 w-3" />
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Kaydırma Göstergesi */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-12 h-8 bg-gradient-to-l from-background to-transparent"></div>
              </div>
            </div>
          )}
          
          {/* Seçili Filtreler */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs text-muted-foreground self-center">Seçili Filtreler:</span>
              {selectedCategories.map(category => (
                <Button
                  key={`selected-${category}`}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCategoryToggle(category)}
                  className="rounded-full text-xs h-6 px-2 py-0 bg-secondary/20"
                >
                  {category}
                  <span className="ml-1">×</span>
                </Button>
              ))}
              {selectedCategories.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategories([])}
                  className="rounded-full text-xs h-6 px-2 py-0"
                >
                  Tümünü Temizle
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Makaleler Listesi */}
      <section className="container pb-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center p-12 border rounded-lg">
            <FontAwesomeIcon icon={faFileLines} className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Hata Oluştu</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : isEmpty ? (
          <div className="text-center p-12 border rounded-lg">
            <FontAwesomeIcon icon={faFileLines} className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Daha Hiç Yayın Paylaşılmamış</h3>
            <p className="text-muted-foreground">Henüz hiç yayın paylaşılmamış. Yakında burada yayınlar görünecek.</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center p-12 border rounded-lg">
            <FontAwesomeIcon icon={faFileLines} className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Sonuç Bulunamadı</h3>
            <p className="text-muted-foreground">Arama kriterlerinize uygun makale bulunamadı. Lütfen farklı anahtar kelimeler deneyin veya filtreleri temizleyin.</p>
          </div>
        ) : (
          <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <Card key={index} className="overflow-hidden flex flex-col h-full gap-4 py-0 pb-6 transition-all hover:shadow-md">
                <AspectRatio ratio={16 / 9}>
                  {article.coverImage ? (
                    <Image
                      src={article.coverImage} 
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-b ${getCoverColorClass(index.toString())}`}>
                      <FontAwesomeIcon icon={faFileLines} className="h-10 w-10 text-primary/40" />
                    </div>
                  )}
                </AspectRatio>
                <CardHeader className="pb-0">
                  <CardTitle className="line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="flex items-center text-xs mt-2">
                    <span>{article.author}</span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <FontAwesomeIcon icon={faCalendarDays} className="mr-1 h-3 w-3" />
                      {article.date}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-4">
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {article.excerpt}
                  </p>
                </CardContent>
                <CardFooter className="mt-auto pt-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 w-full justify-center" 
                    asChild
                  >
                    <a href={article.link} target="_blank" rel="noopener noreferrer">
                      Medium&apos;da Oku <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}