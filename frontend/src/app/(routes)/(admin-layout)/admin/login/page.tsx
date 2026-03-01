import { Suspense } from 'react';
import AdminLogin from '@/components/pages/admin/login';

export default function AdminLoginRoute() {
    return (
        <Suspense>
            <AdminLogin />
        </Suspense>
    );
}