'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminIndexPage() {
    const router = useRouter();

    useEffect(() => {
        let token: string | null = null;
        try {
            token = window.localStorage.getItem('auth_token');
        } catch {
            // localStorage erişilemez
        }

        if (token) {
            router.replace('/admin/dashboard');
        } else {
            router.replace('/admin/login');
        }
    }, [router]);

    return null;
}
