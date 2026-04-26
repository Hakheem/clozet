"use client";

import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/actions/profile";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        phoneNumber: "",
        bio: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await getProfile();
            if (res.success && res.user) {
                setFormData({
                    name: res.user.name || "",
                    username: res.user.username || "",
                    phoneNumber: res.user.phoneNumber || "",
                    bio: res.user.bio || "",
                });
            } else {
                toast.error(res.error || "Failed to load profile");
            }
            setIsLoading(false);
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const res = await updateProfile(formData);
        if (res.success) {
            toast.success("Profile updated successfully");
        } else {
            toast.error(res.error || "Failed to update profile");
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-medium title tracking-tight mb-2">Personal Information</h1>
            <p className="text-sm text-muted-foreground mb-8">Update your personal details and how we can reach you.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-primary">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-border/50 px-4 py-3 bg-accent/5 focus:bg-white focus:border-accent outline-none transition-colors text-sm"
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-primary">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-border/50 px-4 py-3 bg-accent/5 focus:bg-white focus:border-accent outline-none transition-colors text-sm"
                            placeholder="johndoe"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-primary">Phone Number</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-border/50 px-4 py-3 bg-accent/5 focus:bg-white focus:border-accent outline-none transition-colors text-sm"
                        placeholder="254700000000"
                    />
                    <p className="text-[10px] text-muted-foreground">Used for M-Pesa payments and delivery updates.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-primary">Bio (Optional)</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        className="w-full rounded-xl border border-border/50 px-4 py-3 bg-accent/5 focus:bg-white focus:border-accent outline-none transition-colors text-sm resize-none"
                        placeholder="A little bit about you..."
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-8 py-3 bg-primary text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSaving && <Loader2 className="w-3 h-3 animate-spin" />}
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
