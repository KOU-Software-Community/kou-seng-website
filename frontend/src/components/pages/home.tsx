import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faUsers, faFileLines } from '@fortawesome/free-solid-svg-icons';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HomeData } from '@/lib/homeData';
import AnnouncementsSection from '@/components/layout/AnnouncementsSection';
import RssSection from '@/components/layout/RssSection';

type HomeProps = {
  homeData: HomeData;
};

export default function Home({ homeData }: HomeProps) {

  return (
    <main className="flex flex-col gap-16">
      {/* 1. Hero Bölümü */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/20 py-16 md:py-28 lg:py-32">
        <div className="container">
          {/* İki sütunlu düzen (Mobilde tek sütun) */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Sol taraf - Metin içeriği */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="inline-flex items-center rounded-full border border-border/40 bg-background/80 px-4 py-1.5 text-sm font-medium backdrop-blur-sm mb-6">
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
                <Button asChild size="lg" className="bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
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

            {/* Sağ taraf - Görseller */}
            <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[340px] md:max-w-md lg:ml-auto mt-12 md:mt-0 aspect-[4/3] md:aspect-square">
              {/* Ana görsel - kod ve teknoloji temalı illüstrasyon */}
              <div className="absolute inset-0 rounded-lg border border-border/40 bg-background/80 p-2 backdrop-blur-sm shadow-xl">
                <div className="h-full w-full rounded bg-gradient-to-br from-primary/10 to-accent/5 p-3 sm:p-4 md:p-6 flex items-center justify-center">
                  {/* Büyük kod simgesi */}
                  <div className="relative w-full">
                    {/* Logo */}
                    <div className="absolute -top-10 sm:-top-12 md:-top-16 left-1/2 -translate-x-1/2 h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 rounded-xl overflow-hidden border border-border/40 bg-background/80 p-2 shadow-lg">
                      <Image
                        src="/kouseng-logo.svg"
                        alt="KOU SENG Logo"
                        width={100}
                        height={100}
                        className="object-contain h-full w-full"
                      />
                    </div>

                    {/* Kod görseli */}
                    <div className="w-full h-full bg-background/80 rounded-lg p-2 sm:p-3 md:p-4 border border-border/40 shadow-md overflow-hidden">
                      <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-4">
                        <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-red-500"></div>
                        <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-yellow-500"></div>
                        <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <div className="h-3 sm:h-4 w-3/4 rounded bg-primary/20"></div>
                        <div className="h-3 sm:h-4 w-full rounded bg-accent/20"></div>
                        <div className="h-3 sm:h-4 w-5/6 rounded bg-primary/20"></div>
                        <div className="h-3 sm:h-4 w-2/3 rounded bg-accent/20"></div>
                        <div className="h-3 sm:h-4 w-4/5 rounded bg-primary/20"></div>
                        <div className="h-3 sm:h-4 w-3/4 rounded bg-accent/20"></div>
                        <div className="h-3 sm:h-4 w-1/2 rounded bg-primary/20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dekoratif öğeler - Mobilde daha küçük ve ekranda kalacak şekilde */}
              <div className="absolute -bottom-2 sm:-bottom-4 md:-bottom-6 -right-2 sm:-right-4 md:-right-6 h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-lg border border-border/40 bg-background/80 shadow-lg backdrop-blur-sm p-1 sm:p-1.5 md:p-2">
                <div className="h-full w-full rounded bg-secondary/10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faFileLines} className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-secondary" />
                </div>
              </div>
              <div className="absolute -top-2 sm:-top-4 md:-top-6 -left-2 sm:-left-4 md:-left-6 h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-lg border border-border/40 bg-background/80 shadow-lg backdrop-blur-sm p-1 sm:p-1.5 md:p-2">
                <div className="h-full w-full rounded bg-primary/10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUsers} className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary" />
                </div>
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
      <RssSection
        title={homeData.publications.title}
        description={homeData.publications.description}
        viewAllHref={homeData.publications.viewAllHref}
        viewAllText={homeData.publications.viewAllText}
        maxItems={3}
      />
    </main>
  );
}