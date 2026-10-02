import { cn } from "@/lib/utils";

// Mobil uygulamadaki piksel öğelerinin (app_seng src/components/Pixel.tsx) web karşılığı.

/** Bölüm başlığının üstündeki üç kare (■■□). inline-flex: kabın text-align'ını izler. */
export function PixelMark({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" data-slot="pixel-mark" className={cn("mb-3 inline-flex gap-1", className)}>
      <span className="size-2 bg-(--turkuaz)" />
      <span className="size-2 bg-(--turkuaz)" />
      <span className="size-2 bg-(--acik-mavi) opacity-60" />
    </span>
  );
}

/** Sırayla yanıp sönen dört kare ve küçük harfli piksel etiket. */
export function PixelLoader({ label, className }: { label: string; className?: string }) {
  return (
    <div role="status" data-slot="pixel-loader" className={cn("flex flex-col items-center gap-3", className)}>
      <span aria-hidden="true" className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          // Negatif gecikme: açılışta dört kare birden yanmasın, her biri kendi çeyreğinde başlasın.
          <span
            key={i}
            className="size-2.5 bg-(--turkuaz) motion-safe:animate-pxspin"
            style={{ animationDelay: `${(i - 4) * 0.25}s` }}
          />
        ))}
      </span>
      <span className="font-pixel text-xs lowercase text-muted-foreground">{label}</span>
    </div>
  );
}
