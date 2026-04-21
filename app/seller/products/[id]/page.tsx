import { getProductById } from "@/actions/products";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import EditProductForm from "@/components/admin/EditProductForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SellerEditProductPage({ params }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session || session.user.role !== "SELLER") {
    redirect("/login");
  }

  const { id } = await params;
  const product = await getProductById(id);

  if (!product || product.sellerId !== session.user.id) {
    notFound();
  }

  return <EditProductForm product={product} redirectPath="/seller/products" />;
}
