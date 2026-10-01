import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// globals.css'teki özel gölgeler. Tanıtılmazsa tailwind-merge shadow-cta'yı
// gölge rengi sanar, bileşenin shadow-xs'i kalır ve gölge hiç görünmez.
const twMerge = extendTailwindMerge({ extend: { theme: { shadow: ["featured", "cta"] } } })

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Yayınlar (Medium RSS). NEXT_PUBLIC_ENABLE_RSS=0 ise ana sayfa bölümü, menü ve
// footer bağlantısı, /publications sayfası ve sitemap girdisi kalkar. Değer build
// sırasında okunur; değiştirince yeniden deploy gerekir.
export const RSS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_RSS !== "0"
