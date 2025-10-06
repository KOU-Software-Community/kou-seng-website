'use client';

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faFileLines, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useRssFeed } from '@/hooks/useRssFeed';

type RssSectionProps = {
  title: string;
  description: string;
  viewAllHref: string;
  viewAllText: string;
  maxItems?: number;
};

export default function RssSection({ 
  title, 
  description, 
  viewAllHref, 
  viewAllText,
  maxItems = 3 
}: RssSectionProps) {
  const { items: articles, isLoading, error } = useRssFeed();

  return (
    <section className="container pb-16">
      <div className="mb-12 mx-auto text-center max-w-3xl">
        <h2 className="mb-2 text-3xl font-bold tracking-tight">{title}</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          {description}
        </p>
      </div>

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
      ) : articles.length === 0 ? (
        <div className="text-center p-12 border rounded-lg">
          <FontAwesomeIcon icon={faFileLines} className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Henüz Yayın Yok</h3>
          <p className="text-muted-foreground">Yakında kulüp üyelerimizin yazılım dünyasına dair makaleleri burada yer alacak.</p>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, maxItems).map((article, index) => (
            <Card key={index} className={`py-0 pb-6 overflow-hidden ${index > 0 ? 'hidden md:flex' : ''}`}>
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
                  <div className={`flex h-full w-full items-center justify-center bg-gradient-to-b ${index % 3 === 0 ? 'from-primary/30 to-primary/10' :
                    index % 3 === 1 ? 'from-secondary/30 to-secondary/10' :
                      'from-accent/30 to-accent/10'
                    }`}>
                    <FontAwesomeIcon icon={faFileLines} className={`h-10 w-10 ${index % 3 === 0 ? 'text-primary/40' :
                      index % 3 === 1 ? 'text-secondary/40' :
                        'text-accent/40'
                      }`} />
                  </div>
                )}
              </AspectRatio>
              <CardHeader>
                <CardTitle className="line-clamp-2">
                  {article.title}
                </CardTitle>
                <CardDescription className="flex items-center text-xs">
                  <span>{article.author}</span>
                  <span className="mx-2">•</span>
                  <span>{article.date}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {article.excerpt}
                </p>
              </CardContent>
              <CardFooter className="justify-center">
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link href={article.link} target="_blank" rel="noopener noreferrer">
                    Okumaya Devam Et <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {articles.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline" className="mx-auto">
            <Link href={viewAllHref}>
              {viewAllText} <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}