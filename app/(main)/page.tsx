import Hero from "@/components/general/Hero";
import Container from "@/components/layout/Container";
import ProductTabs from "@/components/general/ProductTabs";
import { getCategoriesWithCounts } from "@/actions/products";
import PremiumDeals from "@/components/general/PremiumDeals";
import CTABanners from "@/components/general/CTABanners";
import FeaturedGrid from "@/components/general/FeaturedGrid";
import CTASection from "@/components/general/CTASection";

export default async function Home() {
  const categories = await getCategoriesWithCounts();
  const activeCategories = categories;

  return (
    <>
      <Container className="py-12 px-0 mx-auto">
        <Hero />
        <ProductTabs />
        <FeaturedGrid />
        <PremiumDeals />
        <CTASection />
      </Container>
    </>
  );
}

