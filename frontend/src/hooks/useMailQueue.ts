import type { MailBlock } from './useSponsorMail';

export type QueueJobStatus = 'pending' | 'running' | 'done' | 'cancelled';

export type QueueJobResult = {
  email: string;
  status: 'sent' | 'failed';
  error?: string;
};

export type QueueJob = {
  id: string;
  createdAt: number;
  subject: string;
  recipients: string[];
  currentIndex: number; // next recipient index (= number of sends attempted so far)
  status: QueueJobStatus;
  results: QueueJobResult[];
  attachments: { name: string; type: string; blob: Blob }[];
  blocks: MailBlock[];
  nextSendAt?: number; // timestamp of next scheduled send (during inter-send delay)
};

const DB_NAME = 'kou-seng-mail-queue';
const STORE = 'jobs';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbOp<T>(
  db: IDBDatabase,
  mode: IDBTransactionMode,
  op: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = op(tx.objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllJobs(): Promise<QueueJob[]> {
  const db = await openDB();
  const jobs = await idbOp<QueueJob[]>(db, 'readonly', (s) => s.getAll());
  db.close();
  return jobs.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getJob(id: string): Promise<QueueJob | undefined> {
  const db = await openDB();
  const job = await idbOp<QueueJob | undefined>(db, 'readonly', (s) => s.get(id));
  db.close();
  return job;
}

export async function addJob(job: QueueJob): Promise<void> {
  const db = await openDB();
  await idbOp(db, 'readwrite', (s) => s.add(job));
  db.close();
}

export async function updateJob(job: QueueJob): Promise<void> {
  const db = await openDB();
  await idbOp(db, 'readwrite', (s) => s.put(job));
  db.close();
}

export async function deleteJob(id: string): Promise<void> {
  const db = await openDB();
  await idbOp(db, 'readwrite', (s) => s.delete(id));
  db.close();
}

/** On provider mount: reset any 'running' jobs to 'pending' so they're re-picked. */
export async function resetStaleJobs(): Promise<void> {
  const db = await openDB();
  const jobs = await idbOp<QueueJob[]>(db, 'readonly', (s) => s.getAll());
  db.close();
  for (const job of jobs) {
    if (job.status === 'running') {
      await updateJob({ ...job, status: 'pending', nextSendAt: undefined });
    }
  }
}
