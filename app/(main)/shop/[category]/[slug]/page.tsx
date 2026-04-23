import { getProductBySlug } from "@/actions/products";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductInfo from "@/components/shop/ProductInfo";
import Breadcrumbs from "@/components/shop/BreadCrumbs";

interface Props {
  params: Promise<{
    category: string;
    slug: string;
  }>; 
}

export default async function SingleProductPage({ params }: Props) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white  pb-20">
      <Container className='mx-auto'>
        <div className="py-6">
          <Breadcrumbs
            category={product.category}
            productName={product.name}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Images */}
          <ProductGallery images={product.images} name={product.name} />

          {/* Right: Content */}
          <ProductInfo product={product} />
        </div>

        {/* Description Section */}
        {/* <div className="mt-20 border-t border-[#E4E0D9] pt-16">
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-6">Description</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
              {product.description || "No detailed description available."}
            </div>

            {product.material && (
              <div className="mt-10">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-3">Material & Care</h3>
                <p className="text-sm text-muted-foreground">{product.material}</p>
              </div>
            )}
          </div>
        </div> */}
      </Container>
    </div>
  );
}

