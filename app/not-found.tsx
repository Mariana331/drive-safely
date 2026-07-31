import Button from '@/components/ui/Button/Button';
import { getDictionary } from '@/lib/i18n/getDictionary';
import { getRequestLocale } from '@/lib/i18n/getRequestLocale';
import styles from './not-found.module.css';

export default async function NotFound() {
  const locale = await getRequestLocale();
  const dict = await getDictionary(locale);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>404 — {dict.notFound.title}</h1>
      <p className={styles.description}>{dict.notFound.text}</p>
      <Button variant="primary" href="/">
        {dict.notFound.home}
      </Button>
    </div>
  );
}
