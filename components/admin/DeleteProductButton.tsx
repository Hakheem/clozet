"use client";

import { useState } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { deleteProduct } from "@/actions/products";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export default function DeleteProductButton({ 
  productId, 
  productName 
}: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteProduct(productId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`"${productName}" deleted successfully.`);
        setOpen(false);
      }
    } catch (error) {
      toast.error("Failed to delete product.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <button
            className="p-2 text-[#8A857D] hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors"
            title="Delete product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        }
      />
      <AlertDialogContent className="bg-white border-[#E4E0D9] rounded-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 text-[#DC2626] mb-2">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <AlertDialogTitle className="text-lg font-bold">Delete Product?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-[#8A857D]">
            Are you sure you want to delete <span className="font-bold text-[#1C1A17]">"{productName}"</span>? 
            This action cannot be undone and all associated variants and data will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel className="rounded-xl border-[#E4E0D9] text-[#1C1A17] hover:bg-[#F7F5F2] h-10 px-6 font-semibold text-xs uppercase tracking-widest">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="rounded-xl bg-[#DC2626] text-white hover:bg-[#B91C1C] h-10 px-6 font-semibold text-xs uppercase tracking-widest flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Deleting...
              </>
            ) : (
              "Confirm Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
