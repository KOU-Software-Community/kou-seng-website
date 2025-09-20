import About from '@/components/pages/about';
import { getAboutData } from '@/lib/aboutData';

export default async function AboutRoute() {
    const data = await getAboutData();
    
    return <About data={data} />;
}