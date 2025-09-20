import MainLayout from '@/layouts/MainLayout';
import Home from '@/components/pages/home';
import { getHomeData } from '@/lib/homeData';
import { fetchRssFeed, fetchAnnouncements } from '@/lib/api';

export default async function RootPage() {
  // Server-side'da verileri çek
  const [homeData, rssData, announcementsData] = await Promise.all([
    getHomeData(),
    fetchRssFeed(),
    fetchAnnouncements(2)
  ]);

  // İlk 3 makaleyi al
  const articles = rssData.items.slice(0, 3);

  return (
    <MainLayout>
      <Home 
        homeData={homeData}
        articles={articles}
        announcements={announcementsData.announcements}
        rssLoading={rssData.isLoading}
        rssError={rssData.error}
        announcementsLoading={announcementsData.isLoading}
        announcementsError={announcementsData.error}
      />
    </MainLayout>
  );
}