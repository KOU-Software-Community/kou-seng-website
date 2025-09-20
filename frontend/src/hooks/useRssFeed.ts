import { useState, useEffect } from 'react';

type CustomItem = {
  title: string;
  link: string;
  author: string;
  date: string;
  categories: string[];
  coverImage: string;
  excerpt: string;
  source: string;
};

type RssFeedResult = {
  items: CustomItem[];
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
};

export const useRssFeed = (): RssFeedResult => {
  const [items, setItems] = useState<CustomItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  useEffect(() => {
    const fetchRssFeed = async () => {
      try {
        setIsLoading(true);
        
        const url = `${process.env.NEXT_PUBLIC_API_URL}/rss`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        const feedItems = data.data?.items || [];
        setItems(feedItems);
        setIsEmpty(feedItems.length === 0);
        setError(null);
      } catch (err) {
        console.error('Error fetching RSS feed:', err);
        setError('RSS verilerini çekerken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRssFeed();
  }, []);

  return { items, isLoading, error, isEmpty };
};

