'use client';

import { useCallback, useEffect, useState } from 'react';

type LoginRequestBody = {
  email: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
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
  isAuthenticating: boolean;
  errorMessage: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getAuthDetail: () => Promise<AuthUser | AuthError>;
  /** Başarılıysa null, değilse gösterilecek hata mesajı döner. */
  changePassword: (currentPassword: string, newPassword: string) => Promise<string | null>;
};

// Oturum token'ı backend'in koyduğu httpOnly çerezde; JS onu okuyamaz. Burada
// yalnızca "giriş yapıldı" işareti tutulur (gizli değil), sayfalar oturum varken
// istek atsın diye. Asıl kontrol her istekte backend'de.
const SESSION_FLAG_KEY = 'auth_session';
const LEGACY_TOKEN_KEY = 'auth_token';

/** Yeni şifreler için alt sınır; backend'deki MIN_PASSWORD_LENGTH ile aynı olmalı. */
export const MIN_PASSWORD_LENGTH = 10;

/** API isteği; oturum çerezi gönderilir. */
export const apiFetch = (input: string, init: RequestInit = {}) =>
  fetch(input, { ...init, credentials: 'include' });

export const hasSession = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(SESSION_FLAG_KEY) === '1';
  } catch {
    return false;
  }
};

export const setSession = (active: boolean) => {
  if (typeof window === 'undefined') return;
  try {
    // Eski sürümün localStorage'da bıraktığı token silinir
    window.localStorage.removeItem(LEGACY_TOKEN_KEY);
    if (active) {
      window.localStorage.setItem(SESSION_FLAG_KEY, '1');
    } else {
      window.localStorage.removeItem(SESSION_FLAG_KEY);
    }
  } catch {
    // storage erişimi başarısız olabilir; sessizce geç
  }
};

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (hasSession()) setIsAuthenticated(true);
    else setSession(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsAuthenticating(true);
    setErrorMessage(null);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
      const body: LoginRequestBody = { email, password };

      const response = await apiFetch(apiUrl, {
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
      if (!data?.success) {
        throw new Error('Geçersiz yanıt alındı. Lütfen daha sonra tekrar deneyin.');
      }

      setSession(true);
      setIsAuthenticated(true);
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
    // Çerez httpOnly; yalnızca backend silebilir
    void apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, { method: 'POST' }).catch(() => {});
    setSession(false);
    setIsAuthenticated(false);
  }, []);

  const getAuthDetail = useCallback(async (): Promise<AuthUser | AuthError> => {
    if (!isAuthenticated) {
      return { message: 'Not authorized, token missing', error: 'missing token' };
    }

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/me`;
      const response = await apiFetch(apiUrl, { method: 'GET' });

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
  }, [isAuthenticated]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<string | null> => {
    try {
      const response = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (response.ok) return null;
      const data = await response.json().catch(() => null);
      return typeof data?.message === 'string' ? data.message : 'Şifre değiştirilemedi.';
    } catch {
      return 'Şifre değiştirilemedi. Bağlantınızı kontrol edin.';
    }
  }, []);

  return {
    isAuthenticating,
    errorMessage,
    isAuthenticated,
    login,
    logout,
    getAuthDetail,
    changePassword,
  };
};

export default useAuth;


