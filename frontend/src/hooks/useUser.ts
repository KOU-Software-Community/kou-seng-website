'use client';

import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

export type User = {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'web' | 'ai' | 'game';
  createdAt: string;
};

export type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'web' | 'ai' | 'game';
};

export type UpdateUserRequest = {
  name: string;
  email: string;
  role: 'admin' | 'web' | 'ai' | 'game';
};

export type UserResponse = {
  success: boolean;
  message: string;
};

interface UseUserReturn {
  users: User[];
  isFetchingUsers: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  errorMessage: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (data: CreateUserRequest) => Promise<boolean>;
  updateUser: (id: string, data: UpdateUserRequest) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
}

/**
 * Kullanıcı yönetimi için özel hook
 * @returns Kullanıcı CRUD işlemleri ve durum bilgileri
 */
export const useUser = (): UseUserReturn => {
  const { getAuthHeader } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Tüm kullanıcıları getir
   */
  const fetchUsers = useCallback(async (): Promise<void> => {
    if (isFetchingUsers) return;

    setIsFetchingUsers(true);
    setErrorMessage(null);

    try {
      const auth = getAuthHeader();
      if (!auth?.Authorization) {
        setUsers([]);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...auth,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Kullanıcılar getirilemedi.');
      }

      const data: User[] = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = (error as Error)?.message || 'Kullanıcılar getirilirken bir hata oluştu.';
      setErrorMessage(message);
      setUsers([]);
    } finally {
      setIsFetchingUsers(false);
    }
  }, [getAuthHeader, isFetchingUsers]);

  /**
   * Yeni kullanıcı oluştur
   */
  const createUser = async (data: CreateUserRequest): Promise<boolean> => {
    if (isCreating) return false;

    setIsCreating(true);
    setErrorMessage(null);

    try {
      const auth = getAuthHeader();
      if (!auth?.Authorization) {
        throw new Error('Yetkilendirme bulunamadı');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...auth,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Kullanıcı oluşturulamadı.');
      }

      // Listeyi yenile
      await fetchUsers();
      return true;
    } catch (error) {
      const message = (error as Error)?.message || 'Kullanıcı oluşturulurken bir hata oluştu.';
      setErrorMessage(message);
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Kullanıcıyı güncelle
   */
  const updateUser = async (id: string, data: UpdateUserRequest): Promise<boolean> => {
    if (!id || isUpdating) return false;

    setIsUpdating(true);
    setErrorMessage(null);

    try {
      const auth = getAuthHeader();
      if (!auth?.Authorization) {
        throw new Error('Yetkilendirme bulunamadı');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...auth,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Kullanıcı güncellenemedi.');
      }

      // Listeyi yenile
      await fetchUsers();
      return true;
    } catch (error) {
      const message = (error as Error)?.message || 'Kullanıcı güncellenirken bir hata oluştu.';
      setErrorMessage(message);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Kullanıcıyı sil
   */
  const deleteUser = async (id: string): Promise<boolean> => {
    if (!id || isDeleting) return false;

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const auth = getAuthHeader();
      if (!auth?.Authorization) {
        throw new Error('Yetkilendirme bulunamadı');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          ...auth,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Kullanıcı silinemedi.');
      }

      // Listeyi yenile
      await fetchUsers();
      return true;
    } catch (error) {
      const message = (error as Error)?.message || 'Kullanıcı silinirken bir hata oluştu.';
      setErrorMessage(message);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    users,
    isFetchingUsers,
    isCreating,
    isUpdating,
    isDeleting,
    errorMessage,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};

export default useUser;

