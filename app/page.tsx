import Header from '@/components/landing/Header/Header';
import Hero from '@/components/landing/Hero/Hero';
import FeatureCards from '@/components/landing/FeatureCards/FeatureCards';
import HowItWorks from '@/components/landing/HowItWorks/HowItWorks';
import NewsSection from '@/components/landing/NewsSection/NewsSection';
import CTABanner from '@/components/landing/CTABanner/CTABanner';
import Footer from '@/components/landing/Footer/Footer';
import { getNews } from '@/lib/api/ServerApi';

export default async function Home() {
  const articles = await getNews(3);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeatureCards />
        <HowItWorks />
        <NewsSection articles={articles} />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
