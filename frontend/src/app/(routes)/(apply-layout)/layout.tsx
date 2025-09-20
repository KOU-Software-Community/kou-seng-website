import ApplyLayout from '@/layouts/ApplyLayout';

export default function RoutesLayout({ children }: { children: React.ReactNode }) {
    return (
        <ApplyLayout>
            {children}
        </ApplyLayout>
    );
}