"use client";

import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole } from "@/actions/users";
import { Loader2, Search, Store, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function SellersTable() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSellers = async () => {
    setLoading(true);
    const result = await getAllUsers(); // This returns all users, we'll filter for SELLERS
    if (result.success) {
      setSellers((result.users || []).filter((u: any) => u.role === "SELLER"));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const filteredSellers = sellers.filter(s => 
    s.shopName?.toLowerCase().includes(search.toLowerCase()) ||
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 max-w-sm">
        <Search className="h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search sellers or shops..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shop / Seller</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSellers.map((seller) => (
              <TableRow key={seller.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F7F5F2] flex items-center justify-center border">
                        <Store className="h-5 w-5 text-[#BFA47A]" />
                    </div>
                    <div>
                        <div className="font-bold text-sm">{seller.shopName || "No Shop Name"}</div>
                        <div className="text-xs text-gray-500">{seller.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {seller.email}
                    </div>
                    {seller.phoneNumber && (
                        <div className="flex items-center gap-2 text-xs">
                            <Phone className="h-3 w-3 text-gray-400" />
                            {seller.phoneNumber}
                        </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        {seller.location || "N/A"}
                    </div>
                </TableCell>
                <TableCell className="text-xs text-gray-500">
                  {new Date(seller.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs" 
                    render={<a href={`/stores/${seller.id}`} target="_blank">View Store</a>}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
