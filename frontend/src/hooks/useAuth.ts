'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type LoginRequestBody = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
};

export type AuthUser = {
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export type AuthError = {
  message: string;
  error: string;
};

export type UseAuthReturn = {
  token: string | null;
  isAuthenticating: boolean;
  errorMessage: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getAuthHeader: () => Record<string, string>;
  getAuthDetail: () => Promise<AuthUser | AuthError>;
};

const AUTH_TOKEN_KEY = 'auth_token';

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

const setStoredToken = (token: string | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch {
    // storage erişimi başarısız olabilir; sessizce geç
  }
};

export const useAuth = (): UseAuthReturn => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const existingToken = getStoredToken();
    if (existingToken) setToken(existingToken);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsAuthenticating(true);
    setErrorMessage(null);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
      const body: LoginRequestBody = { email, password };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        // Sunucudan mesaj dönmüyorsa genel mesaj göster
        let message = 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol ediniz.';
        try {
          const data = (await response.json()) as Partial<LoginResponse> & { message?: string };
          if (data && typeof data.message === 'string') message = data.message;
        } catch {
          // ignore json parse error
        }
        throw new Error(message);
      }

      const data: LoginResponse = await response.json();
      if (!data?.token) {
        throw new Error('Geçersiz yanıt alındı. Lütfen daha sonra tekrar deneyin.');
      }

      setStoredToken(data.token);
      setToken(data.token);
      return true;
    } catch (error) {
      const message = (error as Error).message || 'Giriş sırasında beklenmeyen bir hata oluştu.';
      setErrorMessage(message);
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const logout = useCallback(() => {
    setStoredToken(null);
    setToken(null);
  }, []);

  const getAuthHeader = useCallback((): Record<string, string> => {
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }, [token]);

  const getAuthDetail = useCallback(async (): Promise<AuthUser | AuthError> => {
    if (!token) {
      return { message: 'Not authorized, token missing', error: 'missing token' };
    }

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/me`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          ...getAuthHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Sunucunun döndürebileceği hata yapısına göre uyarı döndür
        const message = typeof data?.message === 'string' ? data.message : 'Not authorized, token failed';
        const error = typeof data?.error === 'string' ? data.error : 'invalid signature';
        return { message, error } as AuthError;
      }

      return data as AuthUser;
    } catch {
      return { message: 'Not authorized, token failed', error: 'invalid signature' };
    }
  }, [getAuthHeader, token]);

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  return {
    token,
    isAuthenticating,
    errorMessage,
    isAuthenticated,
    login,
    logout,
    getAuthHeader,
    getAuthDetail,
  };
};

export default useAuth;


