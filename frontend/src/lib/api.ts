// RSS feed item type
export type RssItem = {
  title: string;
  link: string;
  excerpt: string;
  author: string;
  date: string;
  coverImage?: string;
  categories?: string[];
};

// Announcement type
export type Announcement = {
  _id: string;
  title: string;
  summary: string;
  category: string;
  createdAt: string;
  content?: string;
  author?: string;
  updatedAt?: string;
};

// RSS Feed API Response
type RssFeedResponse = {
  success: boolean;
  data: {
    items: RssItem[];
  };
  error?: string;
};

// Announcements API Response
type AnnouncementsResponse = {
  success: boolean;
  message: string;
  data: Announcement[];
  count: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
};

// Server-side RSS feed fetch function
export async function fetchRssFeed(): Promise<{ items: RssItem[]; isLoading: boolean; error: string | null }> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/rss`;
    const response = await fetch(apiUrl, {
      // Server-side'da cache kontrolü
      next: { revalidate: 300 }, // 5 dakika cache
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: RssFeedResponse = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return {
      items: data.data.items || [],
      isLoading: false,
      error: null
    };
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return {
      items: [],
      isLoading: false,
      error: 'RSS verilerini çekerken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
    };
  }
}

// Server-side announcements fetch function
export async function fetchAnnouncements(limit: number = 10): Promise<{ announcements: Announcement[]; isLoading: boolean; error: string | null }> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/announcements?page=1&limit=${limit}`;
    const response = await fetch(apiUrl, {
      // Server-side'da cache kontrolü
      next: { revalidate: 60 }, // 1 dakika cache
    });

    if (!response.ok) {
      throw new Error('Duyurular yüklenirken bir hata oluştu.');
    }

    const data: AnnouncementsResponse = await response.json();

    if (data.success) {
      return {
        announcements: data.data || [],
        isLoading: false,
        error: null
      };
    } else {
      throw new Error(data.message || 'Duyurular yüklenirken bir hata oluştu.');
    }
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return {
      announcements: [],
      isLoading: false,
      error: 'Duyurular yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
    };
  }
}
