// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/admin/AdminProductToggle.tsx
//
// Tiny client component used in the admin products table to toggle
// isActive without a full page reload.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState, useTransition } from "react";
import { toggleProductField } from "@/actions/products";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";

export default function AdminProductToggle({
  productId,
  isActive,
}: {
  productId: string;
  isActive: boolean;
}) {
  const [active, setActive] = useState(isActive);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const res = await toggleProductField(productId, "isActive");
      if (res.error) { toast.error(res.error); return; }
      setActive(v => !v);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className="transition-opacity"
      style={{ opacity: isPending ? 0.5 : 1 }}
      title={active ? "Deactivate listing" : "Activate listing"}
    >
      {active
        ? <ToggleRight className="w-5 h-5" style={{ color: "#BFA47A" }} />
        : <ToggleLeft  className="w-5 h-5" style={{ color: "#E4E0D9" }} />}
    </button>
  );
}

