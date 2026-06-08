'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
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
import { resetPassword } from '@/lib/api/auth';
import { extractApiError } from '@/lib/api-client';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/lib/auth-schemas';

export default function ResetPasswordPage(): ReactNode {
  const t = useTranslations('auth.resetPassword');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '' },
  });

  async function onSubmit(values: ResetPasswordFormValues): Promise<void> {
    if (!token) {
      toast.error(t('error.invalidToken'));
      return;
    }
    setSubmitting(true);
    try {
      await resetPassword({ token, password: values.password });
      toast.success(t('success'));
      router.push('/login');
    } catch (error) {
      const apiError = extractApiError(error);
      const isInvalid =
        apiError.code === 'AUTH_INVALID_RESET_TOKEN' ||
        apiError.code === 'AUTH_RESET_TOKEN_EXPIRED' ||
        apiError.code === 'AUTH_RESET_TOKEN_USED';
      toast.error(isInvalid ? t('error.invalidToken') : t('error.invalidToken'));
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
          <Button type="submit" className="w-full" disabled={submitting || !token}>
            {t('submit')}
          </Button>
          <Link href="/login" className="text-sm text-muted-foreground hover:underline">
            {t('error.invalidToken')}
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
