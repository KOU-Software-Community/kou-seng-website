'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  type QueueJob,
  type QueueJobResult,
  addJob,
  deleteJob,
  getAllJobs,
  getJob,
  resetStaleJobs,
  updateJob,
} from '@/hooks/useMailQueue';
import useAuth from '@/hooks/useAuth';
import type { MailBlock } from '@/hooks/useSponsorMail';

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

const MailQueueContext = createContext<MailQueueContextValue | null>(null);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Returns a random delay between 15 000 and 30 000 ms. */
function randomDelayMs(): number {
  return (Math.floor(Math.random() * 16) + 15) * 1_000;
}

export function MailQueueProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<QueueJob[]>([]);
  const { getAuthHeader } = useAuth();

  // Keep a ref so the async processor always has the latest token.
  const authRef = useRef(getAuthHeader);
  useEffect(() => {
    authRef.current = getAuthHeader;
  }, [getAuthHeader]);

  const processingRef = useRef(false);
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    const all = await getAllJobs();
    if (mountedRef.current) setJobs(all);
  }, []);

  /**
   * Processes queued jobs one at a time.
   * Safe to call multiple times — the guard prevents concurrent runs.
   */
  const startProcessor = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;

    try {
      while (mountedRef.current) {
        const allJobs = await getAllJobs();
        const job = allJobs.find(
          (j) => j.status === 'pending' || j.status === 'running',
        );
        if (!job) break;

        // Mark the job as running (idempotent if it was already running).
        await updateJob({ ...job, status: 'running', nextSendAt: undefined });
        await refresh();

        for (let i = job.currentIndex; i < job.recipients.length; i++) {
          // Re-read so we pick up cancellations written by cancelJob().
          const fresh = await getJob(job.id);
          if (!fresh || fresh.status === 'cancelled') break;

          const email = job.recipients[i];

          // Build multipart/form-data for the existing /mail/send endpoint.
          const formData = new FormData();
          formData.append('to', email);
          formData.append('subject', fresh.subject);
          formData.append('blocks', JSON.stringify(fresh.blocks));
          for (const att of fresh.attachments) {
            formData.append(
              'attachments',
              new File([att.blob], att.name, { type: att.type }),
            );
          }

          let result: QueueJobResult;
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/mail/send`,
              {
                method: 'POST',
                headers: { ...authRef.current() },
                body: formData,
              },
            );
            const data = (await res.json().catch(() => ({}))) as {
              success?: boolean;
              message?: string;
            };
            result =
              res.ok && data.success
                ? { email, status: 'sent' }
                : { email, status: 'failed', error: data.message ?? 'Sunucu hatası' };
          } catch (err) {
            result = { email, status: 'failed', error: String(err) };
          }

          // Persist progress immediately after each send attempt.
          const afterSend = await getJob(job.id);
          if (afterSend) {
            await updateJob({
              ...afterSend,
              currentIndex: i + 1,
              results: [...afterSend.results, result],
              nextSendAt: undefined,
            });
          }
          await refresh();

          // Inter-send delay (skip after the last recipient).
          if (i < job.recipients.length - 1) {
            const ms = randomDelayMs();
            const nextAt = Date.now() + ms;
            const beforeDelay = await getJob(job.id);
            if (beforeDelay && beforeDelay.status !== 'cancelled') {
              await updateJob({ ...beforeDelay, nextSendAt: nextAt });
              await refresh();
            }
            await sleep(ms);
          }
        }

        // Mark done (only if the processor itself is the one finishing it).
        const final = await getJob(job.id);
        if (final && final.status === 'running') {
          await updateJob({ ...final, status: 'done', nextSendAt: undefined });
          await refresh();
        }
      }
    } finally {
      processingRef.current = false;
    }
  }, [refresh]);

  // On mount: reset stale 'running' jobs to 'pending' then kick the processor.
  useEffect(() => {
    resetStaleJobs()
      .then(refresh)
      .then(startProcessor)
      .catch(() => {});
  }, [refresh, startProcessor]);

  const enqueueJob = useCallback(
    async (input: EnqueueInput) => {
      const job: QueueJob = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        subject: input.subject,
        recipients: input.recipients,
        currentIndex: 0,
        status: 'pending',
        results: [],
        attachments: input.attachments.map((f) => ({
          name: f.name,
          type: f.type,
          blob: f,
        })),
        blocks: input.blocks,
      };
      await addJob(job);
      await refresh();
      void startProcessor();
    },
    [refresh, startProcessor],
  );

  const cancelJob = useCallback(
    async (id: string) => {
      const job = await getJob(id);
      if (!job || job.status === 'done' || job.status === 'cancelled') return;
      await updateJob({ ...job, status: 'cancelled', nextSendAt: undefined });
      await refresh();
    },
    [refresh],
  );

  const dismissJob = useCallback(
    async (id: string) => {
      await deleteJob(id);
      await refresh();
    },
    [refresh],
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
