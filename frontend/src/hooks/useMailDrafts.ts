'use client';

import { useState, useEffect, useCallback } from 'react';
import type { MailBlock } from './useSponsorMail';

export type MailDraftAttachment = {
  name: string;
  type: string;
  blob: Blob;
};

export type MailDraft = {
  id: string;
  name: string;
  createdAt: number;
  to: string;
  subject: string;
  blocks: MailBlock[];
  attachments: MailDraftAttachment[];
};

export type DraftInput = {
  name: string;
  to: string;
  subject: string;
  blocks: MailBlock[];
  attachments: File[];
};

const DB_NAME = 'kou-seng-mail-drafts';
const STORE_NAME = 'drafts';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
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
    const tx = db.transaction(STORE_NAME, mode);
    const req = op(tx.objectStore(STORE_NAME));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function useMailDrafts() {
  const [drafts, setDrafts] = useState<MailDraft[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const db = await openDB();
      const all = await idbOp<MailDraft[]>(db, 'readonly', (s) => s.getAll());
      db.close();
      setDrafts(all.sort((a, b) => b.createdAt - a.createdAt));
    } catch {
      // IndexedDB kullanılamıyor (örn. bazı tarayıcılarda gizli mod)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const saveDraft = async (input: DraftInput): Promise<void> => {
    const draft: MailDraft = {
      id: crypto.randomUUID(),
      name: input.name,
      createdAt: Date.now(),
      to: input.to,
      subject: input.subject,
      blocks: input.blocks,
      attachments: input.attachments.map((f) => ({ name: f.name, type: f.type, blob: f })),
    };
    const db = await openDB();
    await idbOp(db, 'readwrite', (s) => s.put(draft));
    db.close();
    await refresh();
  };

  const removeDraft = async (id: string): Promise<void> => {
    const db = await openDB();
    await idbOp(db, 'readwrite', (s) => s.delete(id));
    db.close();
    await refresh();
  };

  return { drafts, loading, saveDraft, removeDraft };
}
