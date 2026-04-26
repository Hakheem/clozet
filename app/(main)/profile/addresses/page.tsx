"use client";

import { useEffect, useState } from "react";
import { getAddresses, addAddress, deleteAddress, setDefaultAddress } from "@/actions/addresses";
import { toast } from "sonner";
import { Loader2, Plus, MapPin, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Address = {
    id: string;
    title: string;
    county: string;
    city: string;
    street: string;
    details?: string | null;
    isDefault: boolean;
};

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        title: "",
        county: "",
        city: "",
        street: "",
        details: "",
    });

    const fetchAddresses = async () => {
        setIsLoading(true);
        const res = await getAddresses();
        if (res.success && res.addresses) {
            setAddresses(res.addresses);
        } else {
            toast.error(res.error || "Failed to load addresses");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdding(true);
        const res = await addAddress(formData);
        if (res.success) {
            toast.success("Address added successfully");
            setIsDialogOpen(false);
            setFormData({ title: "", county: "", city: "", street: "", details: "" });
            fetchAddresses();
        } else {
            toast.error(res.error || "Failed to add address");
        }
        setIsAdding(false);
    };

    const handleDelete = async (id: string) => {
        const res = await deleteAddress(id);
        if (res.success) {
            toast.success("Address deleted");
            fetchAddresses();
        } else {
            toast.error(res.error || "Failed to delete address");
        }
    };

    const handleSetDefault = async (id: string) => {
        const res = await setDefaultAddress(id);
        if (res.success) {
            toast.success("Default address updated");
            fetchAddresses();
        } else {
            toast.error(res.error || "Failed to update default address");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-medium title tracking-tight mb-2">Delivery Addresses</h1>
                    <p className="text-sm text-muted-foreground">Manage your shipping locations ({addresses.length}/3).</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            disabled={addresses.length >= 3}
                            className="bg-primary hover:bg-primary/90 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl px-6 h-10 shadow-sm"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add New
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-medium title">New Address</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary">Label / Title</label>
                                <input required type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Home, Office" className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-accent" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary">County</label>
                                    <input required type="text" name="county" value={formData.county} onChange={handleChange} placeholder="Nairobi" className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-accent" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary">City / Town</label>
                                    <input required type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Westlands" className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-accent" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary">Street</label>
                                <input required type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Waiyaki Way" className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-accent" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary">Details (Optional)</label>
                                <input type="text" name="details" value={formData.details} onChange={handleChange} placeholder="Apartment 4B, 2nd Floor" className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-accent" />
                            </div>
                            <Button type="submit" disabled={isAdding} className="w-full mt-4">
                                {isAdding ? "Saving..." : "Save Address"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {addresses.length === 0 ? (
                <div className="text-center py-16 bg-accent/5 rounded-2xl border border-dashed border-border">
                    <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-medium title mb-2">No addresses saved</h3>
                    <p className="text-sm text-muted-foreground">Add a delivery address to checkout faster.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                        <div 
                            key={address.id} 
                            className={`p-5 rounded-2xl border ${address.isDefault ? 'border-accent bg-accent/5' : 'border-border/50 bg-white'} relative group`}
                        >
                            {address.isDefault && (
                                <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm">
                                    <CheckCircle2 className="w-3 h-3" /> Default
                                </span>
                            )}
                            
                            <h3 className="font-bold text-primary mb-1 pr-16">{address.title}</h3>
                            <div className="text-sm text-muted-foreground space-y-0.5 mb-6">
                                <p>{address.street}</p>
                                <p>{address.city}, {address.county}</p>
                                {address.details && <p className="text-[11px] italic mt-1">{address.details}</p>}
                            </div>

                            <div className="flex items-center gap-3 mt-auto">
                                {!address.isDefault && (
                                    <button 
                                        onClick={() => handleSetDefault(address.id)}
                                        className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors"
                                    >
                                        Set as Default
                                    </button>
                                )}
                                <div className="flex-1" />
                                <button 
                                    onClick={() => handleDelete(address.id)}
                                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
