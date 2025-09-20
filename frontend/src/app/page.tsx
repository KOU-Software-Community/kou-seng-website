import MainLayout from '@/layouts/MainLayout';
import Home from '@/components/pages/home';
import { getHomeData } from '@/lib/homeData';

export default async function RootPage() {
  const homeData = await getHomeData();

  return (
    <MainLayout>
      <Home homeData={homeData} />
    </MainLayout>
  );
}