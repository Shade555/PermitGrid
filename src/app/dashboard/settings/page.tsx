"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Shield, User, Building, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("John Doe");
  const [businessName, setBusinessName] = useState("Nova Foods Pvt Ltd");

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Settings Navigation */}
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start bg-muted/50 font-medium">
            <User className="w-4 h-4 mr-2" /> Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Building className="w-4 h-4 mr-2" /> Business Details
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Shield className="w-4 h-4 mr-2" /> Security
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </Button>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={userName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" defaultValue={`${userName.toLowerCase().replace(" ", ".")}@company.com`} />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
              <CardDescription>Primary organization linked to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org">Organization Name</Label>
                <Input id="org" defaultValue={businessName} readOnly className="bg-muted" />
                <p className="text-xs text-muted-foreground mt-1">To change your primary business, use the Wizard.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto">
                <LogOut className="w-4 h-4 mr-2" /> Sign Out & Clear Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
