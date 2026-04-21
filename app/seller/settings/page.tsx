"use client";

import { useSession } from "@/lib/auth-client";
import { 
  Store, 
  MapPin, 
  Instagram, 
  Facebook, 
  Globe,
  Settings as SettingsIcon,
  CreditCard,
  User,
  Shield,
  Save,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { motion } from "framer-motion";

export default function SellerSettingsPage() {
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings updated successfully");
    }, 1000);
  };

  return (
    <div className="p-8 pb-20 space-y-10 max-w-5xl mx-auto">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#BFA47A]">
            — Configuration
          </p>
          <h1 className="text-4xl font-light text-[#1C1A17] title">
            Store <span className="font-normal">Settings</span>
          </h1>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#1C1A17] hover:bg-[#2C2A27] text-[#EDE8DF] px-8 h-12 rounded-full text-xs font-bold uppercase tracking-widest gap-2 shadow-lg shadow-black/5"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E4E0D9] p-2">
            {[
              { label: "Profile Identity", icon: User, active: true },
              { label: "Payout Preferences", icon: CreditCard },
              { label: "Security & Access", icon: Shield },
              { label: "Notifications", icon: SettingsIcon },
            ].map((item, i) => (
              <button 
                key={i}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${item.active ? "bg-[#1C1A17] text-[#EDE8DF]" : "text-[#8A857D] hover:bg-[#F7F5F2]"}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="bg-[#BFA47A]/5 border border-[#BFA47A]/20 p-6 rounded-2xl">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#BFA47A] mb-2">Pro Tip</h4>
            <p className="text-xs text-[#8A857D] leading-relaxed">
              Complete your social profiles to increase buyer trust by up to 40%.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Store Visibility */}
          <section className="bg-white p-8 rounded-3xl border border-[#E4E0D9] space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#F7F5F2] flex items-center justify-center">
                <Store className="w-6 h-6 text-[#BFA47A]" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1C1A17]">Basic Identity</h3>
                <p className="text-xs text-[#8A857D]">How your store appears on the platform.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 text-[#EDE8DF]">
                <Label htmlFor="shopName" className="text-[#8A857D] text-[10px] uppercase font-bold tracking-widest">Shop Display Name</Label>
                <Input id="shopName" defaultValue={session?.user?.shopName || ""} className="bg-[#F7F5F2] border-none" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[#8A857D] text-[10px] uppercase font-bold tracking-widest">Unique Username</Label>
                <Input id="username" defaultValue={session?.user?.username || ""} className="bg-[#F7F5F2] border-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-[#8A857D] text-[10px] uppercase font-bold tracking-widest">Store Bio / Description</Label>
              <textarea 
                id="bio"
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-[#F7F5F2] border-none text-sm focus:ring-2 focus:ring-[#BFA47A]/20 transition-all outline-none resize-none"
                defaultValue={(session?.user as any)?.bio || ""}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-[#8A857D] text-[10px] uppercase font-bold tracking-widest">Primary Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BFA47A]" />
                  <Input id="location" className="pl-10 bg-[#F7F5F2] border-none" defaultValue={(session?.user as any)?.location || ""} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#8A857D] text-[10px] uppercase font-bold tracking-widest">Contact Phone</Label>
                <Input id="phone" className="bg-[#F7F5F2] border-none" defaultValue={(session?.user as any)?.phoneNumber || ""} />
              </div>
            </div>
          </section>

          {/* Social Presence */}
          <section className="bg-[#1C1A17] p-8 rounded-3xl shadow-xl shadow-black/10 space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-[#BFA47A]" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#EDE8DF]">Social Integration</h3>
                <p className="text-xs text-[#8A857D]">Connect your fashion presence.</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { icon: Instagram, label: "Instagram Handle", key: "instagram", prefix: "@" },
                { icon: Facebook, label: "Facebook Link", key: "facebook", prefix: "fb.com/" },
                { icon: Globe, label: "TikTok Handle", key: "tiktok", prefix: "@" },
              ].map((social, i) => (
                <div key={i} className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 focus-within:border-[#BFA47A] transition-all">
                  <div className="p-2 rounded-xl bg-white/5 group-hover:bg-[#BFA47A] transition-all">
                    <social.icon className="w-4 h-4 text-[#EDE8DF] group-hover:text-[#1C1A17]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[9px] uppercase font-bold tracking-widest text-[#8A857D] mb-1">{social.label}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-[#8A857D]/50 font-bold">{social.prefix}</span>
                      <input 
                        className="bg-transparent border-none outline-none text-xs font-bold text-white w-full"
                        defaultValue={(session?.user as any)?.[social.key] || ""}
                        placeholder="your_account"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
