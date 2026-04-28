"use client";

import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole, deleteUser } from "@/actions/users";
import { Loader2, Search, Trash2, Shield, User as UserIcon, Store } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const ROLE_FILTERS = [
  { value: "ALL", label: "All", icon: null },
  { value: "USER", label: "Users", icon: UserIcon },
  { value: "SELLER", label: "Sellers", icon: Store },
  { value: "ADMIN", label: "Admins", icon: Shield },
];

export default function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const fetchUsers = async () => {
    setLoading(true);
    const result = await getAllUsers();
    if (result.success) {
      setUsers(result.users || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    const result = await updateUserRole(userId, newRole);
    if (result.success) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success("User role updated successfully");
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const result = await deleteUser(userId);
    if (result.success) {
      setUsers(users.filter(u => u.id !== userId));
      toast.success("User deleted successfully");
    } else {
      toast.error(result.error);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Count per role
  const roleCounts = {
    ALL: users.length,
    USER: users.filter(u => u.role === "USER").length,
    SELLER: users.filter(u => u.role === "SELLER").length,
    ADMIN: users.filter(u => u.role === "ADMIN").length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 max-w-sm flex-1">
          <Search className="h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
        </div>

        {/* Role Filter Pills */}
        <div className="flex items-center gap-1.5">
          {ROLE_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setRoleFilter(filter.value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                roleFilter === filter.value
                  ? "bg-[#1C1A17] text-white border-[#1C1A17]"
                  : "bg-white text-[#8A857D] border-[#E4E0D9] hover:border-[#1C1A17] hover:text-[#1C1A17]"
              }`}
            >
              {filter.icon && <filter.icon className="h-3 w-3" />}
              {filter.label}
              <span className={`text-[10px] px-1 py-0.5 rounded ${
                roleFilter === filter.value
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}>
                {roleCounts[filter.value as keyof typeof roleCounts]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                  No users found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name || "N/A"}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select 
                      defaultValue={user.role} 
                      onValueChange={(val) => handleRoleUpdate(user.id, val)}
                    >
                      <SelectTrigger className="w-[120px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="SELLER">Seller</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
