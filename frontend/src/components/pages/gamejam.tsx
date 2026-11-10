'use client';

import { useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { get, useFieldArray, useForm, type FieldPath } from 'react-hook-form';
import * as z from 'zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faCheck, faGamepad, faPlus, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PixelLoader } from '@/components/layout/Pixel';
import { useApplicationWindows } from '@/hooks/useApplicationWindows';
import { useGameJam } from '@/hooks/useGameJam';
import { windowSummary } from '@/lib/applicationWindow';
import { ANSWER_KEYS, DISCIPLINES, MAX_MEMBERS, QUESTIONS, ageOf, type JamApplicationBody } from '@/lib/gameJam';

// Kurallar backend/helpers/jamInput.js'teki doğrulamayla aynı; sunucu yine de kendisi denetler.
const URL_RE = /^https?:\/\/\S+$/i;
const required = (label: string, max = 100) =>
    z.string().trim().min(1, `${label} zorunludur.`).max(max, `En fazla ${max} karakter.`);
const link = z.string().trim().max(500).regex(URL_RE, 'http:// ya da https:// ile başlayan bir bağlantı giriniz.');
const answer = z.enum(ANSWER_KEYS, { message: 'Bir seçenek işaretleyiniz.' });

const personSchema = z.object({
    name: required('Ad soyad'),
    // Backend 10–100 yaş dışını reddediyor; hatalı yıl genel 400 yerine alanın altında görünsün
    birthDate: z.string().min(1, 'Doğum tarihi zorunludur.')
        .refine((v) => { const age = ageOf(v); return age >= 10 && age <= 100; }, 'Doğum tarihini kontrol ediniz.'),
    university: required('Üniversite'),
    department: required('Bölüm'),
    cvUrl: link,
    projectUrl: link.or(z.literal('')),
    disciplines: z.array(z.string()).min(1, 'En az bir alan seçiniz.'),
    otherDiscipline: z.string().trim().max(100, 'En fazla 100 karakter.'),
    mediaConsent: z.boolean(),
});

const schema = z.object({
    teamName: required('Takım adı', 60),
    leader: personSchema.extend({
        email: z.email({ message: 'Geçerli bir e-posta adresi giriniz.' }).max(254),
        phone: z.string().trim().regex(/^\+?[\d\s()-]{10,20}$/, 'Geçerli bir telefon numarası giriniz.'),
    }),
    members: z.array(personSchema).min(1, 'En az bir ekip üyesi ekleyiniz.').max(MAX_MEMBERS),
    answers: z.object({ teamwork: answer, scope: answer, conflict: answer, motivation: answer, feedback: answer }),
    rulesConsent: z.literal(true, { message: 'Etkinlik kurallarını onaylamanız gerekiyor.' }),
    kvkkConsent: z.literal(true, { message: 'Aydınlatma metnini onaylamanız gerekiyor.' }),
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

const emptyPerson = {
    name: '', birthDate: '', university: '', department: '', cvUrl: '', projectUrl: '',
    disciplines: [] as string[], otherDiscipline: '', mediaConsent: false,
};

const checkboxClass = 'mt-1 h-4 w-4 shrink-0 accent-[var(--turkuaz)] cursor-pointer';

// Ana sayfa hero'sundaki gibi kumandanın çevresinde piksel kareler: [sol %, üst %, boyut px, opaklık, gecikme sn]
const HERO_PIXELS: [number, number, number, number, number?][] = [
    [6, 20, 12, 0.7], [18, 34, 8, 0.4, -0.4], [4, 60, 10, 0.55], [16, 78, 6, 0.8],
    [86, 12, 14, 0.5], [92, 34, 8, 0.85, -1.2], [76, 6, 10, 0.3], [88, 66, 12, 0.6, -2],
];

// Form bölümleri oyun seviyeleri gibi: piksel üst etiket + normal başlık
const levelTitle = (level: number, title: string) => (
    <div>
        <p className="mb-1 font-pixel text-[10px] lowercase text-(--turkuaz)">level {level}</p>
        <h3 className="text-lg font-semibold">{title}</h3>
    </div>
);
const playerTag = (n: number) => (
    <span className="mr-2 inline-grid h-6 min-w-8 place-items-center rounded-sm bg-(--turkuaz)/15 px-1 font-pixel text-[9px] text-(--turkuaz)">p{n}</span>
);

export default function GameJam() {
    const { submit } = useGameJam();
    const { windows, isLoading, error: windowsError } = useApplicationWindows();
    const appWindow = windows?.gamejam;
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [referenceId, setReferenceId] = useState<string | null>(null);

    const form = useForm<FormInput, unknown, FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            teamName: '',
            leader: { ...emptyPerson, email: '', phone: '' },
            members: [{ ...emptyPerson }],
        },
    });
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = form;
    const members = useFieldArray({ control: form.control, name: 'members' });

    const onSubmit = async (values: FormValues) => {
        setSubmitError(null);
        const result = await submit(values as JamApplicationBody);
        if (result.success) setReferenceId(result.id ?? '');
        else setSubmitError(result.message);
    };

    const errorOf = (name: FieldPath<FormInput>): string | undefined => get(errors, name)?.message;
    const errorText = (name: FieldPath<FormInput>) => {
        const message = errorOf(name);
        return message ? <p className="text-sm text-destructive">{message}</p> : null;
    };

    const textField = ({ name, label, type = 'text', placeholder, optional }: {
        name: FieldPath<FormInput>; label: string; type?: string; placeholder?: string; optional?: boolean;
    }) => (
        <div className="grid gap-2">
            <Label htmlFor={name}>
                {label}
                {!optional && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input id={name} type={type} placeholder={placeholder} aria-invalid={Boolean(errorOf(name))} {...register(name)} />
            {errorText(name)}
        </div>
    );

    // Lider ve üyelerde ortak alanlar; prefix "leader" ya da "members.<i>"
    const personFields = (prefix: 'leader' | `members.${number}`) => {
        const disciplines = (watch(`${prefix}.disciplines`) as string[] | undefined) ?? [];
        return (
            <>
                <div className="grid gap-4 sm:grid-cols-2">
                    {textField({ name: `${prefix}.birthDate`, label: 'Doğum tarihi', type: 'date' })}
                    {textField({ name: `${prefix}.university`, label: 'Üniversite', placeholder: 'Kocaeli Üniversitesi' })}
                    {textField({ name: `${prefix}.department`, label: 'Bölüm', placeholder: 'Bilgisayar Mühendisliği' })}
                    {textField({ name: `${prefix}.cvUrl`, label: 'CV bağlantısı', type: 'url', placeholder: 'Google Drive, LinkedIn ya da portfolyo' })}
                </div>
                {textField({ name: `${prefix}.projectUrl`, label: 'Referans oyun projesi (varsa)', type: 'url', placeholder: 'itch.io, GitHub ya da video bağlantısı', optional: true })}
                <fieldset className="grid gap-2">
                    <legend className="mb-2 text-sm font-medium">
                        Ana disiplin / uzmanlık alanı<span className="text-destructive ml-1">*</span>
                    </legend>
                    <div className="grid gap-2 sm:grid-cols-2">
                        {DISCIPLINES.map((d) => (
                            <label key={d.id} className="flex items-start gap-2 text-sm cursor-pointer">
                                <input type="checkbox" value={d.id} className={checkboxClass} {...register(`${prefix}.disciplines`)} />
                                {d.label}
                            </label>
                        ))}
                    </div>
                    {errorText(`${prefix}.disciplines`)}
                    {disciplines.includes('other') &&
                        textField({ name: `${prefix}.otherDiscipline`, label: 'Diğer alan', placeholder: 'Örn. VFX, QA, prodüksiyon', optional: true })}
                </fieldset>
                {/* Açık rıza kişinin kendisinden: üyelere etkinlikte sorulur */}
                {prefix === 'leader' && (
                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                        <input type="checkbox" className={checkboxClass} {...register('leader.mediaConsent')} />
                        <span>
                            Etkinlik sırasında çekilecek fotoğraf ve videolarda yer almayı ve bunların kulübün sitesinde ve sosyal
                            medya hesaplarında paylaşılmasını kabul ediyorum.{' '}
                            <span className="text-muted-foreground">(İsteğe bağlı; ekip üyelerine etkinlikte ayrıca sorulur)</span>
                        </span>
                    </label>
                )}
            </>
        );
    };

    const content = () => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
                <PixelLoader label="başvuru bilgileri yükleniyor" />
            </div>
        );
    }

    const header = (
        <CardHeader>
            <CardTitle>Game Jam Başvurusu</CardTitle>
            <CardDescription>
                2–4 kişilik takımlar halinde başvurulur. Formu takım lideri doldurur; ekip üyelerinin bilgilerini de lider girer.
            </CardDescription>
        </CardHeader>
    );

    if (!appWindow?.isOpen) {
        return (
            <Card className="w-full max-w-3xl mx-auto">
                {header}
                <CardContent>
                    <div className="p-4 bg-muted rounded-md text-center">
                        <p className="text-lg font-semibold">
                            {appWindow?.state === 'scheduled' ? 'Başvurular henüz açılmadı.' : 'Bu başvuru şu anda kapalı.'}
                        </p>
                        <p className="text-muted-foreground mt-2">{appWindow ? windowSummary(appWindow) : windowsError}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (referenceId !== null) {
        return (
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                        <FontAwesomeIcon icon={faCheck} className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>Başvurunuz Alındı</CardTitle>
                    <CardDescription>Game jam takım başvurunuz kaydedildi.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground mb-4">Sonuç, takım liderinin e-posta adresine bildirilecektir.</p>
                    {referenceId && <p className="text-sm text-muted-foreground">Başvuru referans numaranız: {referenceId}</p>}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-3xl mx-auto">
            {header}
            <CardContent>
                <p className="mb-6 text-sm text-muted-foreground">{windowSummary(appWindow)}</p>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8" noValidate>
                    <section className="grid gap-4">
                        {levelTitle(1, 'Takım')}
                        {textField({ name: 'teamName', label: 'Ekip / takım adı', placeholder: 'Takımınızın adı' })}
                    </section>

                    <section className="grid gap-4 border-t pt-6">
                        <div className="flex items-end gap-1">{playerTag(1)}{levelTitle(2, 'Takım Lideri')}</div>
                        {textField({ name: 'leader.name', label: 'Ad soyad' })}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {textField({ name: 'leader.email', label: 'E-posta (iletişim için)', type: 'email' })}
                            {textField({ name: 'leader.phone', label: 'Telefon (acil durumlar için)', type: 'tel', placeholder: '05xx xxx xx xx' })}
                        </div>
                        {personFields('leader')}
                    </section>

                    <section className="grid gap-4 border-t pt-6">
                        <div className="flex items-center justify-between gap-2">
                            {levelTitle(3, 'Ekip Üyeleri')}
                            <span className="text-sm text-muted-foreground">{members.fields.length}/{MAX_MEMBERS}</span>
                        </div>
                        {members.fields.map((field, i) => (
                            <div key={field.id} className="grid gap-4 rounded-md border p-4">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="flex items-center font-medium">{playerTag(i + 2)}Ekip üyesi</h4>
                                    {members.fields.length > 1 && (
                                        <Button type="button" variant="ghost" size="sm" onClick={() => members.remove(i)} className="cursor-pointer">
                                            <FontAwesomeIcon icon={faTrash} className="mr-2 h-3 w-3" />
                                            Kaldır
                                        </Button>
                                    )}
                                </div>
                                {textField({ name: `members.${i}.name`, label: 'Ad soyad' })}
                                {personFields(`members.${i}`)}
                            </div>
                        ))}
                        {members.fields.length < MAX_MEMBERS && (
                            <Button type="button" variant="outline" onClick={() => members.append({ ...emptyPerson })} className="cursor-pointer">
                                <FontAwesomeIcon icon={faPlus} className="mr-2 h-3 w-3" />
                                Üye ekle
                            </Button>
                        )}
                        {errorText("members")}
                    </section>

                    <section className="grid gap-6 border-t pt-6">
                        <div>
                            {levelTitle(4, 'Senaryo Soruları')}
                            <p className="text-sm text-muted-foreground">Takım lideri olarak size en yakın seçeneği işaretleyin.</p>
                        </div>
                        {QUESTIONS.map((q, qi) => (
                            <fieldset key={q.id} className="grid gap-2">
                                <legend className="mb-2 text-sm font-medium">
                                    {qi + 1}. {q.title}<span className="text-destructive ml-1">*</span>
                                    <span className="mt-1 block font-normal text-muted-foreground">{q.text}</span>
                                </legend>
                                {q.options.map((option, oi) => (
                                    <label key={oi} className="flex items-start gap-2 text-sm cursor-pointer">
                                        <input type="radio" value={ANSWER_KEYS[oi]} className={checkboxClass} {...register(`answers.${q.id}`)} />
                                        <span><strong>{ANSWER_KEYS[oi]})</strong> {option}</span>
                                    </label>
                                ))}
                                {errorText(`answers.${q.id}`)}
                            </fieldset>
                        ))}
                    </section>

                    <section className="grid gap-3 border-t pt-6">
                        {levelTitle(5, 'Onaylar')}
                        <label className="flex items-start gap-2 text-sm cursor-pointer">
                            <input type="checkbox" className={checkboxClass} {...register('rulesConsent')} />
                            <span>
                                Etkinlik süresini, etik kuralları (Code of Conduct) ve telif koşullarını okudum; takımım adına kabul ediyorum.
                                <span className="text-destructive ml-1">*</span>
                            </span>
                        </label>
                        {errorText("rulesConsent")}
                        <label className="flex items-start gap-2 text-sm cursor-pointer">
                            <input type="checkbox" className={checkboxClass} {...register('kvkkConsent')} />
                            <span>
                                <Link href="/kvkk" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                                    KVKK Aydınlatma Metni
                                </Link>
                                &apos;ni okudum. Ekip üyelerimi bu metin hakkında bilgilendirdim ve bilgilerini paylaşmam için onaylarını aldım.
                                <span className="text-destructive ml-1">*</span>
                            </span>
                        </label>
                        {errorText("kvkkConsent")}
                    </section>

                    {submitError && (
                        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{submitError}</div>
                    )}
                    {Object.keys(errors).length > 0 && (
                        <p className="text-sm text-destructive" role="alert">Formda eksik ya da hatalı alanlar var, lütfen kontrol edin.</p>
                    )}
                    <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer bg-cta text-white shadow-cta hover:brightness-110">
                        {isSubmitting ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} className="mr-2 h-4 w-4" spin />
                                Gönderiliyor
                            </>
                        ) : (
                            'Takımı Kaydet'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

    return (
        <main className="flex flex-col gap-12 pb-16">
            <section className="bg-night overflow-hidden py-16 text-white md:py-24">
                <div className="container grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                        {/* Piksel font Türkçe büyük harfleri bozuk çiziyor: rozet küçük harf */}
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-(--acik-mavi)/30 bg-white/5 px-4 py-1.5 font-pixel text-[10px] lowercase text-(--acik-mavi) sm:text-xs">
                            <span className="size-2 bg-(--turkuaz)" />
                            <span>kou seng game jam</span>
                        </div>
                        <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl">
                            Takımını kur,{' '}
                            <span className="bg-gradient-to-br from-(--acik-mavi) to-[#3FB0DC] bg-clip-text text-transparent">oyununu yap</span>
                            <span aria-hidden="true" className="ml-1 inline-block h-[0.8em] w-[0.42em] translate-y-[0.06em] bg-(--turkuaz) motion-safe:animate-blink" />
                        </h1>
                        <p className="mb-6 max-w-xl text-lg text-[#C4D9E6]">
                            Tema açıklanır, süre başlar. 2–4 kişilik takımınla sıfırdan bir oyun geliştir: programcı, sanatçı,
                            oyun tasarımcısı, ses tasarımcısı ve hikâye yazarı, herkesin yeri var. Kulüp üyesi olmak gerekmez.
                        </p>
                        <ul className="mb-8 flex flex-wrap justify-center gap-2 text-sm lg:justify-start">
                            {['2–4 kişilik takımlar', 'Formu takım lideri doldurur', appWindow ? windowSummary(appWindow) : 'Başvuru durumu yükleniyor'].map((chip) => (
                                <li key={chip} className="rounded-md border border-(--acik-mavi)/25 bg-white/5 px-3 py-1.5 text-[#C4D9E6]">{chip}</li>
                            ))}
                        </ul>
                        {appWindow?.isOpen && referenceId === null && (
                            <Button asChild size="lg" className="bg-cta text-white shadow-cta hover:brightness-110">
                                <a href="#basvuru">
                                    Takımını kaydet <FontAwesomeIcon icon={faArrowDown} className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        )}
                    </div>

                    {/* Süs: parıltı, piksel kareler, kumanda ve yanıp sönen "press start" */}
                    <div aria-hidden="true" className="relative mx-auto grid aspect-square w-full max-w-[220px] place-items-center sm:max-w-[320px] lg:max-w-sm">
                        <div className="absolute inset-0 m-auto size-[60%] rounded-full bg-(--turkuaz)/55 blur-[60px]" />
                        {HERO_PIXELS.map(([left, top, size, opacity, delay], i) => (
                            <span
                                key={i}
                                className={delay !== undefined ? 'absolute bg-(--acik-mavi) motion-safe:animate-pxspin' : 'absolute bg-(--acik-mavi)'}
                                // Süre inline: animate-pxspin'in animation kısaltması bir sınıfla verilen süreyi eziyor.
                                style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, opacity, ...(delay !== undefined && { animationDuration: '2.4s', animationDelay: `${delay}s` }) }}
                            />
                        ))}
                        <div className="relative flex flex-col items-center gap-6">
                            <FontAwesomeIcon icon={faGamepad} className="text-[6rem] text-white drop-shadow-[0_8px_24px_rgb(3_137_188_/_0.6)] sm:text-[8rem]" />
                            <span className="font-pixel text-xs text-(--acik-mavi) motion-safe:animate-blink">press start</span>
                        </div>
                    </div>
                </div>
                <div aria-hidden="true" className="pixel-edge bottom-0" />
            </section>

            <section id="basvuru" className="container scroll-mt-24">
                {content()}
            </section>
        </main>
    );
}
