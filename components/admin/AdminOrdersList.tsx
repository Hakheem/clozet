"use client";

import { useEffect, useState } from "react";
import { getAllOrders, updateOrderItemStatus } from "@/actions/orders";
import { Loader2, Package, ShoppingBag, Truck, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

export default function AdminOrdersList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const result = await getAllOrders();
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
      // Refresh or update local state
      fetchOrders();
      toast.success("Order status updated");
    } else {
      toast.error(result.error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "bg-green-100 text-green-700 border-green-200";
      case "SHIPPED": return "bg-blue-100 text-blue-700 border-blue-200";
      case "PENDING": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
      case "DISPUTED": return "bg-orange-100 text-orange-700 border-orange-200";
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs">
                {order.id.slice(0, 8)}...
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{order.buyer?.name}</span>
                  <span className="text-[10px] text-gray-500">{order.buyer?.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-2 text-xs">
                      <Badge variant="outline" className={`${getStatusColor(item.status)} py-0 h-5 px-1.5`}>
                        {item.status}
                      </Badge>
                      <span className="truncate max-w-[150px]">{item.product.name}</span>
                      <span className="text-gray-400">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell className="font-bold">
                KES {order.total.toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge 
                    className={order.paymentStatus === "COMPLETED" ? "bg-green-500" : "bg-yellow-500"}
                >
                    {order.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell>
                 <div className="space-y-2">
                    {order.items.map((item: any) => (
                         <div key={`act-${item.id}`} className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 truncate max-w-[60px]">{item.product.name}</span>
                            <Select 
                                defaultValue={item.status} 
                                onValueChange={(val) => handleStatusUpdate(item.id, val)}
                            >
                                <SelectTrigger className="h-7 text-[10px] w-[100px]">
                                <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    <SelectItem value="DISPUTED">Disputed</SelectItem>
                                </SelectContent>
                            </Select>
                         </div>
                    ))}
                 </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
