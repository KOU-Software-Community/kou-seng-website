'use client';

import { useCallback } from 'react';
import { useAuth } from './useAuth';
import type { JamApplication, JamApplicationBody } from '@/lib/gameJam';

type Result = { success: boolean; message: string };

const API = () => `${process.env.NEXT_PUBLIC_API_URL}/gamejam`;

/** Game jam başvurusu (herkese açık) ve admin işlemleri: liste, CSV, silme. */
export const useGameJam = () => {
  const { getAuthHeader } = useAuth();

  const submit = async (body: JamApplicationBody): Promise<Result & { id?: string }> => {
    try {
      const response = await fetch(API(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => null);
      return {
        success: response.ok && Boolean(data?.success),
        message: data?.message || 'Başvuru gönderilemedi. Lütfen daha sonra tekrar deneyiniz.',
        id: data?.data?._id,
      };
    } catch {
      return { success: false, message: 'Başvuru gönderilemedi. Bağlantınızı kontrol edin.' };
    }
  };

  // Admin sayfası bunu effect içinde çağırıyor; kimliği sabit kalmalı
  const list = useCallback(async (): Promise<Result & { data: JamApplication[] }> => {
    try {
      const response = await fetch(API(), { headers: getAuthHeader(), cache: 'no-store' });
      const data = await response.json().catch(() => null);
      if (!response.ok || !Array.isArray(data?.data)) {
        return { success: false, message: data?.message || 'Başvurular alınamadı.', data: [] };
      }
      return { success: true, message: '', data: data.data };
    } catch {
      return { success: false, message: 'Başvurular alınamadı. Bağlantınızı kontrol edin.', data: [] };
    }
  }, [getAuthHeader]);

  /** Başarılıysa null, değilse hata mesajı. */
  const downloadCsv = async (filename: string): Promise<string | null> => {
    try {
      const response = await fetch(`${API()}/export`, { headers: getAuthHeader() });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        return data?.message || 'CSV indirilemedi.';
      }
      const blobUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      return null;
    } catch {
      return 'CSV indirilemedi. Bağlantınızı kontrol edin.';
    }
  };

  /** Sunucu, kayıt sayısı expectedCount'la tutmazsa hiçbir şey silmeden 409 döner. */
  const purge = async (expectedCount: number): Promise<Result> => {
    try {
      const response = await fetch(`${API()}/purge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ expectedCount }),
      });
      const data = await response.json().catch(() => null);
      return { success: response.ok && Boolean(data?.success), message: data?.message || 'Başvurular silinemedi.' };
    } catch {
      return { success: false, message: 'Başvurular silinemedi. Bağlantınızı kontrol edin.' };
    }
  };

  return { submit, list, downloadCsv, purge };
};
