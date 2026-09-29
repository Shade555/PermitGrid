"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Shield, User, Building, LogOut, DownloadCloud, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [activeTab, setActiveTab] = useState<"profile" | "business" | "security" | "notifications">("profile");

  useEffect(() => {
    const savedName = localStorage.getItem("permitgrid_user_name");
    if (savedName) setUserName(savedName);

    const savedProfile = localStorage.getItem("permitgrid_profile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.business_name) setBusinessName(parsed.business_name);
      } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("permitgrid_user_name");
    localStorage.removeItem("permitgrid_profile");
    localStorage.removeItem("permitgrid_approvals");
    router.push("/");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings, business preferences, and notifications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Settings Navigation */}
        <div className="space-y-1 md:col-span-1">
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab("profile")}
            className={`w-full justify-start ${activeTab === "profile" ? "bg-muted/50 font-medium" : "text-muted-foreground"}`}
          >
            <User className="w-4 h-4 mr-2" /> Profile
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab("business")}
            className={`w-full justify-start ${activeTab === "business" ? "bg-muted/50 font-medium" : "text-muted-foreground"}`}
          >
            <Building className="w-4 h-4 mr-2" /> Business Details
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab("security")}
            className={`w-full justify-start ${activeTab === "security" ? "bg-muted/50 font-medium" : "text-muted-foreground"}`}
          >
            <Shield className="w-4 h-4 mr-2" /> Security
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab("notifications")}
            className={`w-full justify-start ${activeTab === "notifications" ? "bg-muted/50 font-medium" : "text-muted-foreground"}`}
          >
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </Button>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-6">
          
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input key={userName} id="name" defaultValue={userName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input key={userName + "-email"} id="email" defaultValue={`${userName.toLowerCase().replace(/\s+/g, ".")}@company.com`} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-border pt-6">
                <Button variant="outline" onClick={handleLogout} className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20">
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          )}

          {/* BUSINESS TAB */}
          {activeTab === "business" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Business Profile</CardTitle>
                  <CardDescription>Primary organization linked to your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="org">Organization Name</Label>
                    <Input key={businessName} id="org" defaultValue={businessName} readOnly className="bg-muted" />
                    <p className="text-xs text-muted-foreground mt-1">To change your primary business, use the Wizard.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gst">GSTIN (Optional)</Label>
                    <Input id="gst" placeholder="27XXXXX1234X1ZX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pan">Company PAN (Optional)</Label>
                    <Input id="pan" placeholder="ABCDE1234F" />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border pt-6">
                  <Button>Save Business Details</Button>
                </CardFooter>
              </Card>

              <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Danger Zone
                  </CardTitle>
                  <CardDescription>Irreversible actions for your business profile.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto">
                    Delete Business Profile
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security & Authentication</CardTitle>
                <CardDescription>Manage your password and security preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Change Password</h3>
                  <div className="space-y-2">
                    <Label htmlFor="current">Current Password</Label>
                    <Input id="current" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new">New Password</Label>
                    <Input id="new" type="password" />
                  </div>
                  <Button variant="secondary" className="mt-2">Update Password</Button>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="text-sm font-medium mb-4">Two-Factor Authentication (2FA)</h3>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Authenticator App</p>
                      <p className="text-xs text-muted-foreground">Use an app like Google Authenticator to secure your account.</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how PermitGrid communicates with you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Email Alerts</p>
                      <p className="text-xs text-muted-foreground">Receive daily summaries of your approval status.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Renewal Reminders</p>
                      <p className="text-xs text-muted-foreground">Get notified 30 days before a licence expires.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Government Queries</p>
                      <p className="text-xs text-muted-foreground">Instant alerts when an inspector raises a query.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Marketing & Updates</p>
                      <p className="text-xs text-muted-foreground">News about new government schemes and incentives.</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
