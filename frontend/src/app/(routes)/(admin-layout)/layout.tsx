import EmptyLayout from '@/layouts/EmptyLayout';

export default function RoutesLayout({ children }: { children: React.ReactNode }) {
    return (
        <EmptyLayout>
            {children}
        </EmptyLayout>
    );
}