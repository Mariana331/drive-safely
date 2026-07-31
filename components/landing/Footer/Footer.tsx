'use client';

import Link from 'next/link';
import {
  ShieldIcon,
  TwitterIcon,
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from '@/components/icons';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import styles from './Footer.module.css';

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className={styles.column}>
      <h3 className={styles.columnTitle}>{title}</h3>
      <ul className={styles.linkList}>
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link href={link.href} className={styles.link}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const dict = useDictionary();
  const f = dict.footer;
  const year = new Date().getFullYear();

  const platformLinks = [
    { label: dict.nav.aiAnalysis, href: '/ai-analysis' },
    { label: dict.nav.trafficRules, href: '/traffic-rules' },
    { label: dict.features.testsTitle, href: '/tests' },
    { label: dict.features.assistantTitle, href: '/assistant' },
  ];

  const companyLinks = [
    { label: f.aboutUs, href: '/about' },
    { label: f.careers, href: '/careers' },
    { label: f.contact, href: '/contact' },
    { label: f.blog, href: '/news' },
  ];

  const legalLinks = [
    { label: f.privacy, href: '/privacy' },
    { label: f.terms, href: '/terms' },
    { label: f.cookies, href: '/cookies' },
  ];

  const resourceLinks = [
    { label: f.help, href: '/help' },
    { label: f.docs, href: '/docs' },
    { label: f.community, href: '/community' },
  ];

  const socialLinks = [
    { label: 'Twitter', href: '#', icon: <TwitterIcon /> },
    { label: 'Facebook', href: '#', icon: <FacebookIcon /> },
    { label: 'Instagram', href: '#', icon: <InstagramIcon /> },
    { label: 'YouTube', href: '#', icon: <YoutubeIcon /> },
  ];

  return (
    <footer className={styles.footer}>
      <div className={`container_beforeAuth ${styles.inner}`}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <ShieldIcon size={28} />
              <span className={styles.logoText}>
                <span className={styles.logoDrive}>Drive</span>
                <span className={styles.logoSafely}>Safely</span>
              </span>
            </Link>
            <p className={styles.tagline}>{f.tagline}</p>
          </div>

          <div className={styles.columns}>
            <FooterColumn title={f.platform} links={platformLinks} />
            <FooterColumn title={f.company} links={companyLinks} />
            <FooterColumn title={f.legal} links={legalLinks} />
            <FooterColumn title={f.resources} links={resourceLinks} />
          </div>

          <div className={styles.social}>
            <h3 className={styles.columnTitle}>{f.followUs}</h3>
            <div className={styles.socialIcons}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={styles.socialLink}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            {f.copyright.replace('{year}', String(year))}
          </p>
          <ShieldIcon size={48} />
        </div>
      </div>
    </footer>
  );
}
