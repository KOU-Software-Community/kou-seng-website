import ApplyDetail from '@/components/pages/applyDetail';

export default async function ApplyRoute({ params }: { params: { applySlug: string } }) {
    const resolvedParams = await Promise.resolve(params);
    const applySlug = resolvedParams.applySlug;
    return <ApplyDetail slug={applySlug} />;
}