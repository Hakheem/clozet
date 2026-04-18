"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const onboardingSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    shopName: z.string().min(1, "Shop name is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    payoutMethod: z.string().min(1, "Payout method is required"),
    tillNumber: z.string().optional(),
    tillName: z.string().optional(),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
    const router = useRouter();
    const [usePhoneForMpesa, setUsePhoneForMpesa] = useState(true);

    const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<OnboardingFormData>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            username: "",
            shopName: "",
            phoneNumber: "",
            payoutMethod: "",
            tillNumber: "",
            tillName: "",
        },
    });

    const payoutMethod = watch("payoutMethod");

    const onSubmit = async (data: OnboardingFormData) => {
        try {
            const response = await fetch("/api/update-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: data.username,
                    shopName: data.shopName,
                    phoneNumber: data.phoneNumber,
                    payoutMethod: data.payoutMethod,
                    role: "SELLER",
                }),
            });

            if (!response.ok) throw new Error("Failed to update profile");

            toast.success("Onboarding completed!");
            router.push("/seller");
        } catch (error: any) {
            toast.error("Failed to complete onboarding");
            <p className="text-muted-foreground mt-2">
                Set up your seller account
            </p>
                    </div >

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="yourusername"
                                className="h-12 bg-white border-zinc-200 focus-visible:ring-zinc-900"
                                {...register("username")}
                            />
                            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="shopName">Shop Name</Label>
                            <Input
                                id="shopName"
                                type="text"
                                placeholder="Your Shop Name"
                                className="h-12 bg-white border-zinc-200 focus-visible:ring-zinc-900"
                                {...register("shopName")}
                            />
                            {errors.shopName && <p className="text-red-500 text-sm">{errors.shopName.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                type="tel"
                                placeholder="+254712345678"
                                className="h-12 bg-white border-zinc-200 focus-visible:ring-zinc-900"
                                {...register("phoneNumber")}
                            />
                            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="payoutMethod">Preferred Payout Method</Label>
                            <select
                                id="payoutMethod"
                                className="w-full h-12 bg-white border border-zinc-200 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                                {...register("payoutMethod")}
                            >
                                <option value="">Select payout method</option>
                                <option value="Mpesa Number">Mpesa Number</option>
                                <option value="Mpesa Till">Mpesa Till</option>
                                <option value="Airtel Money">Airtel Money</option>
                                <option value="Bank">Bank Transfer</option>
                                <option value="PayPal">PayPal</option>
                            </select>
                            {errors.payoutMethod && <p className="text-red-500 text-sm">{errors.payoutMethod.message}</p>}
                        </div>

                        {payoutMethod === "Mpesa Number" && (
                            <div className="space-y-2">
                                <Label>Use phone number for Mpesa payouts?</Label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="usePhone"
                                            checked={usePhoneForMpesa}
                                            onChange={() => setUsePhoneForMpesa(true)}
                                        />
                                        Yes
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="usePhone"
                                            checked={!usePhoneForMpesa}
                                            onChange={() => setUsePhoneForMpesa(false)}
                                        />
                                        No, use different number
                                    </label>
                                </div>
                                {!usePhoneForMpesa && (
                                    <Input
                                        type="tel"
                                        placeholder="Mpesa number"
                                        className="h-12 bg-white border-zinc-200 focus-visible:ring-zinc-900"
                                    />
                                )}
                            </div>
                        )}

                        {payoutMethod === "Mpesa Till" && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="tillNumber">Till Number</Label>
                                    <Input
                                        id="tillNumber"
                                        type="text"
                                        placeholder="Till number"
                                        className="h-12 bg-white border-zinc-200 focus-visible:ring-zinc-900"
                                        {...register("tillNumber")}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tillName">Till Name</Label>
                                    <Input
                                        id="tillName"
                                        type="text"
                                        placeholder="Till name"
                                        className="h-12 bg-white border-zinc-200 focus-visible:ring-zinc-900"
                                        {...register("tillName")}
                                    />
                                </div>
                            </>
                        )}

                        {payoutMethod === "Airtel Money" && (
                            <div className="space-y-2">
                                <Label htmlFor="airtelNumber">Airtel Money Number</Label>
                                <Input
                                    id="airtelNumber"
                                    type="tel"
                                    placeholder="Airtel number"
                                    className="h-12 bg-white border-zinc-200 focus-visible:ring-zinc-900"
                                />
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Complete Setup"
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-xs text-zinc-500">
                        By completing setup, you agree to our{" "}
                        <a href="/terms" className="underline hover:text-zinc-900">Terms of Service</a> and{" "}
                        <a href="/privacy" className="underline hover:text-zinc-900">Privacy Policy</a>.
                    </div>
                </div >
            </div >
        </div >
    );
}