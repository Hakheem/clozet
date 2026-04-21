import { getProductById } from "@/actions/products";
import { notFound } from "next/navigation";
import EditProductForm from "@/components/admin/EditProductForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return <EditProductForm product={product} />;
}
