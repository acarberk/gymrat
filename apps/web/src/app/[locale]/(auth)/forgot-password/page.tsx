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
import { Link } from '@/i18n/navigation';
import { forgotPassword } from '@/lib/api/auth';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/auth-schemas';

export default function ForgotPasswordPage(): ReactNode {
  const t = useTranslations('auth.forgotPassword');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: ForgotPasswordFormValues): Promise<void> {
    setSubmitting(true);
    try {
      await forgotPassword(values);
      setSubmitted(true);
      toast.success(t('success'));
    } catch {
      setSubmitted(true);
      toast.success(t('success'));
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
      {submitted ? (
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">{t('successDetail')}</p>
          <Link href="/login" className="text-sm font-medium text-primary hover:underline">
            {t('backToLogin')}
          </Link>
        </CardContent>
      ) : (
        <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('emailLabel')}</Label>
              <Input id="email" type="email" autoComplete="email" {...form.register('email')} />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pt-0">
            <Button type="submit" className="w-full" disabled={submitting}>
              {t('submit')}
            </Button>
            <Link href="/login" className="text-sm text-muted-foreground hover:underline">
              {t('backToLogin')}
            </Link>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
