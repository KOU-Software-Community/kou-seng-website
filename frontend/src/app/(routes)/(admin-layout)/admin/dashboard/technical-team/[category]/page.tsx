import AdminTechnicalTeam from '@/components/pages/admin/technical-team';

export default async function AdminTechnicalTeamRoute({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    return <AdminTechnicalTeam category={category} />;
}