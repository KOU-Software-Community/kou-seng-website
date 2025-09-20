import MainLayout from '@/layouts/MainLayout';

export default function RoutesLayout({ children }: { children: React.ReactNode }) {
    return (
        <MainLayout>
            {children}
        </MainLayout>
    );
}