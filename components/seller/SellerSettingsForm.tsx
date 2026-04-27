"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { updateProfile } from "@/actions/profile"; 
import { Loader2, Save, Store, MapPin, Phone, Globe, CreditCard } from "lucide-react";
import { LuFacebook, LuInstagram } from 'react-icons/lu'
import { PiTiktokLogo } from "react-icons/pi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SellerSettingsForm() {
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopName: "",
    bio: "",
    location: "",
    phoneNumber: "",
    instagram: "",
    facebook: "",
    tiktok: "",
    payoutMethod: "",
    payoutDetails: "",
  });

  useEffect(() => {
    if (session?.user) {
      const u = session.user as any;
      setFormData({
        shopName: u.shopName || "",
        bio: u.bio || "",
        location: u.location || "",
        phoneNumber: u.phoneNumber || "",
        instagram: u.instagram || "",
        facebook: u.facebook || "",
        tiktok: u.tiktok || "",
        payoutMethod: u.payoutMethod || "",
        payoutDetails: u.payoutDetails || "",
      });
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateProfile(formData);
    if (result.success) {
      toast.success("Settings updated successfully");
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  if (isPending) return <Loader2 className="h-8 w-8 animate-spin mx-auto" />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shop Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              Shop Profile
            </CardTitle>
            <CardDescription>This information is visible to customers on your store page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shopName">Shop Name</Label>
              <Input id="shopName" name="shopName" value={formData.shopName} onChange={handleChange} placeholder="e.g. Vintage Vault" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">About your Shop</Label>
              <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell customers about your products..." rows={4} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="location" name="location" value={formData.location} onChange={handleChange} className="pl-10" placeholder="e.g. Nairobi, CBD" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payout Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payout Information
            </CardTitle>
            <CardDescription>Where should we send your earnings?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payoutMethod">Payout Method</Label>
              <Input id="payoutMethod" name="payoutMethod" value={formData.payoutMethod} onChange={handleChange} placeholder="e.g. M-Pesa" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payoutDetails">Account / Phone Number</Label>
              <Input id="payoutDetails" name="payoutDetails" value={formData.payoutDetails} onChange={handleChange} placeholder="e.g. 0712345678" />
            </div>
            <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-xs">
                Ensure your payout details are correct to avoid delays in processing your withdrawals.
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Social Presence</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><LuInstagram className="h-4 w-4" /> Instagram</Label>
              <Input name="instagram" value={formData.instagram} onChange={handleChange} placeholder="@username" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><LuFacebook className="h-4 w-4" /> Facebook</Label>
              <Input name="facebook" value={formData.facebook} onChange={handleChange} placeholder="fb.com/page" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">TikTok</Label>
              <Input name="tiktok" value={formData.tiktok} onChange={handleChange} placeholder="@username" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="px-8 bg-[#1C1A17] text-white">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
