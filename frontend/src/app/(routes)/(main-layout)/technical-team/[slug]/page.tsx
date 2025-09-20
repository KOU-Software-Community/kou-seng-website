import TeamDetail from '@/components/pages/teamDetail';
import { getTeamDetail } from '@/lib/teamData';
import { notFound } from 'next/navigation';

export default async function TeamDetailRoute({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    const team = await getTeamDetail(slug);
    
    if (!team) {
        notFound();
    }
    
    return <TeamDetail team={team} />;
}