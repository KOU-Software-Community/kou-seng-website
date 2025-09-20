interface EmptyLayoutProps {
    children: React.ReactNode;
}

export default function EmptyLayout({ children }: EmptyLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">            
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}