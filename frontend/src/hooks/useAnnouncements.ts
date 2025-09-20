'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

// API'den dönecek olan duyuru tipini tanımlayalım
export interface Announcement {
  _id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

// Duyuru oluşturmak için kullanılacak tip
export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  summary: string;
  category: string;
  author: string;
}

// Duyuru güncellemek için kullanılacak tip
export interface UpdateAnnouncementRequest {
  title: string;
  content: string;
  summary: string;
  category: string;
  author: string;
}

// API'den dönecek olan cevap tipini tanımlayalım
interface ApiResponse {
  success: boolean;
  message: string;
  data: Announcement[];
  count: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function useAnnouncements(limit: number = 10) {
  const { getAuthHeader } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // CRUD operation states
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Duyuruları API'den çekme fonksiyonu
  const fetchAnnouncements = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/announcements?page=${page}&limit=${limit}${searchParam}`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Duyurular yüklenirken bir hata oluştu.');
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setAnnouncements(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.count);
      } else {
        throw new Error(data.message || 'Duyurular yüklenirken bir hata oluştu.');
      }
    } catch (error) {
      setError((error as Error).message);
      console.error('Duyurular yüklenirken hata oluştu:', error);
    } finally {
      setIsLoading(false);
    }
  }, [limit, searchTerm]);

  // Sayfa değiştiğinde duyuruları yeniden çek
  useEffect(() => {
    fetchAnnouncements(currentPage);
  }, [currentPage, fetchAnnouncements]);

  // Arama işlemi - sadece Enter'a basınca tetiklenir
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchTerm(e.currentTarget.value);
      setCurrentPage(1); // Arama yaparken sayfa 1'e dön
    }
  };

  // Input değerini takip etmek için ayrı state
  const [searchInput, setSearchInput] = useState('');

  // Sayfa değiştirme fonksiyonları
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Duyuru detayını gösterme
  const handleAnnouncementClick = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
  };

  // Duyuru detayını kapatma
  const closeAnnouncementDetail = () => {
    setSelectedAnnouncement(null);
  };

  // Create announcement function
  const createAnnouncement = async (data: CreateAnnouncementRequest): Promise<boolean> => {
    setIsCreating(true);
    setError(null);
    
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/announcements`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Duyuru oluşturulurken bir hata oluştu.');
      }
      
      // Refresh announcements list
      await fetchAnnouncements(currentPage);
      return true;
    } catch (error) {
      setError((error as Error).message);
      console.error('Duyuru oluşturma hatası:', error);
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  // Update announcement function
  const updateAnnouncement = async (id: string, data: UpdateAnnouncementRequest): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);
    
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/announcements/${id}`;
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Duyuru güncellenirken bir hata oluştu.');
      }
      
      // Refresh announcements list
      await fetchAnnouncements(currentPage);
      return true;
    } catch (error) {
      setError((error as Error).message);
      console.error('Duyuru güncelleme hatası:', error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete announcement function
  const deleteAnnouncement = async (id: string): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);
    
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/announcements/${id}`;
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader()
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Duyuru silinirken bir hata oluştu.');
      }
      
      // Refresh announcements list
      await fetchAnnouncements(currentPage);
      return true;
    } catch (error) {
      setError((error as Error).message);
      console.error('Duyuru silme hatası:', error);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  // Hook'tan döndürülecek değerleri hazırlayalım
  return {
    announcements,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalCount,
    searchTerm,
    searchInput,
    selectedAnnouncement,
    setSearchInput,
    handleSearch,
    goToPage,
    nextPage,
    prevPage,
    handleAnnouncementClick,
    closeAnnouncementDetail,
    refetch: () => fetchAnnouncements(currentPage),
    // CRUD operations
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    isCreating,
    isUpdating,
    isDeleting
  };
}
