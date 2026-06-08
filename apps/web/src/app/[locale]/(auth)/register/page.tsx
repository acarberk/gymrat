'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { AppLocale } from '@/i18n/routing';

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
import { register as registerApi } from '@/lib/api/auth';
import { extractApiError } from '@/lib/api-client';
import { registerSchema, type RegisterFormValues } from '@/lib/auth-schemas';
import { useAuthStore } from '@/stores/auth-store';

export default function RegisterPage(): ReactNode {
  const t = useTranslations('auth.register');
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', displayName: '' },
  });

  async function onSubmit(values: RegisterFormValues): Promise<void> {
    setSubmitting(true);
    try {
      const { accessToken, user } = await registerApi({ ...values, locale });
      setSession(accessToken, user);
      toast.success(t('verifyHint'));
      router.push('/');
    } catch (error) {
      const apiError = extractApiError(error);
      const messageKey =
        apiError.code === 'AUTH_REGISTRATION_FAILED' ? 'error.alreadyRegistered' : 'error.generic';
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
            <Label htmlFor="displayName">{t('displayNameLabel')}</Label>
            <Input
              id="displayName"
              type="text"
              autoComplete="name"
              placeholder={t('displayNamePlaceholder')}
              {...form.register('displayName')}
            />
            {form.formState.errors.displayName && (
              <p className="text-xs text-destructive">
                {form.formState.errors.displayName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('emailLabel')}</Label>
            <Input id="email" type="email" autoComplete="email" {...form.register('email')} />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('passwordLabel')}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...form.register('password')}
            />
            <p className="text-xs text-muted-foreground">{t('passwordHint')}</p>
            {form.formState.errors.password && (
              <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-0">
          <Button type="submit" className="w-full" disabled={submitting}>
            {t('submit')}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {t('haveAccount')}{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              {t('login')}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
