import Hero from "@/components/general/Hero";
import Container from "@/components/layout/Container";
import ProductTabs from "@/components/general/ProductTabs";
import { getCategoriesWithCounts } from "@/actions/products";
import PremiumDeals from "@/components/general/PremiumDeals";
import CTABanners from "@/components/general/CTABanners";

export default async function Home() {
  const categories = await getCategoriesWithCounts();
  const activeCategories = categories;

  return (
    <>
      <Container className="pt-12 mx-auto pb-24">
        <Hero />
        <ProductTabs />
<PremiumDeals/>
<CTABanners/>
      </Container>
    </>
  );
}

