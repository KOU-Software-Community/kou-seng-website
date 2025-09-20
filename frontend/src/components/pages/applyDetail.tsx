'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField as UIFormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplyDetail, type FormField } from '@/hooks/useApplyDetail';
import useSubmissions, { type SubmissionData } from '@/hooks/useSubmissions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import React from "react";

export default function ApplyDetail(props: { slug: string }) {
  const { application, isLoading, error } = useApplyDetail(props.slug);
  const { 
    isSubmitting, 
    isSuccess, 
    errorMessage, 
    submitApplication 
  } = useSubmissions();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  // Dinamik form şeması oluştur
  const generateFormSchema = () => {
    if (!application || !application.fields.length) {
      return z.object({});
    }

    const schemaObj: Record<string, z.ZodTypeAny> = {};

    application.fields.forEach(field => {
      let fieldSchema: z.ZodTypeAny;

      switch (field.type) {
        case 'email':
          fieldSchema = z.email({ message: 'Geçerli bir e-posta adresi giriniz.' });
          break;
        case 'tel':
          fieldSchema = z.string().min(10, { message: 'Geçerli bir telefon numarası giriniz.' });
          break;
        case 'url':
          fieldSchema = z.url({ message: 'Geçerli bir URL giriniz.' });
          break;
        case 'number':
          fieldSchema = z.coerce.number().pipe(z.number().min(0, { message: 'Geçerli bir sayı giriniz.' }));
          break;
        case 'textarea':
          fieldSchema = z.string().min(10, { message: 'En az 10 karakter giriniz.' });
          break;
        case 'select':
          fieldSchema = z.string();
          break;
        default:
          fieldSchema = z.string();
          break;
      }

      // Zorunlu veya opsiyonel alan ayarı
      if (field.required) {
        // Required alanlar için boş string kontrolü ekle
        if (field.type === 'select') {
          schemaObj[field.id] = z.string().min(1, { message: 'Lütfen bir seçim yapınız.' });
        } else {
          schemaObj[field.id] = fieldSchema.refine(
            (val) => val && val.toString().trim().length > 0,
            { message: `${field.label} alanı zorunludur.` }
          );
        }
      } else {
        // Opsiyonel alanlarda boş string ('') değerini undefined'a çevirerek hata vermesini engelle
        schemaObj[field.id] = z.preprocess(
          (val) => (val === '' || val === null ? undefined : val),
          fieldSchema.optional()
        );
      }
    });

    return z.object(schemaObj);
  };

  const formSchema = generateFormSchema();
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // Dinamik alanlar için başlangıç değerlerini ayarla (controlled input uyarısını önlemek için)
  useEffect(() => {
    if (!application) return;
    const defaults: Record<string, unknown> = {};
    application.fields.forEach((field) => {
      if (field.type === 'select') {
        // required select ise default olarak boş değer seçilsin ("Seçiniz" -> value: '')
        // opsiyonel select ise yine '' olarak kalsın; validation bunu tolere eder
        const hasEmptyOption = field.options?.some((o: { value: string }) => o.value === '');
        defaults[field.id] = hasEmptyOption ? '' : (field.options?.[0]?.value ?? '');
        return;
      }
      defaults[field.id] = '';
    });
    form.reset(defaults as Partial<FormValues>);
  }, [application, form]);

  const handleSubmit = async (data: FormValues) => {
    try {
      if (!application) return;
      
      // Required alanları kontrol et
      const requiredFields = application.fields.filter(field => field.required);
      const missingFields: string[] = [];
      
      requiredFields.forEach(field => {
        const value = data[field.id as keyof FormValues];
        const stringValue = String(value || '');
        const isEmpty = !value || stringValue.trim() === '';
        
        if (isEmpty) {
          missingFields.push(field.label);
        }
      });
      
      if (missingFields.length > 0) {
        // Form validasyon hatası göster
        form.setError('root', {
          type: 'manual',
          message: `Lütfen şu zorunlu alanları doldurun: ${missingFields.join(', ')}`
        });
        return;
      }
      
      // Form verilerini API'nin istediği formata dönüştür
      const submissionData: Record<string, string | number | unknown> = {};
      
      // Temel alanları ekle
      if (data.name) submissionData.name = `${data.name} ${data.surname || ''}`.trim();
      if (data.studentId) submissionData.studentId = data.studentId;
      if (data.email) submissionData.email = data.email;
      if (data.phone) submissionData.phone = data.phone;
      if (data.faculty) submissionData.faculty = data.faculty;
      if (data.department) submissionData.department = data.department;
      
      // Sınıf bilgisini sayıya çevir
      if (data.grade) {
        const grade = data.grade as string;
        submissionData.grade = isNaN(parseInt(grade)) ? grade : parseInt(grade);
      }
      
      // Diğer tüm alanları ekstra sorular olarak ekle
      Object.keys(data).forEach(key => {
        if (!['name', 'surname', 'studentId', 'email', 'phone', 'faculty', 'department', 'grade'].includes(key)) {
          submissionData[`question_${key}`] = data[key];
        }
      });
      
      // Başvuru tipine göre API çağrısı yap
      const response = await submitApplication(
        application.submissionType, 
        submissionData as SubmissionData, 
        application.submissionType === 'technical' ? application.slug : undefined
      );
      
      if (response.success) {
        if (response.data?._id) {
          setReferenceId(response.data._id);
        }
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Form gönderilirken hata oluştu:', error);
    }
  };

  // Yükleniyor durumu
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <FontAwesomeIcon icon={faSpinner} className="h-12 w-12 text-primary mb-4" spin />
        <p className="text-lg text-muted-foreground">Başvuru bilgileri yükleniyor...</p>
      </div>
    );
  }

  // Hata durumu
  if (error || !application) {
    return (
      <Card className="w-full max-w-3xl mx-4 sm:mx-auto my-8">
        <CardHeader>
          <CardTitle className="text-destructive">Hata</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error || 'Başvuru bilgisi bulunamadı.'}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => window.history.back()}>
            Geri Dön
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Başvuru kapalıysa
  if (!application.isOpen) {
    return (
      <Card className="w-full max-w-3xl mx-auto my-8">
        <CardHeader>
          <CardTitle>{application.title}</CardTitle>
          <CardDescription>{application.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-md text-center">
            <p className="text-lg font-semibold">Bu başvuru dönemi kapanmıştır.</p>
            <p className="text-muted-foreground mt-2">{application.deadline}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className='cursor-pointer' onClick={() => window.history.back()}>
            Başvurulara Geri Dön
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Başvuru formunu oluştur
  const renderFormField = (field: FormField): React.ReactNode => {
    switch (field.type) {
      case 'select':
        return (
          <UIFormField
            key={field.id}
            control={form.control}
            name={field.id as never}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...formField}
                    value={(formField.value as string | undefined) ?? ''}
                  >
                    {field.options?.map((option: { value: string; label: string }) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'textarea':
        return (
          <UIFormField
            key={field.id}
            control={form.control}
            name={field.id as never}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Textarea placeholder={field.placeholder} {...formField} value={(formField.value as string | undefined) ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return (
          <UIFormField
            key={field.id}
            control={form.control}
            name={field.id as never}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input 
                    type={field.type} 
                    placeholder={field.placeholder} 
                    {...formField} 
                    value={(formField.value as string | number | undefined) ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  };

  // Başvuru gönderildi ekranı
  if (isSubmitted && isSuccess) {
    return (
      <Card className="w-full max-w-3xl mx-4 sm:mx-auto my-8">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faCheck} className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Başvurunuz Alındı</CardTitle>
          <CardDescription>
            {application.title} başvurunuz başarıyla kaydedilmiştir.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            Başvurunuz değerlendirildikten sonra size e-posta yoluyla dönüş yapılacaktır.
          </p>
          <div className="p-4 bg-muted rounded-md mb-4">
            <p className="font-semibold">Başvurunuzu tamamladığınız için teşekkür ederiz!</p>
            {referenceId && (
              <p className="text-sm text-muted-foreground mt-2">Başvuru referans numaranız: {referenceId}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" className='cursor-pointer' onClick={() => window.history.back()}>
            Başvurulara Geri Dön
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // Hata durumunda error card göster
  if (errorMessage && !isLoading) {
    return (
      <Card className="w-full max-w-3xl mx-4 sm:mx-auto my-8">
        <CardHeader className="text-center">
          <div className="mx-auto bg-destructive/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-destructive">Başvuru Gönderilirken Hata Oluştu</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">{errorMessage}</p>
          <div className="p-4 bg-muted rounded-md mb-4">
            <p className="font-semibold">Lütfen daha sonra tekrar deneyiniz veya yöneticilerle iletişime geçiniz.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" className='cursor-pointer' onClick={() => window.history.back()}>
            Başvurulara Geri Dön
          </Button>
          <Button className='cursor-pointer' onClick={() => window.location.reload()}>
            Tekrar Dene
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle>{application.title}</CardTitle>
        <CardDescription>{application.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Son Başvuru Tarihi:</span> {application.deadline}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {form.formState.errors.root && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-destructive text-sm font-medium">
                  {form.formState.errors.root.message}
                </p>
              </div>
            )}
            {application.fields.map(renderFormField)}

            <div className="border-t pt-4">
              <FormDescription className="mb-4">
                * Form bilgileriniz, KVKK kapsamında işlenecek ve sadece başvuru değerlendirmesi için kullanılacaktır.
              </FormDescription>
              <Button 
                type="submit" 
                className="w-full cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="mr-2 h-4 w-4" spin />
                    Gönderiliyor
                  </>
                ) : (
                  'Başvuruyu Gönder'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}