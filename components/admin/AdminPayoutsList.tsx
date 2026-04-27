"use client";

import { useEffect, useState } from "react";
import { getAllPayoutRequests, fulfillPayout } from "@/actions/wallet";
import { Loader2, CheckCircle, XCircle, Clock, CreditCard, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";

export default function AdminPayoutsList() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    const result = await getAllPayoutRequests();
    if (result.success) {
      setRequests(result.requests || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleFulfill = async (id: string, success: boolean) => {
    setIsProcessing(true);
    const result = await fulfillPayout(id, success, message);
    if (result.success) {
      toast.success(success ? "Payout marked as completed" : "Payout marked as failed");
      fetchRequests();
      setSelectedId(null);
      setMessage("");
    } else {
      toast.error(result.error);
    }
    setIsProcessing(false);
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
            <TableHead>Date</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payout Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="text-xs text-gray-500">
                {new Date(request.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{request.wallet.seller.shopName || request.wallet.seller.name}</span>
                  <span className="text-[10px] text-gray-500">{request.wallet.seller.email}</span>
                </div>
              </TableCell>
              <TableCell className="font-bold text-green-600">
                KES {request.amount.toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="flex flex-col text-xs">
                  <span className="font-semibold uppercase">{request.wallet.seller.payoutMethod || "N/A"}</span>
                  <span className="text-gray-500">{request.wallet.seller.payoutDetails || "N/A"}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                    variant="outline" 
                    className={
                        request.status === "COMPLETED" ? "bg-green-50 text-green-700 border-green-200" :
                        request.status === "FAILED" ? "bg-red-50 text-red-700 border-red-200" :
                        "bg-yellow-50 text-yellow-700 border-yellow-200"
                    }
                >
                    {request.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {request.status === "PENDING" && (
                    <div className="flex justify-end gap-2">
                        <Dialog>
                            <DialogTrigger
                                render={
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs h-8">
                                        Fulfill
                                    </Button>
                                }
                            />
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Complete Payout</DialogTitle>
                                    <DialogDescription>
                                        Enter the transaction reference or a message to the seller as proof of payment.
                                    </DialogDescription>
                                </DialogHeader>
                                <Input 
                                    placeholder="e.g. M-Pesa Transaction ID: RDH7G9SK" 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <DialogFooter>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setMessage("")}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        disabled={isProcessing || !message}
                                        onClick={() => handleFulfill(request.id, true)}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        Mark as Paid
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 border-red-200 hover:bg-red-50 text-xs h-8"
                            onClick={() => {
                                const msg = prompt("Enter failure reason:");
                                if (msg) {
                                    setMessage(msg);
                                    handleFulfill(request.id, false);
                                }
                            }}
                        >
                            Reject
                        </Button>
                    </div>
                )}
                {request.transactionMessage && (
                    <span className="text-[10px] text-gray-400 italic">
                        Ref: {request.transactionMessage}
                    </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
