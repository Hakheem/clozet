"use client";

import { useEffect, useState } from "react";
import { getSellerWalletStats, requestPayout } from "@/actions/wallet";
import { Loader2, DollarSign, Clock, CheckCircle, CreditCard, AlertCircle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function SellerEarnings() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    const result = await getSellerWalletStats();
    if (result.success) {
      setStats(result.stats);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handlePayoutRequest = async () => {
    if (!stats || stats.availableBalance < 700) {
      toast.error("Minimum payout is 700 KES");
      return;
    }

    setRequesting(true);
    const result = await requestPayout(stats.availableBalance);
    if (result.success) {
      toast.success("Payout request submitted successfully");
      fetchStats();
    } else {
      toast.error(result.error);
    }
    setRequesting(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Wallet Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#1C1A17] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Available to Withdraw</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">KES {stats.availableBalance.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Ready for transfer</p>
            <Button 
                className="w-full mt-4 bg-[#BFA47A] hover:bg-[#A68F6A] text-[#1C1A17] font-bold"
                disabled={stats.availableBalance < 700 || requesting}
                onClick={handlePayoutRequest}
            >
                {requesting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CreditCard className="h-4 w-4 mr-2" />}
                Withdraw Funds
            </Button>
            {stats.availableBalance < 700 && (
                <p className="text-[10px] text-orange-400 mt-2 text-center">Minimum withdrawal: KES 700</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Clearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ color: "#1C1A17" }}>KES {stats.pendingBalance.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Held for 48h after delivery
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Lifetime Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ color: "#1C1A17" }}>KES {stats.lifetimeEarnings.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Total earned ever</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5" style={{ color: "#BFA47A" }} />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No transactions yet.</div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.transactions.map((t: any) => (
                    <TableRow key={t.id}>
                      <TableCell className="text-xs text-gray-500">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{t.description}</div>
                        {t.transactionMessage && (
                            <div className="text-[10px] text-gray-400">Ref: {t.transactionMessage}</div>
                        )}
                      </TableCell>
                      <TableCell className={`text-sm font-bold ${t.type === 'EARNING' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.type === 'EARNING' ? '+' : '-'} KES {t.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                            variant="outline" 
                            className={
                                t.status === "COMPLETED" ? "bg-green-50 text-green-700 border-green-200" :
                                t.status === "FAILED" ? "bg-red-50 text-red-700 border-red-200" :
                                "bg-yellow-50 text-yellow-700 border-yellow-200"
                            }
                        >
                            {t.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
