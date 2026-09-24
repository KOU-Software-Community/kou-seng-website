import type { Metadata } from 'next';
import Kvkk from '@/components/pages/kvkk';
import { getKvkkData } from '@/lib/kvkkData';

export const metadata: Metadata = {
    title: 'KVKK Aydınlatma Metni - KOU SENG',
};

export default async function KvkkRoute() {
    const data = await getKvkkData();

    return <Kvkk data={data} />;
}
