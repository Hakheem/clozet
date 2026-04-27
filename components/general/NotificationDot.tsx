"use client";

import { useEffect, useState } from "react";
import { getUnreadCount } from "@/actions/notifications";

export default function NotificationDot() {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            const result = await getUnreadCount();
            if (result.success) {
                setUnreadCount(result.count);
            }
        };

        fetchCount();
        // Refresh every minute
        const interval = setInterval(fetchCount, 60000);
        return () => clearInterval(interval);
    }, []);

    if (unreadCount === 0) return null;

    return (
        <span
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background"
            style={{ background: '#EF4444' }} // Bright Red
        />
    );
}
