import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            {children}
            <Footer />
        </div>
    );
}