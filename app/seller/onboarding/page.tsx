"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Store, Sparkles, ShieldCheck, Banknote, Globe } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ImageUpload from "@/components/ui/image-upload";
import { motion, AnimatePresence } from "framer-motion";

const onboardingSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  shopName: z.string().min(1, "Shop name is required"),
  bio: z.string().min(10, "Tell us a bit more about your shop"),
  location: z.string().min(1, "Location is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  payoutMethod: z.string().min(1, "Payout method is required"),
  payoutDetails: z.string().min(1, "Payout account details are required"),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  tiktok: z.string().optional(),
  image: z.string().optional(),
}).refine((data) => data.instagram || data.facebook || data.tiktok, {
  message: "At least one social media presence is required",
  path: ["instagram"], // Point error to instagram as default
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [tillNumber, setTillNumber] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue, trigger } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      username: "",
      shopName: "",
      bio: "",
      location: "",
      phoneNumber: "",
      payoutMethod: "Mpesa",
      payoutDetails: "",
      instagram: "",
      facebook: "",
      tiktok: "",
      image: "",
    },
  });

  const payoutMethod = watch("payoutMethod");

  const nextStep = async () => {
    let fields: (keyof OnboardingFormData)[] = [];
    if (step === 1) fields = ["shopName", "username", "bio", "location"];
    if (step === 2) {
      if (payoutMethod === "Mpesa") {
        // Concatenate M-Pesa details
        setValue("payoutDetails", tillNumber ? `Phone: ${watch("phoneNumber")}, Till: ${tillNumber}` : watch("phoneNumber"));
      }
      fields = ["phoneNumber", "payoutMethod", "payoutDetails"];
    }
    
    const isValid = await trigger(fields);
    if (isValid) setStep(prev => prev + 1);
  };

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      const response = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          onboarded: true,
          role: "SELLER",
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast.success("Welcome to the inner circle.");
      router.push("/seller");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to complete onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex flex-col lg:flex-row overflow-hidden">
      {/* Narrative Panel */}
      <div className="lg:w-[40%] bg-[#1C1A17] p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-[#BFA47A] flex items-center justify-center">
              <Store className="w-4 h-4 text-[#1C1A17]" />
            </div>
            <span className="text-[#EDE8DF] font-semibold tracking-widest text-xs uppercase">Lukuu Seller</span>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl lg:text-6xl font-light text-[#EDE8DF] leading-tight title mb-6">
              Elevate your <span className="text-[#BFA47A]">Presence.</span>
            </h1>
            <p className="text-[#8A857D] text-lg max-w-sm leading-relaxed">
              Join Kenya's most curated community of independent fashion houses and designers.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 space-y-6">
          {[
            { icon: Sparkles, text: "Reach thousands of fashion-forward buyers" },
            { icon: ShieldCheck, text: "Secure, verified payments & low commission" },
            { icon: Banknote, text: "Fast payouts directly to your preferred account" },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-4 group"
            >
              <div className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center group-hover:border-[#BFA47A] transition-colors">
                <item.icon className="w-5 h-5 text-[#8A857D]" />
              </div>
              <span className="text-[#EDE8DF]/60 text-sm font-medium">{item.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-[#BFA47A]/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-96 h-96 bg-[#BFA47A]/5 blur-[120px] rounded-full" />
      </div>

      {/* Form Panel */}
      <div className="flex-1 bg-[#F7F5F2] overflow-y-auto px-6 py-12 lg:px-20 lg:py-16">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {[1, 2, 3].map(i => (
                <div 
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? "w-12 bg-[#BFA47A]" : "w-6 bg-[#E4E0D9]"}`}
                />
              ))}
            </div>
            <h2 className="text-3xl font-bold text-[#1C1A17]">
              {step === 1 ? "Your Identity" : step === 2 ? "Payout Details" : "Final Touches"}
            </h2>
            <p className="text-[#8A857D] mt-1 text-sm">
              {step === 1 ? "How will the world see your store?" : step === 2 ? "Ensure you get paid on time, every time." : "Add your social presence."}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest text-[#8A857D]">Store Identity Panel</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                        <Label htmlFor="shopName">Shop Name *</Label>
                        <Input id="shopName" placeholder="e.g. Midnight Studios" {...register("shopName")} className="bg-white" />
                        {errors.shopName && <p className="text-[#DC2626] text-[10px] uppercase font-bold">{errors.shopName.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Store Username *</Label>
                        <Input id="username" placeholder="midnight_studios" {...register("username")} className="bg-white" />
                        {errors.username && <p className="text-[#DC2626] text-[10px] uppercase font-bold">{errors.username.message}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Store Bio / Motto *</Label>
                    <textarea 
                      id="bio"
                      rows={4}
                      placeholder="Crafting timeless pieces for the modern nomad..."
                      {...register("bio")}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-[#E4E0D9] text-sm focus:ring-2 focus:ring-[#BFA47A]/20 transition-all resize-none outline-none"
                    />
                    {errors.bio && <p className="text-[#DC2626] text-[10px] uppercase font-bold">{errors.bio.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">City / Location *</Label>
                    <Input id="location" placeholder="Nairobi, KE" {...register("location")} className="bg-white" />
                    {errors.location && <p className="text-[#DC2626] text-[10px] uppercase font-bold">{errors.location.message}</p>}
                  </div>

                  <Button onClick={nextStep} type="button" className="w-full bg-[#1C1A17] hover:bg-[#2C2A27] text-[#EDE8DF] h-12 gap-2 text-xs uppercase tracking-widest font-bold">
                    Continue to Payouts <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Contact Phone Number *</Label>
                      <Input id="phoneNumber" placeholder="+254 7..." {...register("phoneNumber")} className="bg-white" />
                      {errors.phoneNumber && <p className="text-[#DC2626] text-[10px] uppercase font-bold">{errors.phoneNumber.message}</p>}
                    </div>

                    <div className="space-y-4">
                      <Label>Preferred Payout Method *</Label>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {["Mpesa", "Bank", "Airtel", "PayPal"].map(method => (
                          <label 
                            key={method}
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${payoutMethod === method ? "border-[#BFA47A] bg-[#BFA47A]/5" : "border-[#E4E0D9] bg-white hover:border-[#BFA47A]/40"}`}
                          >
                            <input type="radio" value={method} {...register("payoutMethod")} className="sr-only" />
                            <span className="text-xs font-bold uppercase tracking-tighter">{method}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {payoutMethod === "Mpesa" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <Label htmlFor="phoneNumber">M-Pesa Number *</Label>
                             <Input id="phoneNumber" placeholder="07..." {...register("phoneNumber")} className="bg-white" />
                             {errors.phoneNumber && <p className="text-[#DC2626] text-[10px] uppercase font-bold">{errors.phoneNumber.message}</p>}
                          </div>
                          <div className="space-y-2">
                             <Label htmlFor="tillNumber">Till Number (Optional)</Label>
                             <Input 
                                id="tillNumber" 
                                placeholder="54321..." 
                                value={tillNumber}
                                onChange={(e) => setTillNumber(e.target.value)}
                                className="bg-white" 
                             />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor="payoutDetails">Account / Payment Details *</Label>
                          <Input 
                            id="payoutDetails" 
                            placeholder={
                              payoutMethod === "Bank" ? "Bank Name, Account number, Branch" :
                              "Account email or number"
                            }
                            {...register("payoutDetails")} 
                            className="bg-white" 
                          />
                          {errors.payoutDetails && <p className="text-[#DC2626] text-[10px] uppercase font-bold">{errors.payoutDetails.message}</p>}
                        </div>
                      )}
                      <p className="text-[10px] text-[#8A857D] italic px-1">Verification is required before your first payout. Ensure details are accurate.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={() => setStep(1)} variant="outline" type="button" className="flex-1 h-12 text-xs uppercase tracking-widest font-bold border-[#E4E0D9]">Back</Button>
                    <Button onClick={nextStep} type="button" className="flex-[2] bg-[#1C1A17] hover:bg-[#2C2A27] text-[#EDE8DF] h-12 gap-2 text-xs uppercase tracking-widest font-bold">Store Visuals <ArrowRight className="w-4 h-4" /></Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-white border border-[#E4E0D9]">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#BFA47A]/20">
                       <ImageUpload
                          value={watch("image")}
                          onChange={(val) => setValue("image", val)}
                          onClear={() => setValue("image", "")}
                          label="Upload Image"
                          aspectRatio="square"
                        />
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold text-[#1C1A17]">Shop Logo / Profile Photo</h4>
                      <p className="text-xs text-[#8A857D] mt-1">First impressions matter. Recommended 500x500px.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest text-[#8A857D]">Social Presence (Atleast 1 Required)</Label>
                    <div className="space-y-4">
                      <div className="relative">
                        <FaInstagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A857D]" />
                        <Input placeholder="Instagram @handle" className="pl-10 bg-white" {...register("instagram")} />
                      </div>
                      <div className="relative">
                        <FaFacebookF className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A857D]" />
                        <Input placeholder="Facebook URL" className="pl-10 bg-white" {...register("facebook")} />
                      </div>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A857D]" />
                        <Input placeholder="TikTok @handle" className="pl-10 bg-white" {...register("tiktok")} />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={() => setStep(2)} variant="outline" type="button" className="flex-1 h-12 text-xs uppercase tracking-widest font-bold border-[#E4E0D9]">Back</Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-[2] bg-[#BFA47A] hover:bg-[#B09366] text-[#1C1A17] h-12 gap-2 text-xs uppercase tracking-widest font-bold disabled:opacity-50 transition-all"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Complete Setup"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="mt-12 text-center">
             <p className="text-[10px] text-[#8A857D] uppercase tracking-widest">
              By finalizing, you agree to our <a href="/terms" className="text-[#BFA47A] font-bold hover:underline">Seller Partnership Terms</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
