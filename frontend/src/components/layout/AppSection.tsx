'use client';

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faGooglePlay } from '@fortawesome/free-brands-svg-icons';
import { Button } from "@/components/ui/button";
import { PixelMark } from "@/components/layout/Pixel";
import type { AppData } from "@/lib/homeData";

const chip = "flex items-center gap-2 border border-(--acik-mavi)/35 bg-[#00102F]/75 text-white shadow-[3px_3px_0_var(--koyu-lacivert)]";

// Ana sayfadaki mobil uygulama bölümü. Tanıtım videosu sitenin kendisinden sunulur
// (public/video/): bölümün yarısı görününce sessiz oynar, ekrandan çıkınca durur;
// video yalnızca görününce iner. Hareket azaltma açıksa kendiliğinden oynamaz.
// Tarayıcının kendi kontrolleri yok: iPhone'da sesi açınca birkaç saniye videonun
// üstünü örtüyorlardı. Kendiliğinden başlayan hareketli içerik durdurulabilmeli;
// bunu durdur/oynat düğmesi sağlıyor, kullanıcı durdurduysa video geri dönünce
// kendiliğinden başlamıyor.
export default function AppSection({ app }: { app: AppData }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) video.pause();
        else if (!userPaused.current) video.play().catch(() => {});
      },
      { threshold: 0.5 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // Sesli izlemek isteyen videonun başını kaçırmasın: baştan başlar.
  const unmute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.currentTime = 0;
    userPaused.current = false;
    video.play().catch(() => {});
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    userPaused.current = !video.paused;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <section className="bg-night overflow-hidden py-20 text-white">
      <div aria-hidden="true" className="pixel-edge top-0 rotate-180" />
      <div className="container grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <PixelMark />
          <p className="mb-3 font-pixel text-[10px] lowercase text-(--acik-mavi)">{app.kicker}</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{app.title}</h2>
          <p className="mb-7 leading-relaxed text-[#C4D9E6]">{app.description}</p>
          <div className="flex flex-wrap gap-3">
            {app.stores.map((store) => {
              const icon = store.name === 'App Store' ? faApple : faGooglePlay;
              return store.url ? (
                <Button key={store.name} asChild size="lg" className="bg-white text-(--koyu-lacivert) hover:bg-white/90">
                  <a href={store.url} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={icon} className="h-4 w-4" />
                    {store.name}
                  </a>
                </Button>
              ) : (
                <Button
                  key={store.name}
                  size="lg"
                  variant="outline"
                  disabled
                  className="border-(--acik-mavi)/30 bg-transparent text-white dark:border-(--acik-mavi)/30 dark:bg-transparent"
                >
                  <FontAwesomeIcon icon={icon} className="h-4 w-4" />
                  {store.name} · Yakında
                </Button>
              );
            })}
          </div>
        </div>
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-(--acik-mavi)/30 shadow-[0_24px_60px_rgb(0_0_0/0.4)]">
          <video
            ref={videoRef}
            src={app.video.src}
            poster={app.video.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-label={app.title}
            onPlay={() => setPaused(false)}
            onPause={() => setPaused(true)}
            onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
            className="h-full w-full object-cover"
          />
          <div className="absolute left-3 top-3 flex gap-2">
            <button type="button" onClick={togglePlay} aria-label={paused ? 'videoyu oynat' : 'videoyu durdur'} className={`${chip} p-2`}>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 8 8">
                <path fill="currentColor" d={paused ? 'M3 1h1v6h-1z M4 2h1v4h-1z M5 3h1v2h-1z' : 'M2 1h2v6h-2z M5 1h2v6h-2z'} />
              </svg>
            </button>
            {muted && (
              <button type="button" onClick={unmute} className={`${chip} px-2.5 py-2 font-pixel text-[9px]`}>
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 8 8">
                  <path fill="currentColor" d="M0 3h2v2h-2z M2 2h1v4h-1z M3 1h1v6h-1z M5 2h1v1h-1z M7 2h1v1h-1z M6 3h1v2h-1z M5 5h1v1h-1z M7 5h1v1h-1z" />
                </svg>
                sesi aç
              </button>
            )}
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="pixel-edge bottom-0" />
    </section>
  );
}
