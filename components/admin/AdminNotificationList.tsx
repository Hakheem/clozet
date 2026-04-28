"use client";

import { useEffect, useState } from "react";
import { getAllNotifications } from "@/actions/notifications";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  Bell,
  Loader2,
  Info,
  AlertTriangle,
  CheckCircle,
  ShoppingBag,
  CreditCard,
  Users,
  Store,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ROLE_TABS = [
  { value: "ALL", label: "All", icon: null },
  { value: "ADMIN", label: "Admin", icon: Shield },
  { value: "SELLER", label: "Seller", icon: Store },
  { value: "USER", label: "User", icon: Users },
];

export default function AdminNotificationList() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");

  const fetchNotifications = async (role: string) => {
    setLoading(true);
    const result = await getAllNotifications(role);
    if (result.success) {
      setNotifications(result.notifications || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications(activeTab);
  }, [activeTab]);

  const getIcon = (type: string) => {
    switch (type) {
      case "ORDER_SUCCESS":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "ORDER_FAILED":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "ORDER_STATUS_UPDATE":
        return <ShoppingBag className="h-4 w-4 text-blue-500" />;
      case "PAYOUT_SUCCESS":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "PAYOUT_FAILED":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "PAYOUT_REQUEST":
        return <CreditCard className="h-4 w-4 text-orange-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge
            variant="outline"
            className="text-[9px] bg-purple-50 text-purple-600 border-purple-200"
          >
            Admin
          </Badge>
        );
      case "SELLER":
        return (
          <Badge
            variant="outline"
            className="text-[9px] bg-amber-50 text-amber-600 border-amber-200"
          >
            Seller
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="text-[9px] bg-blue-50 text-blue-600 border-blue-200"
          >
            User
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Role filter tabs */}
      <div className="flex items-center gap-1.5">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              activeTab === tab.value
                ? "bg-[#1C1A17] text-white border-[#1C1A17]"
                : "bg-white text-[#8A857D] border-[#E4E0D9] hover:border-[#1C1A17] hover:text-[#1C1A17]"
            }`}
          >
            {tab.icon && <tab.icon className="h-3 w-3" />}
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No notifications found.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`${
                !notification.isRead
                  ? "border-primary/20 bg-primary/5"
                  : ""
              }`}
            >
              <CardContent className="p-4 flex items-start gap-4">
                <div className="mt-1">{getIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-[#1C1A17]">
                        {notification.user?.name || "Unknown"}
                      </span>
                      {getRoleBadge(notification.user?.role)}
                    </div>
                  </div>
                  <p
                    className={`text-sm ${
                      !notification.isRead
                        ? "font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                      {formatDistanceToNow(
                        new Date(notification.createdAt),
                        { addSuffix: true }
                      )}
                    </span>
                    {notification.link && (
                      <Link
                        href={notification.link}
                        className="text-[10px] font-medium text-primary hover:underline uppercase tracking-wider"
                      >
                        View Details
                      </Link>
                    )}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-[8px] uppercase tracking-widest shrink-0"
                >
                  {notification.type.replace(/_/g, " ")}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
