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
import AppSection from '@/components/layout/AppSection';
import { RSS_ENABLED, cn } from '@/lib/utils';
import { PixelMark } from "@/components/layout/Pixel";

type HomeProps = {
  homeData: HomeData;
};

// Logonun çevresinde dağılan piksel kareler: [left %, top %, px, opaklık, yanıp sönme gecikmesi (sn)]
const HERO_PIXELS: [number, number, number, number, number?][] = [
  [8, 18, 12, 0.7], [16, 30, 8, 0.4, -0.4], [4, 56, 10, 0.55], [14, 72, 6, 0.8],
  [84, 14, 14, 0.5], [92, 30, 8, 0.85, -1.2], [78, 8, 10, 0.3], [90, 64, 12, 0.6],
  [80, 80, 6, 0.45, -2], [26, 6, 8, 0.35], [66, 92, 6, 0.5],
];

export default function Home({ homeData }: HomeProps) {

  return (
    <main className="flex flex-col gap-16">
      {/* 1. Hero Bölümü: koyu bant (tanıtım videosunun zemini) */}
      <section className="bg-night overflow-hidden py-16 text-white md:py-28 lg:py-32">
        <div className="container px-4 sm:px-6 lg:px-8">
          {/* İki sütunlu düzen (Mobilde tek sütun) */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Sol taraf - Metin içeriği */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              {/* Piksel font Türkçe büyük harfleri bozuk çiziyor: rozet küçük harf */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-(--acik-mavi)/30 bg-white/5 px-4 py-1.5 font-pixel text-[10px] lowercase text-(--acik-mavi) sm:text-xs">
                <span className="size-2 bg-(--turkuaz)"></span>
                <span>{homeData.hero.badge}</span>
              </div>

              <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                {homeData.hero.title.split(homeData.hero.titleHighlight)[0]}
                <span className="bg-gradient-to-br from-(--acik-mavi) to-[#3FB0DC] bg-clip-text text-transparent">
                  {homeData.hero.titleHighlight}
                </span>
                {homeData.hero.title.split(homeData.hero.titleHighlight)[1]}
                <span aria-hidden="true" className="ml-1 inline-block h-[0.8em] w-[0.42em] translate-y-[0.06em] bg-(--turkuaz) motion-safe:animate-blink" />
              </h1>

              <p className="mb-8 max-w-xl text-lg text-[#C4D9E6]">
                {homeData.hero.description}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <Button asChild size="lg" className="bg-cta text-white shadow-cta hover:brightness-110">
                  <Link href={homeData.hero.primaryButton.href}>
                    {homeData.hero.primaryButton.text} <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-(--acik-mavi)/35 bg-white/5 text-white hover:bg-white/10 hover:text-white dark:border-(--acik-mavi)/35 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <Link href={homeData.hero.secondaryButton.href}>
                    {homeData.hero.secondaryButton.text}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Sağ taraf - kutusuz logo, arkasında parıltı, çevresinde piksel kareler */}
            <div className="relative mx-auto grid aspect-square w-full max-w-[300px] place-items-center sm:max-w-[340px] md:max-w-md lg:max-w-lg lg:justify-self-center xl:justify-self-end">
              <div aria-hidden="true" className="absolute inset-0 m-auto size-[62%] rounded-full bg-(--turkuaz)/55 blur-[60px]" />
              {HERO_PIXELS.map(([left, top, size, opacity, delay], i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className={cn("absolute bg-(--acik-mavi)", delay !== undefined && "motion-safe:animate-pxspin")}
                  // Süre inline: animate-pxspin'in animation kısaltması bir sınıfla verilen süreyi eziyor.
                  style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, opacity, ...(delay !== undefined && { animationDuration: '2.4s', animationDelay: `${delay}s` }) }}
                />
              ))}
              <Image
                src="/kouseng-logo.svg"
                alt="KOU SENG Logo"
                width={300}
                height={300}
                preload
                className="relative h-auto w-[58%]"
              />
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="pixel-edge bottom-0" />
      </section>

      {/* 2. Kulüp Tanıtımı */}
      <section className="container">
        <div className="mb-12 mx-auto text-center max-w-3xl">
          <PixelMark />
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

      {/* Mobil uygulama ve tanıtım videosu */}
      <AppSection app={homeData.app} />

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