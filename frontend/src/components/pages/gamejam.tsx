'use client';

import { useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { get, useFieldArray, useForm, type FieldPath } from 'react-hook-form';
import * as z from 'zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
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
            <Card className="w-full max-w-3xl mx-auto my-8">
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
            <Card className="w-full max-w-3xl mx-auto my-8">
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
        <Card className="w-full max-w-3xl mx-auto my-8">
            {header}
            <CardContent>
                <p className="mb-6 text-sm text-muted-foreground">{windowSummary(appWindow)}</p>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8" noValidate>
                    <section className="grid gap-4">
                        <h3 className="text-lg font-semibold">Takım</h3>
                        {textField({ name: 'teamName', label: 'Ekip / takım adı', placeholder: 'Takımınızın adı' })}
                    </section>

                    <section className="grid gap-4 border-t pt-6">
                        <h3 className="text-lg font-semibold">Takım Lideri</h3>
                        {textField({ name: 'leader.name', label: 'Ad soyad' })}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {textField({ name: 'leader.email', label: 'E-posta (iletişim için)', type: 'email' })}
                            {textField({ name: 'leader.phone', label: 'Telefon (acil durumlar için)', type: 'tel', placeholder: '05xx xxx xx xx' })}
                        </div>
                        {personFields('leader')}
                    </section>

                    <section className="grid gap-4 border-t pt-6">
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="text-lg font-semibold">Ekip Üyeleri</h3>
                            <span className="text-sm text-muted-foreground">{members.fields.length}/{MAX_MEMBERS}</span>
                        </div>
                        {members.fields.map((field, i) => (
                            <div key={field.id} className="grid gap-4 rounded-md border p-4">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="font-medium">{i + 2}. kişi</h4>
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
                            <h3 className="text-lg font-semibold">Senaryo Soruları</h3>
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
                        <h3 className="text-lg font-semibold">Onaylar</h3>
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
                            'Başvuruyu Gönder'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
