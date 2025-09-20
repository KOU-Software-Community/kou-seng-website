import { useState, useEffect } from 'react';

// Başvuru formu için alan tipleri
export type FormField = {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'textarea' | 'url';
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
};

// Başvuru tipi için gerekli bilgiler
export type ApplyDetail = {
  id: number;
  slug: string;
  title: string;
  description: string;
  isOpen: boolean;
  deadline: string;
  submissionType: 'general' | 'technical';
  icon: string;
  fields: FormField[];
};

// Hook tanımı
export const useApplyDetail = (slug: string | null | undefined) => {
  const [application, setApplication] = useState<ApplyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicationDetail = async () => {
      try {
        setIsLoading(true);

        if (!slug) {
          setError('Başvuru bilgisi bulunamadı.');
          return;
        }

        // JSON dosyasından başvuru detayını yükle
        const response = await fetch(`/data/applications/${slug}.json`);
        
        if (!response.ok) {
          setError('Belirtilen başvuru bulunamadı.');
          return;
        }
        
        const data = await response.json();
        setApplication(data);
        setError(null);
      } catch (err) {
        console.error('Başvuru bilgilerini alırken hata:', err);
        setError('Başvuru bilgileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicationDetail();
  }, [slug]);

  return {
    application,
    isLoading,
    error
  };
};
