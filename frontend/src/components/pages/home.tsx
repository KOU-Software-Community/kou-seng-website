import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HomeData } from '@/lib/homeData';
import AnnouncementsSection from '@/components/layout/AnnouncementsSection';
import RssSection from '@/components/layout/RssSection';
import { RSS_ENABLED } from '@/lib/utils';

type HomeProps = {
  homeData: HomeData;
};

export default function Home({ homeData }: HomeProps) {

  return (
    <main className="flex flex-col gap-16">
      {/* 1. Hero Bölümü */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/20 py-16 md:py-28 lg:py-32">
        <div className="container px-4 sm:px-6 lg:px-8">
          {/* İki sütunlu düzen (Mobilde tek sütun) */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Sol taraf - Metin içeriği */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="inline-flex items-center rounded-full border border-border/40 bg-background/80 px-4 py-1.5 font-pixel text-[10px] sm:text-xs backdrop-blur-sm mb-6">
                <span className="mr-1 flex h-2 w-2 rounded-full bg-primary"></span>
                <span>{homeData.hero.badge}</span>
              </div>

              <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                {homeData.hero.title.split(homeData.hero.titleHighlight)[0]}
                <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  {homeData.hero.titleHighlight}
                </span>
                {homeData.hero.title.split(homeData.hero.titleHighlight)[1]}
              </h1>

              <p className="mb-8 max-w-xl text-lg text-muted-foreground">
                {homeData.hero.description}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <Button asChild size="lg" className="bg-cta text-white shadow-cta hover:brightness-110">
                  <Link href={homeData.hero.primaryButton.href}>
                    {homeData.hero.primaryButton.text} <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href={homeData.hero.secondaryButton.href}>
                    {homeData.hero.secondaryButton.text}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Sağ taraf - Logo paneli (app_seng hero) */}
            <div className="relative mx-auto lg:mx-0 w-full max-w-[280px] sm:max-w-[340px] md:max-w-md lg:max-w-lg aspect-square lg:justify-self-center xl:justify-self-end">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 overflow-hidden rounded-2xl bg-hero shadow-featured">
                <div aria-hidden="true" className="absolute h-2/3 w-2/3 rounded-full bg-(--turkuaz)/50 blur-3xl" />
                <Image
                  src="/kouseng-logo.svg"
                  alt="KOU SENG Logo"
                  width={240}
                  height={240}
                  className="relative h-auto w-1/2"
                />
                <span className="relative font-pixel text-sm tracking-widest text-white sm:text-base">KOU SENG</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Kulüp Tanıtımı */}
      <section className="container">
        <div className="mb-12 mx-auto text-center max-w-3xl">
          <h2 className="mb-2 text-3xl font-bold tracking-tight">{homeData.clubIntroduction.title}</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {homeData.clubIntroduction.description}
          </p>
        </div>

        <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {homeData.clubIntroduction.features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <FontAwesomeIcon icon={feature.icon as IconProp} className="h-5 w-5" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Duyurular */}
      <AnnouncementsSection
        title={homeData.announcements.title}
        description={homeData.announcements.description}
        viewAllHref={homeData.announcements.viewAllHref}
        viewAllText={homeData.announcements.viewAllText}
        maxItems={2}
      />

      {/* 4. Medium Makaleleri */}
      {RSS_ENABLED && (
        <RssSection
          title={homeData.publications.title}
          description={homeData.publications.description}
          viewAllHref={homeData.publications.viewAllHref}
          viewAllText={homeData.publications.viewAllText}
          maxItems={3}
        />
      )}
    </main>
  );
}