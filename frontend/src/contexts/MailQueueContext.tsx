'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
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
  scheduledAt?: string | null;
  nextSendAt?: string | null;
  createdAt: string;
  attachments: { filename: string; contentType: string }[];
};

export type EnqueueInput = {
  subject: string;
  recipients: string[];
  blocks: MailBlock[];
  attachments: File[];
  scheduledAt?: string | null;
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

/** localStorage'dan token'ı okur — auth state'e değil, her zaman güncel değere bakar */
function authHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function MailQueueProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<QueueJob[]>([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ─── Görevleri Getir ─────────────────────────────────────────────────────

  const fetchJobs = useCallback(async () => {
    const headers = authHeaders();
    if (!headers.Authorization) return; // Oturum açılmamış
    try {
      const res = await fetch(`${API_BASE}/mail/queue`, { headers });
      if (!res.ok) return;
      const data = (await res.json()) as { success: boolean; jobs: QueueJob[] };
      if (data.success && mountedRef.current) {
        setJobs(data.jobs);
      }
    } catch {
      // Ağ hatası — sessizce geç
    }
  }, []);

  // ─── İlk Yükleme ─────────────────────────────────────────────────────────

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // ─── Adaptif Polling ──────────────────────────────────────────────────────
  // Aktif görev varsa 3 s, yoksa 15 s. jobs değişince interval yeniden kurulur.

  const hasActive = jobs.some((j) => j.status === 'pending' || j.status === 'running');

  useEffect(() => {
    const interval = hasActive ? 3_000 : 15_000;
    const id = setInterval(fetchJobs, interval);
    return () => clearInterval(id);
  }, [hasActive, fetchJobs]);

  // ─── Aksiyonlar ──────────────────────────────────────────────────────────

  const enqueueJob = useCallback(
    async (input: EnqueueInput) => {
      const formData = new FormData();
      formData.append('subject', input.subject);
      formData.append('recipients', input.recipients.join(','));
      formData.append('blocks', JSON.stringify(input.blocks));
      if (input.scheduledAt) {
        formData.append('scheduledAt', input.scheduledAt);
      }
      for (const file of input.attachments) {
        formData.append('attachments', file);
      }

      const res = await fetch(`${API_BASE}/mail/queue`, {
        method: 'POST',
        headers: authHeaders(),
        body: formData,
      });

      const data = (await res.json()) as { success: boolean; message?: string };
      if (!res.ok || !data.success) {
        throw new Error(data.message ?? 'Görev oluşturulamadı.');
      }

      await fetchJobs();
    },
    [fetchJobs],
  );

  const cancelJob = useCallback(
    async (id: string) => {
      await fetch(`${API_BASE}/mail/queue/${id}/cancel`, {
        method: 'PATCH',
        headers: authHeaders(),
      });
      await fetchJobs();
    },
    [fetchJobs],
  );

  const dismissJob = useCallback(
    async (id: string) => {
      await fetch(`${API_BASE}/mail/queue/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      await fetchJobs();
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
