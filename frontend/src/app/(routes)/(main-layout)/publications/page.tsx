import { notFound } from 'next/navigation';
import Publications from '@/components/pages/publications';
import { RSS_ENABLED } from '@/lib/utils';

export default function PublicationsRoute() {
    if (!RSS_ENABLED) notFound();
    return <Publications />;
}
