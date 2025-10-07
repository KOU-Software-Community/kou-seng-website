'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useUser, type User, type CreateUserRequest, type UpdateUserRequest } from '@/hooks/useUser';
import { useAuth, type AuthUser } from '@/hooks/useAuth';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const PAGE_SIZE = 4;

const formatRole = (role: string): string => {
    switch (role) {
        case 'admin':
            return 'Admin';
        case 'web':
            return 'Web Takımı';
        case 'ai':
            return 'AI Takımı';
        case 'game':
            return 'Oyun Takımı';
        default:
            return role;
    }
};

export default function AdminManagement() {
    const {
        users,
        isFetchingUsers,
        isCreating,
        isUpdating,
        isDeleting,
        errorMessage,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
    } = useUser();
    const { isAuthenticated, getAuthDetail } = useAuth();
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Form states
    const [formName, setFormName] = useState<string>('');
    const [formEmail, setFormEmail] = useState<string>('');
    const [formPassword, setFormPassword] = useState<string>('');
    const [formRole, setFormRole] = useState<'admin' | 'web' | 'ai' | 'game'>('web');

    // StrictMode'da çift çalışmayı önlemek için guard
    const hasFetchedRef = useRef<boolean>(false);
    useEffect(() => {
        if (hasFetchedRef.current) return;
        if (!isAuthenticated) return;
        hasFetchedRef.current = true;
        void fetchUsers();
        
        // Giriş yapmış kullanıcının bilgilerini al
        const getCurrentUserEmail = async () => {
            try {
                const authData = await getAuthDetail();
                if ('email' in authData) {
                    setCurrentUserEmail(authData.email);
                }
            } catch (error) {
                console.error('Kullanıcı bilgileri alınamadı', error);
            }
        };
        
        void getCurrentUserEmail();
    }, [isAuthenticated, fetchUsers, getAuthDetail]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const filteredUsers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return users;
        return users.filter((user) => {
            const haystack = [
                user.name,
                user.email,
                user.role,
                formatRole(user.role)
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return haystack.includes(query);
        });
    }, [users, searchQuery]);

    const totalPages = useMemo(() => {
        if (!filteredUsers.length) return 1;
        return Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
    }, [filteredUsers.length]);

    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        return filteredUsers.slice(start, end);
    }, [filteredUsers, currentPage]);

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    };

    const handleOpenCreateDialog = () => {
        setFormName('');
        setFormEmail('');
        setFormPassword('');
        setFormRole('web');
        setIsCreateDialogOpen(true);
    };

    const handleOpenEditDialog = (user: User) => {
        setSelectedUser(user);
        setFormName(user.name);
        setFormEmail(user.email);
        setFormRole(user.role);
        setIsEditDialogOpen(true);
    };

    const handleCreateUser = async () => {
        if (!formName.trim() || !formEmail.trim() || !formPassword.trim()) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }

        const data: CreateUserRequest = {
            name: formName.trim(),
            email: formEmail.trim(),
            password: formPassword.trim(),
            role: formRole,
        };

        const success = await createUser(data);
        if (success) {
            setIsCreateDialogOpen(false);
        }
    };

    const handleUpdateUser = async () => {
        if (!selectedUser) return;
        if (!formName.trim() || !formEmail.trim()) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }

        const data: UpdateUserRequest = {
            name: formName.trim(),
            email: formEmail.trim(),
            role: formRole,
        };

        const success = await updateUser(selectedUser._id, data);
        if (success) {
            setIsEditDialogOpen(false);
            setSelectedUser(null);
        }
    };

    const handleDeleteUser = async (id: string, userName: string, userEmail: string) => {
        // Kullanıcı kendi hesabını silmeye çalışıyorsa engelle
        if (currentUserEmail === userEmail) {
            alert('Kendi hesabınızı silemezsiniz.');
            return;
        }
        
        const confirmed = window.confirm(`"${userName}" kullanıcısını silmek istediğinize emin misiniz?`);
        if (!confirmed) return;
        await deleteUser(id);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-center items-center gap-3">
                <Input
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Ara: isim, e-posta, rol"
                    aria-label="Kullanıcılarda ara"
                    className="max-w-md"
                />
                <Button
                    variant="default"
                    onClick={handleOpenCreateDialog}
                    className="cursor-pointer"
                    aria-label="Yeni kullanıcı ekle"
                >
                    Yeni Kullanıcı Ekle
                </Button>
            </div>

            <Separator />

            {errorMessage && (
                <div className="rounded-md bg-destructive/10 text-destructive px-3 py-2 text-sm" role="alert">
                    {errorMessage}
                </div>
            )}

            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Toplam kullanıcı: {filteredUsers.length}</span>
            </div>

            <div className="grid gap-3">
                {isFetchingUsers && !users.length ? (
                    <div className="text-sm text-muted-foreground">Yükleniyor...</div>
                ) : paginatedUsers.length ? (
                    paginatedUsers.map((user) => (
                        <Card key={user._id} className="gap-0">
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <CardTitle className="truncate">
                                            {user.name}
                                        </CardTitle>
                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                            <span className="truncate max-w-[18rem]" title={user.email}>{user.email}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs text-primary font-medium"
                                            aria-label={`Rol: ${formatRole(user.role)}`}
                                        >
                                            {formatRole(user.role)}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardFooter className="flex items-center justify-end gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="cursor-pointer"
                                    onClick={() => handleOpenEditDialog(user)}
                                    disabled={isUpdating}
                                    aria-label="Kullanıcıyı düzenle"
                                >
                                    Düzenle
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="cursor-pointer"
                                    onClick={() => handleDeleteUser(user._id, user.name, user.email)}
                                    disabled={isDeleting || (currentUserEmail === user.email)}
                                    aria-label="Kullanıcıyı sil"
                                >
                                    {isDeleting ? 'Siliniyor...' : 'Sil'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="text-sm text-muted-foreground">Kullanıcı bulunamadı.</div>
                )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                    className='cursor-pointer'
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1}
                    aria-label="Önceki sayfa"
                >
                    Önceki
                </Button>
                <div className="text-sm text-muted-foreground">
                    Sayfa {currentPage} / {totalPages}
                </div>
                <Button
                    className='cursor-pointer'
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                    aria-label="Sonraki sayfa"
                >
                    Sonraki
                </Button>
            </div>

            {/* Yeni Kullanıcı Oluşturma Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent aria-describedby={undefined} className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
                        <DialogDescription>
                            Sisteme yeni bir kullanıcı ekleyin.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="create-name">Ad Soyad</Label>
                            <Input
                                id="create-name"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                placeholder="Örn: Metehan Şenyer"
                                aria-label="Kullanıcı adı"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="create-email">E-posta</Label>
                            <Input
                                id="create-email"
                                type="email"
                                value={formEmail}
                                onChange={(e) => setFormEmail(e.target.value)}
                                placeholder="ornek@email.com"
                                aria-label="E-posta adresi"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="create-password">Şifre</Label>
                            <Input
                                id="create-password"
                                type="password"
                                value={formPassword}
                                onChange={(e) => setFormPassword(e.target.value)}
                                placeholder="Güçlü bir şifre girin"
                                aria-label="Şifre"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="create-role">Rol</Label>
                            <select
                                id="create-role"
                                className="h-9 rounded-md border bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                value={formRole}
                                onChange={(e) => setFormRole(e.target.value as 'admin' | 'web' | 'ai' | 'game')}
                                aria-label="Kullanıcı rolü"
                            >
                                <option value="admin">Admin</option>
                                <option value="web">Web Takımı</option>
                                <option value="ai">AI Takımı</option>
                                <option value="game">Oyun Takımı</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsCreateDialogOpen(false)}
                            className="cursor-pointer"
                            aria-label="İptal"
                        >
                            İptal
                        </Button>
                        <Button
                            onClick={handleCreateUser}
                            disabled={isCreating}
                            className="cursor-pointer"
                            aria-label="Oluştur"
                        >
                            {isCreating ? 'Oluşturuluyor...' : 'Oluştur'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Kullanıcı Düzenleme Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent aria-describedby={undefined} className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Kullanıcıyı Düzenle</DialogTitle>
                        <DialogDescription>
                            Kullanıcı bilgilerini güncelleyin.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Ad Soyad</Label>
                            <Input
                                id="edit-name"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                placeholder="Örn: Ahmet Yılmaz"
                                aria-label="Kullanıcı adı"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-email">E-posta</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={formEmail}
                                onChange={(e) => setFormEmail(e.target.value)}
                                placeholder="ornek@email.com"
                                aria-label="E-posta adresi"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-role">Rol</Label>
                            {selectedUser?.email === currentUserEmail && (
                                <div className="text-sm text-red-500 mb-1">
                                    Kendi hesabınızın rolünü değiştiremezsiniz.
                                </div>
                            )}
                            <select
                                id="edit-role"
                                className="h-9 rounded-md border bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                value={formRole}
                                onChange={(e) => setFormRole(e.target.value as 'admin' | 'web' | 'ai' | 'game')}
                                disabled={selectedUser?.email === currentUserEmail}
                                aria-label="Kullanıcı rolü"
                            >
                                <option value="admin">Admin</option>
                                <option value="web">Web Takımı</option>
                                <option value="ai">AI Takımı</option>
                                <option value="game">Oyun Takımı</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsEditDialogOpen(false);
                                setSelectedUser(null);
                            }}
                            className="cursor-pointer"
                            aria-label="İptal"
                        >
                            İptal
                        </Button>
                        <Button
                            onClick={handleUpdateUser}
                            disabled={isUpdating}
                            className="cursor-pointer"
                            aria-label="Güncelle"
                        >
                            {isUpdating ? 'Güncelleniyor...' : 'Güncelle'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}