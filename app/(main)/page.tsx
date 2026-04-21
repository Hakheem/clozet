import Hero from "@/components/general/Hero";
import Container from "@/components/layout/Container";
import CategoryPills from "@/components/shop/CategoryPills";
import { getCategories } from "@/actions/contents";

export default async function Home() {
  const categories = await getCategories();
  const activeCategories = categories.filter(c => c.isActive);

  return (
    <>
      <Container className="pt-12 pb-24">
        <Hero/>
        <CategoryPills categories={activeCategories} />

        
      </Container>
    </>
  );
}

