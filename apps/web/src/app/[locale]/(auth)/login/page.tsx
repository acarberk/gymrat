'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useRouter } from '@/i18n/navigation';
import { login } from '@/lib/api/auth';
import { extractApiError } from '@/lib/api-client';
import { loginSchema, type LoginFormValues } from '@/lib/auth-schemas';
import { useAuthStore } from '@/stores/auth-store';

export default function LoginPage(): ReactNode {
  const t = useTranslations('auth.login');
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginFormValues): Promise<void> {
    setSubmitting(true);
    try {
      const { accessToken, user } = await login(values);
      setSession(accessToken, user);
      router.push('/');
    } catch (error) {
      const apiError = extractApiError(error);
      const messageKey =
        apiError.code === 'AUTH_INVALID_CREDENTIALS' ? 'error.invalidCredentials' : 'error.generic';
      toast.error(t(messageKey));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">{t('title')}</CardTitle>
        <CardDescription>{t('subtitle')}</CardDescription>
      </CardHeader>
      <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('emailLabel')}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={t('emailPlaceholder')}
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('passwordLabel')}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder={t('passwordPlaceholder')}
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className="text-right text-sm">
            <Link href="/forgot-password" className="text-muted-foreground hover:underline">
              {t('forgotPassword')}
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-0">
          <Button type="submit" className="w-full" disabled={submitting}>
            {t('submit')}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {t('noAccount')}{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              {t('register')}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
