'use client';

import { useState } from 'react';
import { useAuth } from './useAuth';

export type MailBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: { title: string; description: string }[] }
  | { type: 'signature'; name: string; title: string; email: string };

export type SendMailPayload = {
  to: string;
  subject: string;
  blocks: MailBlock[];
  attachment?: File | null;
};

interface UseSponsorMailReturn {
  isSending: boolean;
  isSuccess: boolean;
  errorMessage: string;
  sendMail: (payload: SendMailPayload) => Promise<boolean>;
  resetStatus: () => void;
}

export const useSponsorMail = (): UseSponsorMailReturn => {
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { getAuthHeader } = useAuth();

  const sendMail = async (payload: SendMailPayload): Promise<boolean> => {
    if (isSending) return false;

    setIsSending(true);
    setIsSuccess(false);
    setErrorMessage('');

    try {
      // multipart/form-data — Content-Type başlığını tarayıcı otomatik ekler
      const formData = new FormData();
      formData.append('to', payload.to);
      formData.append('subject', payload.subject);
      formData.append('blocks', JSON.stringify(payload.blocks));
      if (payload.attachment) {
        formData.append('attachment', payload.attachment);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mail/send`, {
        method: 'POST',
        headers: { ...getAuthHeader() },
        body: formData,
      });

      const result = await response.json() as { success: boolean; message?: string };

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Mail gönderilirken bir hata oluştu.');
      }

      setIsSuccess(true);
      return true;
    } catch (error) {
      setErrorMessage((error as Error).message || 'Mail gönderilirken bir hata oluştu.');
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const resetStatus = () => {
    setIsSuccess(false);
    setErrorMessage('');
  };

  return { isSending, isSuccess, errorMessage, sendMail, resetStatus };
};
