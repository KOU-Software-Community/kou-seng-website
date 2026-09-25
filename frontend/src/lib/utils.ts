import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Yayınlar (Medium RSS). NEXT_PUBLIC_ENABLE_RSS=0 ise ana sayfa bölümü, menü ve
// footer bağlantısı, /publications sayfası ve sitemap girdisi kalkar. Değer build
// sırasında okunur; değiştirince yeniden deploy gerekir.
export const RSS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_RSS !== "0"
