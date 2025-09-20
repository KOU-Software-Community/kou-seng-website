"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useContact, ContactFormValues } from "@/hooks/useContact";

// Form doğrulama şeması
const formSchema = z.object({
  name: z.string().min(2, { message: "İsim en az 2 karakter olmalıdır" }),
  email: z.email({ message: "Geçerli bir e-posta adresi giriniz" }),
  subject: z.string().min(5, { message: "Konu en az 5 karakter olmalıdır" }),
  message: z.string().min(10, { message: "Mesaj en az 10 karakter olmalıdır" })
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  // İletişim formu işlemleri için hook
  const { isSubmitting, isSuccess, errorMessage, submitContact } = useContact();

  // Form yönetimi için useForm hook'u
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  // Form gönderildiğinde çalışacak fonksiyon
  const onSubmit = async (values: ContactFormValues) => {
    await submitContact(values);
    if (!errorMessage) {
      form.reset();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bize Ulaşın</CardTitle>
        <CardDescription>
          Aşağıdaki formu doldurarak bize mesaj gönderebilirsiniz.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad Soyad</FormLabel>
                    <FormControl>
                      <Input placeholder="Ad ve soyadınız" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="ornek@mail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konu</FormLabel>
                  <FormControl>
                    <Input placeholder="Mesajınızın konusu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mesaj</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Mesajınız" 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Başarılı gönderim mesajı */}
            {isSuccess && (
              <div className="p-3 rounded-md bg-green-50 border border-green-200 text-green-600">
                Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
              </div>
            )}
            
            {/* Hata mesajı */}
            {errorMessage && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-600">
                {errorMessage}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full sm:w-auto cursor-pointer" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Gönderiliyor..." : "Gönder"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
