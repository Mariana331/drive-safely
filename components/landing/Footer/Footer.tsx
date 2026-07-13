import Link from 'next/link';
import { ShieldIcon, TwitterIcon, FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/icons';
import DriveyMascot from '@/components/illustrations/DriveyMascot';
import styles from './Footer.module.css';

const platformLinks = [
  { label: 'AI Analysis', href: '/ai-analysis' },
  { label: 'Traffic Rules', href: '/traffic-rules' },
  { label: 'Practice Tests', href: '/tests' },
  { label: 'AI Assistant', href: '/assistant' },
];

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
  { label: 'Blog', href: '/news' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
];

const resourceLinks = [
  { label: 'Help Center', href: '/help' },
  { label: 'Documentation', href: '/docs' },
  { label: 'Community', href: '/community' },
];

const socialLinks = [
  { label: 'Twitter', href: '#', icon: <TwitterIcon /> },
  { label: 'Facebook', href: '#', icon: <FacebookIcon /> },
  { label: 'Instagram', href: '#', icon: <InstagramIcon /> },
  { label: 'YouTube', href: '#', icon: <YoutubeIcon /> },
];

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
          <li key={link.label}>
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
  return (
    <footer className={styles.footer}>
      <div className={`container_beforeAuth ${styles.inner}`}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <ShieldIcon size={28} />
              <span>DriveSafely</span>
            </Link>
            <p className={styles.tagline}>
              AI-powered driver safety platform helping you become a better driver
              every day.
            </p>
          </div>

          <div className={styles.columns}>
            <FooterColumn title="Platform" links={platformLinks} />
            <FooterColumn title="Company" links={companyLinks} />
            <FooterColumn title="Legal" links={legalLinks} />
            <FooterColumn title="Resources" links={resourceLinks} />
          </div>

          <div className={styles.social}>
            <h3 className={styles.columnTitle}>Follow Us</h3>
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
            &copy; {new Date().getFullYear()} DriveSafely. All rights reserved.
          </p>
          <DriveyMascot size="sm" waving />
        </div>
      </div>
    </footer>
  );
}
