import { getTranslations, setRequestLocale } from 'next-intl/server';

import type { ReactNode } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home.hero');

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">{t('title')}</h1>
        <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
      </div>
      <div className="flex w-full max-w-xs flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/register" className={cn(buttonVariants({ size: 'lg' }), 'w-full sm:w-auto')}>
          {t('getStarted')}
        </Link>
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full sm:w-auto')}
        >
          {t('signIn')}
        </Link>
      </div>
    </main>
  );
}
