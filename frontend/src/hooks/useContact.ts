"use client";

import { useState } from "react";
import { useAuth } from "./useAuth";

export type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactResponse = {
  success: boolean;
  message: string;
};

export type ContactMessage = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ContactListResponse = {
  success: boolean;
  count: number;
  data: ContactMessage[];
};

interface UseContactReturn {
  isSubmitting: boolean;
  isSuccess: boolean;
  errorMessage: string;
  submitContact: (data: ContactFormValues) => Promise<void>;
  resetStatus: () => void;
  // Admin - list & manage
  contacts: ContactMessage[];
  totalCount: number;
  isFetchingContacts: boolean;
  listErrorMessage: string;
  isTogglingId: string | null;
  isDeletingId: string | null;
  fetchContacts: () => Promise<void>;
  toggleReadStatus: (id: string) => Promise<boolean>;
  deleteContact: (id: string) => Promise<boolean>;
}

/**
 * İletişim formu gönderimi için özel hook
 * @returns İletişim formu gönderme fonksiyonu ve durum bilgileri
 */
export const useContact = (): UseContactReturn => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { getAuthHeader } = useAuth();

  // Admin state
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isFetchingContacts, setIsFetchingContacts] = useState<boolean>(false);
  const [listErrorMessage, setListErrorMessage] = useState<string>("");
  const [isTogglingId, setIsTogglingId] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  /**
   * İletişim formunu API'ye gönderir
   * @param data İletişim formu verileri
   */
  const submitContact = async (data: ContactFormValues): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setIsSuccess(false);
    setErrorMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: ContactResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "İletişim formu gönderilirken bir hata oluştu.");
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("İletişim formu gönderim hatası:", error);
      setErrorMessage("Mesajınız gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Admin: İletişim mesajlarını listele
   */
  const fetchContacts = async (): Promise<void> => {
    if (isFetchingContacts) return;

    setIsFetchingContacts(true);
    setListErrorMessage("");

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/contact`;
      const auth = getAuthHeader();
      if (!auth?.Authorization) {
        // Sayfa tarafında auth bekleniyorsa sessizce çık
        setContacts([]);
        setTotalCount(0);
        return;
      }
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...auth,
        },
      });

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(
          `Beklenmeyen yanıt türü alındı. Lütfen NEXT_PUBLIC_API_URL değerini ve endpoint'i kontrol edin. [${response.status}] ${text.slice(0, 120)}`
        );
      }
      const result: ContactListResponse = await response.json();

      if (!response.ok || !result?.success) {
        const message = (result as unknown as { message?: string })?.message || "Mesajlar alınamadı.";
        throw new Error(message);
      }

      setContacts(Array.isArray(result.data) ? result.data : []);
      setTotalCount(typeof result.count === "number" ? result.count : 0);
    } catch (error) {
      setListErrorMessage((error as Error)?.message || "Mesajlar alınırken bir hata oluştu.");
    } finally {
      setIsFetchingContacts(false);
    }
  };

  /**
   * Admin: Okundu bilgisini değiştir (toggle)
   */
  const toggleReadStatus = async (id: string): Promise<boolean> => {
    if (!id || isTogglingId) return false;
    setIsTogglingId(id);

    // Optimistic update
    const previous = contacts;
    const next = contacts.map((c) => (c._id === id ? { ...c, isRead: !c.isRead } : c));
    setContacts(next);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/contact/${id}/read`;
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          ...getAuthHeader(),
        },
      });

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(
          `Beklenmeyen yanıt türü alındı. Lütfen NEXT_PUBLIC_API_URL değerini ve endpoint'i kontrol edin. [${response.status}] ${text.slice(0, 120)}`
        );
      }
      const result = (await response.json()) as ContactResponse;

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Okundu bilgisi güncellenemedi.");
      }

      return true;
    } catch (error) {
      // Revert
      setContacts(previous);
      setListErrorMessage((error as Error)?.message || "Okundu bilgisi güncellenemedi.");
      return false;
    } finally {
      setIsTogglingId(null);
    }
  };

  /**
   * Admin: Mesaj sil
   */
  const deleteContact = async (id: string): Promise<boolean> => {
    if (!id || isDeletingId) return false;
    setIsDeletingId(id);

    // Optimistic remove
    const previous = contacts;
    const next = contacts.filter((c) => c._id !== id);
    setContacts(next);
    setTotalCount((prev) => Math.max(0, prev - 1));

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/contact/${id}`;
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          ...getAuthHeader(),
        },
      });

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(
          `Beklenmeyen yanıt türü alındı. Lütfen NEXT_PUBLIC_API_URL değerini ve endpoint'i kontrol edin. [${response.status}] ${text.slice(0, 120)}`
        );
      }
      const result = (await response.json()) as ContactResponse;

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Mesaj silinemedi.");
      }

      return true;
    } catch (error) {
      // Revert
      setContacts(previous);
      setTotalCount(previous.length);
      setListErrorMessage((error as Error)?.message || "Mesaj silinemedi.");
      return false;
    } finally {
      setIsDeletingId(null);
    }
  };

  /**
   * Form durumlarını sıfırlar
   */
  const resetStatus = () => {
    setIsSuccess(false);
    setErrorMessage("");
  };

  return {
    isSubmitting,
    isSuccess,
    errorMessage,
    submitContact,
    resetStatus,
    contacts,
    totalCount,
    isFetchingContacts,
    listErrorMessage,
    isTogglingId,
    isDeletingId,
    fetchContacts,
    toggleReadStatus,
    deleteContact,
  };
};
