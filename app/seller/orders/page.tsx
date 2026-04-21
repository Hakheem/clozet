"use client";

import { useState } from "react";
import { 
  ShoppingBag, 
  Search, 
  SlidersHorizontal, 
  ChevronRight,
  ExternalLink,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  User,
  ArrowUpRight,
  Filter
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const mockOrders = [
  { 
    id: "9021", 
    customer: "Khadija Hassan", 
    date: "May 18, 2024", 
    amount: 14500, 
    status: "PENDING",
    items: 3,
    avatar: "KH"
  },
  { 
    id: "9020", 
    customer: "Brian Otieno", 
    date: "May 17, 2024", 
    amount: 8900, 
    status: "SHIPPED",
    items: 1,
    avatar: "BO"
  },
  { 
    id: "9019", 
    customer: "Sarah Wanjiku", 
    date: "May 15, 2024", 
    amount: 22000, 
    status: "DELIVERED",
    items: 5,
    avatar: "SW"
  },
  { 
    id: "9018", 
    customer: "Liam Neeson", 
    date: "May 14, 2024", 
    amount: 4500, 
    status: "CANCELLED",
    items: 1,
    avatar: "LN"
  },
];

const STATUS_CONFIG = {
  PENDING: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  CONFIRMED: { icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  SHIPPED: { icon: Truck, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
  DELIVERED: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  CANCELLED: { icon: Clock, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
};

export default function SellerOrdersPage() {
  const [activeTab, setActiveTab] = useState("ALL");

  return (
    <div className="p-8 space-y-10 min-h-full">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#BFA47A]">
            — Order Fulfillment
          </p>
          <h1 className="text-4xl font-light text-[#1C1A17] title">
            Customer <span className="font-normal">Orders</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full h-12 px-6 border-[#E4E0D9] text-xs font-bold uppercase tracking-widest gap-2">
            <Filter className="w-4 h-4" />
            Sort By
          </Button>
        </div>
      </header>

      {/* Status Tabs */}
      <div className="flex border-b border-[#E4E0D9] overflow-x-auto no-scrollbar">
        {["ALL", "PENDING", "SHIPPED", "DELIVERED", "CANCELLED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === tab ? "text-[#1C1A17]" : "text-[#8A857D] hover:text-[#1C1A17]"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 w-full h-[2px] bg-[#BFA47A]" 
              />
            )}
          </button>
        ))}
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-3xl border border-[#E4E0D9] flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A857D]" />
          <Input 
            placeholder="Search by Order ID or Name..." 
            className="pl-12 bg-[#F7F5F2] border-none h-12 rounded-2xl text-xs font-medium"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <div className="hidden lg:grid grid-cols-[120px_1fr_150px_150px_150px_120px] gap-6 px-10 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A857D]">
          <span>Order ID</span>
          <span>Customer</span>
          <span>Order Date</span>
          <span>Total</span>
          <span>Status</span>
          <span className="text-right">Action</span>
        </div>

        <AnimatePresence>
          {mockOrders.map((order, i) => {
            const config = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-[#E4E0D9] rounded-3xl p-6 lg:px-10 group hover:border-[#1C1A17] transition-all relative"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[120px_1fr_150px_150px_150px_120px] gap-6 items-center">
                  {/* Order ID */}
                  <span className="text-sm font-bold text-[#1C1A17]">#LUK-{order.id}</span>

                  {/* Customer Identity */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F7F5F2] border border-[#E4E0D9] flex items-center justify-center text-[10px] font-bold text-[#1C1A17]">
                      {order.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1C1A17]">{order.customer}</h4>
                      <p className="text-[10px] text-[#8A857D] uppercase font-bold tracking-widest">{order.items} Items</p>
                    </div>
                  </div>

                  {/* Date */}
                  <span className="text-xs font-medium text-[#8A857D]">{order.date}</span>

                  {/* Monetary */}
                  <span className="text-sm font-bold text-[#1C1A17]">KES {order.amount.toLocaleString()}</span>

                  {/* Status Badge */}
                  <div className="flex items-center">
                    <Badge variant="outline" className={`gap-2 h-8 px-4 rounded-full text-[9px] font-bold uppercase tracking-widest ${config.bg} ${config.color} ${config.border}`}>
                      <config.icon className="w-3 h-3" />
                      {order.status}
                    </Badge>
                  </div>

                  {/* Quick Action */}
                  <div className="flex justify-end">
                    <Link 
                      href={`/seller/orders/${order.id}`}
                      className="w-10 h-10 rounded-full border border-[#E4E0D9] flex items-center justify-center text-[#8A857D] hover:bg-[#1C1A17] hover:text-[#EDE8DF] hover:border-[#1C1A17] transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Helpful Hint */}
      <div className="flex items-center gap-3 p-6 rounded-3xl bg-[#BFA47A]/5 border border-[#BFA47A]/20">
        <ArrowUpRight className="w-5 h-5 text-[#BFA47A]" />
        <p className="text-[10px] text-[#8A857D] font-bold uppercase tracking-widest leading-relaxed">
          Optimize your workflow: Shipped orders must be updated with tracking info within 24 hours to maintain your <span className="text-[#1C1A17]">Gold Merchant</span> status.
        </p>
      </div>
    </div>
  );
}
