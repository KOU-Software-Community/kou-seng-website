'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import useAnnouncements, { type Announcement } from '@/hooks/useAnnouncements';
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RichTextEditor, type RichTextEditorRef } from '@/components/layout/rich-text-editor';
import { Separator } from '@/components/ui/separator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faEye, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Form validation schema (removed author from user input)
const announcementSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir'),
  summary: z.string().min(1, 'Özet gereklidir'),
  content: z.string().min(1, 'İçerik gereklidir'),
  category: z.string().min(1, 'Kategori gereklidir'),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Simple HTML sanitizer for allowed tags
const sanitizeHTML = (html: string): string => {
  if (!html) return '';

  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Allowed tags and their attributes
  const allowedTags = ['p', 'br', 'ul', 'ol', 'li', 'strong', 'b'];
  const allowedAttributes: string[] = [];

  // Recursive function to clean nodes
  const cleanNode = (node: Node): Node | null => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.cloneNode(true);
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();

      if (!allowedTags.includes(tagName)) {
        // Convert disallowed tags to text or remove them
        const textNode = document.createTextNode(element.textContent || '');
        return textNode;
      }

      // Create new clean element
      const cleanElement = document.createElement(tagName);

      // Copy allowed attributes (none for our use case)
      allowedAttributes.forEach(attr => {
        if (element.hasAttribute(attr)) {
          cleanElement.setAttribute(attr, element.getAttribute(attr) || '');
        }
      });

      // Recursively clean children
      Array.from(element.childNodes).forEach(child => {
        const cleanChild = cleanNode(child);
        if (cleanChild) {
          cleanElement.appendChild(cleanChild);
        }
      });

      return cleanElement;
    }

    return null;
  };

  // Clean all child nodes
  const cleanDiv = document.createElement('div');
  Array.from(tempDiv.childNodes).forEach(child => {
    const cleanChild = cleanNode(child);
    if (cleanChild) {
      cleanDiv.appendChild(cleanChild);
    }
  });

  return cleanDiv.innerHTML;
};

export default function AdminAnnouncements() {
  const { isAuthenticated, getAuthDetail } = useAuth();
  const {
    announcements,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalCount,
    searchInput,
    setSearchInput,
    handleSearch,
    nextPage,
    prevPage,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    isCreating,
    isUpdating,
    isDeleting
  } = useAnnouncements(3);

  // Current user state
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Rich text editor ref for proper reset control
  const editorRef = useRef<RichTextEditorRef>(null);

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  // Form state
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema)
  });

  const watchedContent = watch('content');

  // Fetch current user information on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userDetail = await getAuthDetail();
        if ('name' in userDetail) {
          setCurrentUser(userDetail.name);
        }
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    };

    if (isAuthenticated) {
      fetchCurrentUser();
    }
  }, [isAuthenticated, getAuthDetail]);

  // Handle create - automatically add current user as author
  const handleCreate = async (data: AnnouncementFormData) => {
    if (!currentUser) {
      console.error('Current user not found');
      return;
    }

    const announcementData = {
      ...data,
      author: currentUser
    };

    const success = await createAnnouncement(announcementData);
    if (success) {
      setCreateOpen(false);
      setSelectedAnnouncement(null);
      reset();
      editorRef.current?.reset(); // Explicit editor reset
    }
  };

  // Handle edit - automatically update author to current user
  const handleEdit = async (data: AnnouncementFormData) => {
    if (!selectedAnnouncement || !currentUser) return;

    const announcementData = {
      ...data,
      author: currentUser
    };

    const success = await updateAnnouncement(selectedAnnouncement._id, announcementData);
    if (success) {
      setEditOpen(false);
      setSelectedAnnouncement(null);
      reset();
      editorRef.current?.reset(); // Explicit editor reset
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedAnnouncement) return;
    const success = await deleteAnnouncement(selectedAnnouncement._id);
    if (success) {
      setDeleteOpen(false);
      setSelectedAnnouncement(null);
    }
  };

  // Open create dialog - ensure clean state
  const openCreateDialog = () => {
    // Clear any existing selection first
    setSelectedAnnouncement(null);
    // Reset form to empty state
    reset({
      title: '',
      summary: '',
      content: '',
      category: '',
    });
    // Explicitly reset editor
    editorRef.current?.reset();
    setCreateOpen(true);
  };

  // Open edit dialog - load specific announcement data
  const openEditDialog = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    // Load announcement data into form
    reset({
      title: announcement.title,
      summary: announcement.summary,
      content: announcement.content,
      category: announcement.category,
    });
    setEditOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setDeleteOpen(true);
  };

  // Open view dialog
  const openViewDialog = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setViewOpen(true);
  };

  // Close all dialogs - ensure clean state
  const closeDialogs = () => {
    setCreateOpen(false);
    setEditOpen(false);
    setDeleteOpen(false);
    setViewOpen(false);
    setSelectedAnnouncement(null);
    reset({
      title: '',
      summary: '',
      content: '',
      category: '',
    });
    editorRef.current?.reset(); // Explicit editor reset
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto my-8">
        <CardContent className="text-center p-6">
          <p className="text-muted-foreground">Bu sayfaya erişim için giriş yapmanız gerekiyor.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex justify-center w-full">
        <div className="flex w-full max-w-2xl items-center gap-3">
          <div className="relative flex-1">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
            />
            <Input
              placeholder="Duyuru başlığı veya özette ara... (Enter'a basın)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearch}
              className="pl-10"
              aria-label="Duyuru arama"
            />
          </div>
          <Button className="cursor-pointer" onClick={openCreateDialog} aria-label="Yeni duyuru oluştur">
            <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
            Yeni Duyuru
          </Button>
        </div>
      </div>

      <Separator />

      {/* Loading and Error States */}
      {isLoading && (
        <Card>
          <CardContent className="text-center p-8">
            <FontAwesomeIcon icon={faSpinner} className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground mt-2">Duyurular yükleniyor...</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className="text-center p-8">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Announcements List */}
      {!isLoading && !error && (
        <>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Toplam duyuru: {totalCount}</span>
          </div>

          <div className="grid gap-4">
            {announcements.length === 0 ? (
              <Card>
                <CardContent className="text-center p-8">
                  <p className="text-muted-foreground">Henüz duyuru bulunmuyor.</p>
                </CardContent>
              </Card>
            ) : (
              announcements.map((announcement) => (
                <Card key={announcement._id} className="gap-0">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {announcement.category} • {announcement.author || 'Bulunamadı'} • {formatDate(announcement.createdAt)}
                        </p>
                      </div>
                      <CardAction>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="cursor-pointer"
                            onClick={() => openViewDialog(announcement)}
                          >
                            <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="cursor-pointer"
                            onClick={() => openEditDialog(announcement)}
                          >
                            <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-white hover:bg-destructive cursor-pointer"
                            onClick={() => openDeleteDialog(announcement)}
                          >
                            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardAction>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">{announcement.summary}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Pagination */}

          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={prevPage}
              disabled={currentPage <= 1}
              aria-label="Önceki sayfa"
            >
              Önceki
            </Button>
            <div className="text-sm text-muted-foreground">
              Sayfa {currentPage} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={nextPage}
              disabled={currentPage >= totalPages}
              aria-label="Sonraki sayfa"
            >
              Sonraki
            </Button>
          </div>

        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={createOpen || editOpen} onOpenChange={closeDialogs}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {createOpen ? 'Yeni Duyuru Oluştur' : 'Duyuru Düzenle'}
            </DialogTitle>
            <DialogDescription>
              {createOpen
                ? 'Yeni bir duyuru oluşturmak için gerekli bilgileri doldurun.'
                : 'Duyuru bilgilerini düzenleyin.'
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(createOpen ? handleCreate : handleEdit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Duyuru başlığı"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Input
                id="category"
                {...register('category')}
                placeholder="Örn: Duyuru, Haber, Etkinlik"
              />
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Özet</Label>
              <Input
                id="summary"
                {...register('summary')}
                placeholder="Duyuru özeti (kısa açıklama)"
              />
              {errors.summary && (
                <p className="text-sm text-destructive">{errors.summary.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">İçerik</Label>
              <RichTextEditor
                ref={editorRef}
                value={watchedContent || ''}
                onChange={(value) => setValue('content', value)}
                placeholder="Duyuru içeriğini yazın..."
                className="min-h-48"
              />
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button className="cursor-pointer" type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 mr-2 animate-spin" />
                    {createOpen ? 'Oluşturuluyor...' : 'Güncelleniyor...'}
                  </>
                ) : (
                  createOpen ? 'Oluştur' : 'Güncelle'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={closeDialogs}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAnnouncement?.title}</DialogTitle>
            <DialogDescription>
              {selectedAnnouncement?.category} • {selectedAnnouncement && formatDate(selectedAnnouncement.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedAnnouncement && (
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Yazar:</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedAnnouncement.author || 'Bulunamadı'}</p>
              </div>
              <div>
                <Label className="font-semibold">Özet:</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedAnnouncement.summary}</p>
              </div>
              <Separator />
              <div>
                <Label className="font-semibold">İçerik:</Label>
                <div
                  className="mt-2 text-sm rich-html"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(selectedAnnouncement.content) }}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedAnnouncement && (
              <Button className="cursor-pointer" type="button" onClick={() => {
                closeDialogs();
                openEditDialog(selectedAnnouncement);
              }}>
                <FontAwesomeIcon icon={faEdit} className="h-4 w-4 mr-2" />
                Düzenle
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={closeDialogs}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duyuru Sil</DialogTitle>
            <DialogDescription>
              Bu duyuruyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>

          {selectedAnnouncement && (
            <div className="space-y-2">
              <p className="font-semibold">{selectedAnnouncement.title}</p>
              <p className="text-sm text-muted-foreground">{selectedAnnouncement.summary}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              className="cursor-pointer"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 mr-2 animate-spin" />
                  Siliniyor...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faTrash} className="h-4 w-4 mr-2" />
                  Sil
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}