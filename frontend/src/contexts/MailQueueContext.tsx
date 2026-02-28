'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import useAuth from '@/hooks/useAuth';
import type { MailBlock } from '@/hooks/useSponsorMail';

// ─── Tipler ──────────────────────────────────────────────────────────────────

export type QueueJobStatus = 'pending' | 'running' | 'done' | 'cancelled';

export type QueueJobResult = {
  email: string;
  status: 'sent' | 'failed';
  error?: string;
};

export type QueueJob = {
  id: string;
  subject: string;
  recipients: string[];
  currentIndex: number;
  status: QueueJobStatus;
  results: QueueJobResult[];
  nextSendAt?: string | null; // ISO date string
  createdAt: string;           // ISO date string
  attachments: { filename: string; contentType: string }[];
};

export type EnqueueInput = {
  subject: string;
  recipients: string[];
  blocks: MailBlock[];
  attachments: File[];
};

type MailQueueContextValue = {
  jobs: QueueJob[];
  enqueueJob: (input: EnqueueInput) => Promise<void>;
  cancelJob: (id: string) => Promise<void>;
  dismissJob: (id: string) => Promise<void>;
};

// ─── Context ─────────────────────────────────────────────────────────────────

const MailQueueContext = createContext<MailQueueContextValue | null>(null);

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// ─── Provider ────────────────────────────────────────────────────────────────

export function MailQueueProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<QueueJob[]>([]);
  const { getAuthHeader } = useAuth();

  // getAuthHeader'ı ref'te tut; polling closure'ları hep güncel tokeni kullanır
  const authRef = useRef(getAuthHeader);
  useEffect(() => {
    authRef.current = getAuthHeader;
  }, [getAuthHeader]);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const pollingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── API Çağrıları ────────────────────────────────────────────────────────

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/mail/queue`, {
        headers: { ...authRef.current() },
      });
      if (!res.ok) return;
      const data = (await res.json()) as { success: boolean; jobs: QueueJob[] };
      if (data.success && mountedRef.current) {
        setJobs(data.jobs);
      }
    } catch {
      // Ağ hatası — sessizce geç, bir sonraki poll'da tekrar dene
    }
  }, []);

  // ─── Adaptif polling ─────────────────────────────────────────────────────
  // Aktif (pending/running) görev varsa her 3 s, yoksa her 15 s poll et.

  const scheduleNextPoll = useCallback(
    (currentJobs: QueueJob[]) => {
      if (!mountedRef.current) return;
      const hasActive = currentJobs.some(
        (j) => j.status === 'pending' || j.status === 'running',
      );
      const interval = hasActive ? 3_000 : 15_000;

      pollingTimerRef.current = setTimeout(async () => {
        await fetchJobs();
        // jobs state güncellenmiş olacak — ama closure eski değeri tutar;
        // bir sonraki schedule için state'i doğrudan okuyamayız, bu yüzden
        // kendi fetched verimiyle döngüyü sürdürüyoruz:
        setJobs((latest) => {
          scheduleNextPoll(latest);
          return latest;
        });
      }, interval);
    },
    [fetchJobs],
  );

  // İlk yükleme
  useEffect(() => {
    fetchJobs().then(() => {
      setJobs((latest) => {
        scheduleNextPoll(latest);
        return latest;
      });
    });
    return () => {
      if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);
    };
  }, [fetchJobs, scheduleNextPoll]);

  // ─── Aksiyonlar ──────────────────────────────────────────────────────────

  const enqueueJob = useCallback(
    async (input: EnqueueInput) => {
      const formData = new FormData();
      formData.append('subject', input.subject);
      formData.append('recipients', input.recipients.join(','));
      formData.append('blocks', JSON.stringify(input.blocks));
      for (const file of input.attachments) {
        formData.append('attachments', file);
      }

      const res = await fetch(`${API_BASE}/mail/queue`, {
        method: 'POST',
        headers: { ...authRef.current() },
        body: formData,
      });

      const data = (await res.json()) as { success: boolean; message?: string; job?: QueueJob };
      if (!res.ok || !data.success) {
        throw new Error(data.message ?? 'Görev oluşturulamadı.');
      }

      // Yeni görevi hemen listeye ekle, ardından poll zamanlamasını sıfırla
      await fetchJobs();
      if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);
      setJobs((latest) => {
        scheduleNextPoll(latest);
        return latest;
      });
    },
    [fetchJobs, scheduleNextPoll],
  );

  const cancelJob = useCallback(
    async (id: string) => {
      const res = await fetch(`${API_BASE}/mail/queue/${id}/cancel`, {
        method: 'PATCH',
        headers: { ...authRef.current() },
      });
      if (res.ok) await fetchJobs();
    },
    [fetchJobs],
  );

  const dismissJob = useCallback(
    async (id: string) => {
      const res = await fetch(`${API_BASE}/mail/queue/${id}`, {
        method: 'DELETE',
        headers: { ...authRef.current() },
      });
      if (res.ok) await fetchJobs();
    },
    [fetchJobs],
  );

  return (
    <MailQueueContext.Provider value={{ jobs, enqueueJob, cancelJob, dismissJob }}>
      {children}
    </MailQueueContext.Provider>
  );
}

export function useMailQueue(): MailQueueContextValue {
  const ctx = useContext(MailQueueContext);
  if (!ctx) throw new Error('useMailQueue must be used within MailQueueProvider');
  return ctx;
}
