'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

// Form şema tanımı
const loginFormSchema = z.object({
  email: z.email({
    message: "Geçerli bir e-posta adresi giriniz.",
  }),
  password: z.string().min(6, {
    message: "Şifre en az 6 karakter olmalıdır.",
  }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function AdminLogin() {
  // Admin dashboard yönlendirmesi için
  const router = useRouter();
  const { login, isAuthenticating, errorMessage, token, getAuthDetail, logout } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginFormValues) => {
    setError(null);
    const ok = await login(data.email, data.password);
    if (!ok) {
      setError(errorMessage || "Giriş yapılamadı. Lütfen bilgilerinizi kontrol ediniz.");
      return;
    }
    router.push('/admin/dashboard');
  };

  // Eğer token varsa, sayfa açılışında doğrula
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setIsCheckingAuth(true);
    (async () => {
      const result = await getAuthDetail();
      if (cancelled) return;
      if ('name' in result && result?.email) {
        router.push('/admin/dashboard');
        return;
      }
      // Token geçersiz ise temizle ve normal akışa devam et
      logout();
      setIsCheckingAuth(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [token, getAuthDetail, logout, router]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-muted/40">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-label="Yükleniyor" />
          <p className="text-sm text-muted-foreground">Doğrulama yapılıyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Girişi</CardTitle>
          <CardDescription>Yönetim paneline erişmek için giriş yapın</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="E-posta adresiniz"
                        autoComplete="email"
                        disabled={isAuthenticating}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şifre</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Şifreniz"
                        autoComplete="current-password"
                        disabled={isAuthenticating}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(error || errorMessage) && (
                <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm">
                  {error || errorMessage}
                </div>
              )}

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isAuthenticating}
              >
                {isAuthenticating ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            KOU SENG Yönetim Paneli
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}