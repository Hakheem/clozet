"use client";

import { useEffect, useState } from "react";
import { getMyNotifications, markAsRead, markAllAsRead } from "@/actions/notifications";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Bell, Check, Loader2, Info, AlertTriangle, CheckCircle, ShoppingBag, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NotificationList() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        setLoading(true);
        const result = await getMyNotifications();
        if (result.success) {
            setNotifications(result.notifications || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id: string) => {
        const result = await markAsRead(id);
        if (result.success) {
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        }
    };

    const handleMarkAllAsRead = async () => {
        const result = await markAllAsRead();
        if (result.success) {
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "ORDER_SUCCESS": return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "ORDER_FAILED": return <AlertTriangle className="h-4 w-4 text-red-500" />;
            case "ORDER_STATUS_UPDATE": return <ShoppingBag className="h-4 w-4 text-blue-500" />;
            case "PAYOUT_SUCCESS": return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "PAYOUT_FAILED": return <AlertTriangle className="h-4 w-4 text-red-500" />;
            case "PAYOUT_REQUEST": return <CreditCard className="h-4 w-4 text-orange-500" />;
            default: return <Info className="h-4 w-4 text-gray-500" />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No notifications yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} className="text-xs">
                    Mark all as read
                </Button>
            </div>
            <div className="grid gap-3">
                {notifications.map((notification) => (
                    <Card key={notification.id} className={`${!notification.isRead ? 'border-primary/20 bg-primary/5' : ''}`}>
                        <CardContent className="p-4 flex items-start gap-4">
                            <div className="mt-1">
                                {getIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <p className={`text-sm ${!notification.isRead ? 'font-semibold' : 'text-gray-700'}`}>
                                        {notification.message}
                                    </p>
                                    {!notification.isRead && (
                                        <button 
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="text-xs text-primary hover:underline flex-shrink-0"
                                        >
                                            Mark read
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                    </span>
                                    {notification.link && (
                                        <Link 
                                            href={notification.link} 
                                            className="text-[10px] font-medium text-primary hover:underline uppercase tracking-wider"
                                            onClick={() => handleMarkAsRead(notification.id)}
                                        >
                                            View Details
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
