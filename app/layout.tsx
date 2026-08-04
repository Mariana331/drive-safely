import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { cookies } from 'next/headers';
import { AuthProvider } from '@/lib/auth/AuthProvider';
import { LocaleProvider } from '@/lib/i18n/LocaleProvider';
import { getRequestLocale } from '@/lib/i18n/getRequestLocale';
import { getDictionary } from '@/lib/i18n/getDictionary';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import {
  THEME_BOOT_SCRIPT,
  THEME_COOKIE,
  normalizeTheme,
  type Theme,
} from '@/lib/theme/config';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const dict = await getDictionary(locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    icons: {
      icon: '/favicon.svg',
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const cookieStore = await cookies();
  const theme: Theme =
    normalizeTheme(cookieStore.get(THEME_COOKIE)?.value) ?? 'light';

  return (
    <html
      lang={locale}
      className={inter.variable}
      data-theme={theme}
      style={{ colorScheme: theme }}
      suppressHydrationWarning
    >
      <body>
        <Script
          id="theme-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }}
        />
        <LocaleProvider initialLocale={locale}>
          <ThemeProvider initialTheme={theme}>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
