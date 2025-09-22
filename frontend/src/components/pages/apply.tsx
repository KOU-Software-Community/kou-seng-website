'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faLock, faClock, faUsers, faCode, faLaptopCode, faRobot } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// İkon eşleştirme fonksiyonu
const getIconByName = (iconName: string) => {
    switch(iconName) {
        case 'faUsers':
            return faUsers;
        case 'faLaptopCode':
            return faLaptopCode;
        case 'faRobot':
            return faRobot;
        case 'faCode':
            return faCode;
        default:
            return faCode;
    }
};

// Uygulama tipi için arayüz
interface Application {
    id: number;
    slug: string;
    title: string;
    description: string;
    isOpen: boolean;
    deadline: string;
    type: string;
    icon: string;
}

export default function Apply() {
    const [applications, setApplications] = useState<(Application & {icon: IconDefinition})[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');
    
    // JSON dosyasından başvuru verilerini yükleme
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await fetch('/data/applications/index.json');
                if (!response.ok) {
                    throw new Error('Başvuru verileri yüklenemedi');
                }
                
                const data = await response.json();
                
                const applicationsWithIcons = data.map((app: Application) => ({
                    ...app,
                    icon: getIconByName(app.icon)
                }));
                
                setApplications(applicationsWithIcons);
            } catch (error) {
                console.error('Başvuru verileri alınırken hata:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchApplications();
    }, []);
    
    const filteredApplications = applications.filter(app => {
        if (filter === 'open') return app.isOpen;
        if (filter === 'closed') return !app.isOpen;
        return true; // 'all' durumunda tüm başvuruları göster
    });

    return (
        <main className="flex flex-col gap-8 pt-8 pb-16">
            {/* Başlık ve Açıklama */}
            <section className="container">
                <div className="mb-8 mx-auto text-center max-w-3xl">
                    <h2 className="mb-3 text-3xl font-bold tracking-tight">Başvurular</h2>
                    <p className="mx-auto max-w-2xl text-muted-foreground">
                        Yazılım Kulübü&apos;ne üyelik ve teknik takımlar için açık başvurularımızı inceleyebilirsiniz.
                        Kulübe üye olmak veya teknik takımlarımızda yer almak için aşağıdaki formlardan size uygun olanı doldurabilirsiniz.
                    </p>
                </div>
            </section>

            {/* Filtreleme Düğmeleri */}
            <section className="container">
                <div className="flex justify-center gap-4 mb-6">
                    <Button 
                        variant={filter === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilter('all')}
                        className="min-w-24"
                    >
                        Tümü
                    </Button>
                    <Button 
                        variant={filter === 'open' ? 'default' : 'outline'} 
                        onClick={() => setFilter('open')}
                        className="min-w-24"
                    >
                        <FontAwesomeIcon icon={faCheck} className="mr-2" />
                        Açık
                    </Button>
                    <Button 
                        variant={filter === 'closed' ? 'default' : 'outline'} 
                        onClick={() => setFilter('closed')}
                        className="min-w-24"
                    >
                        <FontAwesomeIcon icon={faLock} className="mr-2" />
                        Kapalı
                    </Button>
                </div>
            </section>

            {/* Başvuru Kartları */}
            <section className="container">
                <div className="mx-auto max-w-6xl grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                    {isLoading ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-muted-foreground">Başvurular yükleniyor...</p>
                        </div>
                    ) : filteredApplications.length > 0 ? (
                        filteredApplications.map((application) => (
                            <Card key={application.id} className="overflow-hidden transition-all hover:shadow-md">
                                <CardHeader className="pb-4">
                                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                                        <FontAwesomeIcon icon={application.icon} className="h-6 w-6" />
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl">{application.title}</CardTitle>
                                            <CardDescription className="mt-1">
                                                {application.description}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center text-muted-foreground">
                                                <FontAwesomeIcon icon={faClock} className="mr-2 h-4 w-4" />
                                                Son Başvuru: {application.deadline}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        {application.isOpen ? (
                                            <Button 
                                                asChild
                                                variant="default"
                                            >
                                                <Link href={`/apply/${application.slug}`}>
                                                    Başvur
                                                </Link>
                                            </Button>
                                        ) : (
                                            <Button 
                                                disabled
                                                variant="outline"
                                                className="cursor-not-allowed"
                                            >
                                                Başvuru Kapalı
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-muted-foreground">Seçtiğiniz filtreye uygun başvuru bulunamadı.</p>
                        </div>
                    )}
                </div>
            </section>
            
            {/* Bilgilendirme */}
            <section className="container mt-8">
                <Card className="bg-muted/50">
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            <h3 className="text-lg font-medium">Başvuru Süreci Hakkında</h3>
                            <p className="text-muted-foreground">
                                Kulüp üyelik başvurusu yapan öğrenciler, kulüp etkinliklerinden haberdar 
                                olabilmeleri için WhatsApp grubuna eklenecektir.
                                <br /><br />
                                Teknik takım başvurularında mülakat süreci olabilir. Bu başvurular kulüp 
                                yönetimi tarafından değerlendirilecek ve sonuçlar kayıtlı e-posta adresiniz 
                                veya telefon numaranız üzerinden size bildirilecektir.
                                <br /><br />
                                Her öğrenci yalnızca tek bir başvuru yapabilir. Hata veya sorun yaşamanız 
                                durumunda, lütfen <Link href="/contact" className="underline">iletişim</Link> kısmından bizimle iletişime geçiniz.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </main>
    );
}