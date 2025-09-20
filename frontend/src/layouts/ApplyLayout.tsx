import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface ApplyLayoutProps {
    children: React.ReactNode;
}

export default function ApplyLayout({ children }: ApplyLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b py-4">
                <div className="container flex justify-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                    >
                        <Link href="/apply" className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                            Geri Dön
                        </Link>
                    </Button>
                </div>
            </header>
            
            <main className="flex-1 px-4 sm:px-6 md:px-8">
                {children}
            </main>
        </div>
    );
}