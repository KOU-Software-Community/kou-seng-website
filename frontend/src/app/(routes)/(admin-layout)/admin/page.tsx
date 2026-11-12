'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hasSession } from '@/hooks/useAuth';

export default function AdminIndexPage() {
    const router = useRouter();

    useEffect(() => {
        if (hasSession()) {
            router.replace('/admin/dashboard');
        } else {
            router.replace('/admin/login');
        }
    }, [router]);

    return null;
}
