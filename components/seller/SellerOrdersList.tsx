"use client";

import { useEffect, useState } from "react";
import { getMySellerOrders, updateOrderItemStatus } from "@/actions/orders";
import { Loader2, Package, ShoppingBag, Truck, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";

export default function SellerOrdersList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const result = await getMySellerOrders();
    if (result.success) {
      setOrders(result.orders || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderItemId: string, newStatus: string) => {
    const result = await updateOrderItemStatus(orderItemId, newStatus);
    if (result.success) {
      toast.success(`Item marked as ${newStatus.toLowerCase()}`);
      fetchOrders();
    } else {
      toast.error(result.error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "bg-green-100 text-green-700 border-green-200";
      case "SHIPPED": return "bg-blue-100 text-blue-700 border-blue-200";
      case "PENDING": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "DISPUTED": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed">
        <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium">No orders found for your products.</p>
      </Card>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Earnings</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            order.items.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="text-xs font-mono">
                  #{order.id.slice(0, 8)}
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs">
                    <div className="font-medium">{order.buyer?.name}</div>
                    <div className="text-gray-500">{order.buyer?.phoneNumber}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {item.product.images?.[0] && (
                        <img src={item.product.images[0]} alt="" className="w-8 h-8 rounded object-cover border" />
                    )}
                    <div className="text-xs max-w-[150px] truncate">
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-gray-400">Qty: {item.quantity}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getStatusColor(item.status)} py-0 h-5`}>
                    {item.status}
                  </Badge>
                  {item.deliveredAt && (
                      <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Delivered: {new Date(item.deliveredAt).toLocaleDateString()}
                      </div>
                  )}
                </TableCell>
                <TableCell className="text-xs font-bold">
                  KES {(item.price * item.quantity).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <Select 
                    defaultValue={item.status} 
                    onValueChange={(val) => handleStatusUpdate(item.id, val)}
                  >
                    <SelectTrigger className="h-8 text-xs w-[110px] ml-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
