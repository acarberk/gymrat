'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';
import { verifyEmail } from '@/lib/api/auth';

type VerifyState = 'verifying' | 'success' | 'error';

export default function VerifyEmailPage(): ReactNode {
  const t = useTranslations('auth.verifyEmail');
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [state, setState] = useState<VerifyState>('verifying');

  useEffect(() => {
    if (!token) {
      setState('error');
      return;
    }
    void (async () => {
      try {
        await verifyEmail(token);
        setState('success');
      } catch {
        setState('error');
      }
    })();
  }, [token]);

  return (
    <Card>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        {state === 'verifying' && <p className="text-muted-foreground">{t('verifying')}</p>}
        {state === 'success' && (
          <>
            <p className="text-foreground">{t('success')}</p>
            <Link href="/" className="inline-block">
              <Button>{t('successCta')}</Button>
            </Link>
          </>
        )}
        {state === 'error' && (
          <>
            <p className="text-destructive">{t('error')}</p>
            <Link href="/login" className="text-sm text-muted-foreground hover:underline">
              {t('resend')}
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
