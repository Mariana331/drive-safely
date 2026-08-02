import Header from '@/components/landing/Header/Header';
import Hero from '@/components/landing/Hero/Hero';
import FeatureCards from '@/components/landing/FeatureCards/FeatureCards';
import HowItWorks from '@/components/landing/HowItWorks/HowItWorks';
import NewsSection from '@/components/landing/NewsSection/NewsSection';
import CTABanner from '@/components/landing/CTABanner/CTABanner';
import Footer from '@/components/landing/Footer/Footer';
import { getNewsList } from '@/lib/api/ServerApi';
import { getNewsCatalog, splitNewsStreams } from '@/lib/news/getNewsCatalog';

export default async function Home() {
  const apiData = await getNewsList({ page: 1, limit: 30 });
  const catalog = await getNewsCatalog(apiData.articles);
  const { laws, general } = splitNewsStreams(catalog);

  // Prefer 2 official law updates + 1 general headline for the home teaser.
  const homeArticles = [
    ...laws.slice(0, 2),
    ...general.slice(0, 1),
  ].slice(0, 3);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeatureCards />
        <HowItWorks />
        <NewsSection articles={homeArticles.length > 0 ? homeArticles : catalog.slice(0, 3)} />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
