import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Bell, Lock, Globe } from "lucide-react";

export const metadata = {
  title: "Admin Settings | Lukuu",
};

export default function AdminSettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1C1A17" }}>
          Admin Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8A857D" }}>
          Manage platform-wide configurations and security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
              <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5 text-[#BFA47A]" />
                      Platform Security
                  </CardTitle>
                  <CardDescription>Configure authentication and access control.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                      <div>
                          <p className="text-sm font-medium">Seller Verification</p>
                          <p className="text-xs text-gray-500">Require manual approval for new sellers</p>
                      </div>
                      <Badge>Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                      <div>
                          <p className="text-sm font-medium">Payout Minimum</p>
                          <p className="text-xs text-gray-500">Current threshold for withdrawals</p>
                      </div>
                      <Badge variant="outline">KES 700</Badge>
                  </div>
              </CardContent>
          </Card>

          <Card>
              <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                      <Bell className="h-5 w-5 text-[#BFA47A]" />
                      Global Notifications
                  </CardTitle>
                  <CardDescription>Manage how users receive platform updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-600">
                  <p>Global system notifications are currently active for:</p>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li>New Order Placed (Admin/Seller)</li>
                      <li>Payout Requested (Admin)</li>
                      <li>Order Status Update (User)</li>
                      <li>Payout Processed (Seller)</li>
                  </ul>
              </CardContent>
          </Card>
      </div>

      <div className="p-8 border-2 border-dashed rounded-3xl text-center bg-gray-50">
          <Globe className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="font-bold">Advanced Platform Configuration</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">
              Additional platform settings like commission rates, tax configurations, and regional settings will be available in the next version.
          </p>
      </div>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
