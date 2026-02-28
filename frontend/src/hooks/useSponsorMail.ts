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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mail/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
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
