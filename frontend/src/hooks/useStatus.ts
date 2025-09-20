'use client';

import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

export type StatusData = {
  generalSubmissions: {
    pending: number;
    reviewed: number;
    accepted: number;
  };
  technicalSubmissions: {
    web: number;
    ai: number;
    game: number;
  };
  contactMessages: {
    read: number;
    unread: number;
  };
};

export type StatusResponse = {
  success: boolean;
  message: string;
  data: StatusData;
};

interface UseStatusReturn {
  statusData: StatusData | null;
  isFetching: boolean;
  errorMessage: string | null;
  fetchStatus: () => Promise<void>;
}

/**
 * Sistem durumu istatistiklerini getirmek için özel hook
 * @returns Sistem durumu verileri ve durum bilgileri
 */
export const useStatus = (): UseStatusReturn => {
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { getAuthHeader } = useAuth();

  /**
   * Sistem durumu verilerini API'den getirir
   */
  const fetchStatus = useCallback(async (): Promise<void> => {
    if (isFetching) return;

    setIsFetching(true);
    setErrorMessage(null);

    try {
      const auth = getAuthHeader();
      if (!auth?.Authorization) {
        throw new Error('Yetkilendirme bulunamadı');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...auth,
        },
      });

      if (!response.ok) {
        let message = 'Sistem durumu getirilemedi';
        try {
          const errorData = await response.json();
          if (errorData?.message) {
            message = errorData.message;
          }
        } catch {
          // JSON parse hatası durumunda varsayılan mesajı kullan
        }
        throw new Error(message);
      }

      const result: StatusResponse = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.message || 'Geçersiz yanıt alındı');
      }

      setStatusData(result.data);
    } catch (error) {
      const message = (error as Error).message || 'Sistem durumu getirilirken bir hata oluştu';
      setErrorMessage(message);
      setStatusData(null);
    } finally {
      setIsFetching(false);
    }
  }, [getAuthHeader, isFetching]);

  return {
    statusData,
    isFetching,
    errorMessage,
    fetchStatus,
  };
};