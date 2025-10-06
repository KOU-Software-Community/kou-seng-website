'use client';

import { useState } from 'react';
import { useAuth } from './useAuth';

export type SubmissionResponse = {
  success: boolean;
  message: string;
  data?: { _id: string };
};

export type BaseSubmissionData = {
  name: string;
  studentId: string;
  email: string;
  phone: string;
  faculty: string;
  department: string;
  grade: number;
};

// Types for listing & updating
export type SubmissionListItem = {
  _id: string;
  submissionType: 'general' | 'technical';
  name: string;
  studentId: string;
  email: string;
  phone: string;
  faculty: string;
  department: string;
  grade: number;
  customFields: Record<string, string>;
  status: 'pending'| 'reviewed' | 'accepted' | 'rejected' | string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
};

export type SubmissionPagination = {
  count: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type SubmissionListResponse = {
  success: boolean;
  message: string;
  data: SubmissionListItem[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ListSubmissionsParams = {
  type?: 'general' | 'technical';
  category?: string;
  status?: 'pending' | 'reviewed' | 'accepted' | 'rejected' | string;
  search?: string;
  page?: number;
  limit?: number;
};

export type UpdateSubmissionBody = {
  status?: 'pending' | 'reviewed' | 'accepted' | 'rejected' | string;
  reviewNotes?: string;
};

export type GeneralSubmissionData = BaseSubmissionData;

export type TechnicalSubmissionData = BaseSubmissionData & {
  [key: string]: string | number | boolean | null | undefined;
};

export type SubmissionData = GeneralSubmissionData | TechnicalSubmissionData;

interface UseSubmissionsReturn {
  isSubmitting: boolean;
  isSuccess: boolean;
  errorMessage: string | null;
  submitApplication: (type: 'general' | 'technical', data: SubmissionData, slug?: string) => Promise<SubmissionResponse>;
  resetStatus: () => void;
  // Listing
  isFetchingSubmissions: boolean;
  submissionsError: string | null;
  submissions: SubmissionListItem[];
  pagination: SubmissionPagination;
  listSubmissions: (params?: ListSubmissionsParams) => Promise<SubmissionListResponse>;
  // Update (evaluate)
  isUpdatingSubmission: boolean;
  updateError: string | null;
  updateSubmission: (id: string, body: UpdateSubmissionBody) => Promise<Pick<SubmissionResponse, 'success' | 'message'>>;
}

/**
 * Başvuru formlarını göndermek için özel hook
 * @returns Başvuru gönderme fonksiyonu ve durum bilgileri
 */
export const useSubmissions = (): UseSubmissionsReturn => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { getAuthHeader } = useAuth();

  // Listing state
  const [isFetchingSubmissions, setIsFetchingSubmissions] = useState<boolean>(false);
  const [submissionsError, setSubmissionsError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionListItem[]>([]);
  const [pagination, setPagination] = useState<SubmissionPagination>({ count: 0, page: 1, limit: 20, totalPages: 0 });

  // Update state
  const [isUpdatingSubmission, setIsUpdatingSubmission] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  /**
   * Başvuruyu API'ye gönderir
   * @param type Başvuru tipi ('general' veya 'technical')
   * @param data Başvuru formu verileri
   * @param slug Teknik başvuru için slug (sadece technical tipinde zorunlu)
   */
  const submitApplication = async (
    type: 'general' | 'technical', 
    data: SubmissionData,
    slug?: string
  ): Promise<SubmissionResponse> => {
    if (isSubmitting) return { success: false, message: 'Başvuru işlemi zaten devam ediyor' };

    if (type === 'technical' && !slug) {
      return { success: false, message: 'Teknik başvurularda slug parametresi zorunludur' };
    }

    setIsSubmitting(true);
    setIsSuccess(false);
    setErrorMessage(null);

    try {
      const apiUrl = type === 'general' 
        ? `${process.env.NEXT_PUBLIC_API_URL}/submissions/general`
        : `${process.env.NEXT_PUBLIC_API_URL}/submissions/technical/${slug}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: SubmissionResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Başvuru gönderilirken bir hata oluştu.');
      }

      setIsSuccess(true);
      return result;
    } catch (error) {
      console.error('Başvuru gönderim hatası:', error);
      const errorMsg = (error as Error).message || 'Başvuru gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
      setErrorMessage(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Form durumlarını sıfırlar
   */
  const resetStatus = () => {
    setIsSuccess(false);
    setErrorMessage(null);
  };

  /**
   * Admin: Başvuruları listele (server-side pagination)
   */
  const listSubmissions = async (
    params: ListSubmissionsParams = {}
  ): Promise<SubmissionListResponse> => {
    if (isFetchingSubmissions) {
      return {
        success: true,
        message: 'Zaten istek devam ediyor',
        data: submissions,
        count: pagination.count,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: pagination.totalPages,
      };
    }

    setIsFetchingSubmissions(true);
    setSubmissionsError(null);

    try {
      const auth = getAuthHeader();
      if (!auth?.Authorization) {
        setSubmissions([]);
        setPagination({ count: 0, page: 1, limit: params.limit ?? 20, totalPages: 0 });
        return {
          success: false,
          message: 'Yetkilendirme bulunamadı',
          data: [],
          count: 0,
          page: 1,
          limit: params.limit ?? 20,
          totalPages: 0,
        };
      }

      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/submissions`);
      if (params.type) url.searchParams.set('type', params.type);
      if (params.category) url.searchParams.set('category', params.category);
      if (params.status) url.searchParams.set('status', params.status);
      if (params.search) url.searchParams.set('search', params.search);
      if (typeof params.page === 'number') url.searchParams.set('page', String(params.page));
      if (typeof params.limit === 'number') url.searchParams.set('limit', String(params.limit));

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...auth,
        },
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Beklenmeyen yanıt türü. [${response.status}] ${text.slice(0, 160)}`);
      }

      const result = (await response.json()) as SubmissionListResponse;

      if (!response.ok || !result?.success) {
        const message = (result as unknown as { message?: string })?.message || 'Başvurular alınamadı.';
        throw new Error(message);
      }

      setSubmissions(Array.isArray(result.data) ? result.data : []);
      setPagination({
        count: typeof result.count === 'number' ? result.count : 0,
        page: typeof result.page === 'number' ? result.page : params.page ?? 1,
        limit: typeof result.limit === 'number' ? result.limit : params.limit ?? 20,
        totalPages: typeof result.totalPages === 'number' ? result.totalPages : 0,
      });

      return result;
    } catch (error) {
      const msg = (error as Error)?.message || 'Başvurular alınırken bir hata oluştu.';
      setSubmissionsError(msg);
      return {
        success: false,
        message: msg,
        data: [],
        count: 0,
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        totalPages: 0,
      } as SubmissionListResponse;
    } finally {
      setIsFetchingSubmissions(false);
    }
  };

  /**
   * Admin: Başvuruyu güncelle (status, reviewNotes)
   */
  const updateSubmission = async (
    id: string,
    body: UpdateSubmissionBody
  ): Promise<Pick<SubmissionResponse, 'success' | 'message'>> => {
    if (!id) return { success: false, message: 'Geçersiz başvuru ID' };
    if (isUpdatingSubmission) return { success: false, message: 'Güncelleme işlemi zaten devam ediyor' };

    setIsUpdatingSubmission(true);
    setUpdateError(null);

    try {
      const auth = getAuthHeader();
      if (!auth?.Authorization) {
        throw new Error('Yetkilendirme bulunamadı');
      }

      const payload: UpdateSubmissionBody = {};
      if (typeof body.status !== 'undefined') payload.status = body.status;
      if (typeof body.reviewNotes !== 'undefined') payload.reviewNotes = body.reviewNotes;

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/submissions/${id}`;
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...auth,
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Beklenmeyen yanıt türü. [${response.status}] ${text.slice(0, 160)}`);
      }

      const result = (await response.json()) as Pick<SubmissionResponse, 'success' | 'message'>;
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Başvuru güncellenemedi.');
      }

      // Local state'i mümkün olduğunca taze tut (optimistic-ish)
      setSubmissions((prev) => prev.map((s) => (s._id === id ? { ...s, ...payload, updatedAt: new Date().toISOString() } : s)));

      return result;
    } catch (error) {
      const msg = (error as Error)?.message || 'Başvuru güncellenemedi.';
      setUpdateError(msg);
      return { success: false, message: msg };
    } finally {
      setIsUpdatingSubmission(false);
    }
  };

  return {
    isSubmitting,
    isSuccess,
    errorMessage,
    submitApplication,
    resetStatus,
    // listing
    isFetchingSubmissions,
    submissionsError,
    submissions,
    pagination,
    listSubmissions,
    // update
    isUpdatingSubmission,
    updateError,
    updateSubmission
  };
};

export default useSubmissions;