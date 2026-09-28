'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import type { ApplicationWindow } from '@/lib/applicationWindow';

type UseApplicationWindowsReturn = {
  windows: Record<string, ApplicationWindow> | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateWindow: (
    slug: string,
    opensAt: string | null,
    closesAt: string | null
  ) => Promise<{ ok: boolean; message?: string }>;
};

/**
 * Başvuru formlarının açık/kapalı durumu (GET /submissions/windows). Karar
 * backend'de; alınamazsa windows null kalır ve sayfalar formları kapalı gösterir.
 * updateWindow yalnızca admin içindir (PATCH /submissions/windows/:slug).
 */
export const useApplicationWindows = (): UseApplicationWindowsReturn => {
  const [windows, setWindows] = useState<Record<string, ApplicationWindow> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getAuthHeader } = useAuth();

  // Durum isteğinin backend'de kendi limiti var ve genel limite sayılmaz (kampüs gibi
  // paylaşılan IP'de de açılır); token gerekmez.
  const refresh = useCallback(
    async (signal?: AbortSignal) => {
      try {
        // Backend askıda kalırsa sayfa "yükleniyor"da beklemesin: 10 sn'de yanıt yoksa hata sayılır
        const deadline = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('zaman aşımı')), 10_000));
        const response = await Promise.race([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions/windows`, {
            cache: 'no-store',
            signal,
          }),
          deadline,
        ]);
        const data = await Promise.race([response.json().catch(() => null), deadline]);
        if (!response.ok || !Array.isArray(data?.data)) throw new Error(`HTTP ${response.status}`);
        setWindows(Object.fromEntries((data.data as ApplicationWindow[]).map((w) => [w.slug, w])));
        setError(null);
      } catch {
        if (signal?.aborted) return;
        setWindows(null);
        setError('Başvuru durumu alınamadı. Lütfen daha sonra tekrar deneyiniz.');
      } finally {
        if (!signal?.aborted) setIsLoading(false);
      }
    },
    []
  );

  // Sayfadan çıkılınca istek iptal edilir; geç gelen yanıt state'e yazılmaz.
  useEffect(() => {
    const controller = new AbortController();
    refresh(controller.signal);
    return () => controller.abort();
  }, [refresh]);

  const updateWindow = async (slug: string, opensAt: string | null, closesAt: string | null) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions/windows/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ opensAt, closesAt }),
      });
      const data = await response.json().catch(() => null);
      return response.ok ? { ok: true } : { ok: false, message: data?.message || 'Başvuru dönemi kaydedilemedi.' };
    } catch {
      return { ok: false, message: 'Başvuru dönemi kaydedilemedi. Bağlantınızı kontrol edin.' };
    }
  };

  return { windows, isLoading, error, refresh, updateWindow };
};
