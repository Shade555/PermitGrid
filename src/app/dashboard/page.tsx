"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, CircleDashed, Clock, FileWarning } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardOverview() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>({ business_name: "Nova Foods Pvt Ltd", project_stage: "Pre-establishment" });
  const [approvals, setApprovals] = useState<any[]>([]);

  useEffect(() => {
    const savedProf = localStorage.getItem("permitgrid_profile");
    if (savedProf) {
      try { setProfile(JSON.parse(savedProf)); } catch(e) {}
    }
    const savedApp = localStorage.getItem("permitgrid_approvals");
    if (savedApp) {
      try { setApprovals(JSON.parse(savedApp)); } catch(e) {}
    }
  }, []);

  const total = approvals.length > 0 ? approvals.length : 12;
  // Make it look dynamic: 1 completed, 1 in progress, rest pending
  const completed = approvals.length > 0 ? 1 : 7;
  const inProgress = approvals.length > 0 ? 1 : 3;
  const pending = total - completed - inProgress;
  const progressPercent = Math.round((completed / total) * 100);

  const actions = approvals.length > 0 ? [
    { text: `Upload site plan for ${approvals[0]?.name}`, type: "document", link: "/dashboard/documents" },
    { text: `Respond to query on ${approvals[1]?.name || 'Factory Registration'}`, type: "review", link: "/dashboard/tracker" }
  ] : [
    { text: "Upload revised site plan for Building Approval", type: "document", link: "/dashboard/documents" },
    { text: "Review MPCB application draft", type: "review", link: "/dashboard/tracker" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-1">What do you need to do next to legally move your project forward?</p>
        </div>
        <Link href="/wizard?new=true">
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-md">
            + Add New Business
          </Button>
        </Link>
      </div>

      {/* Progress Section */}
      <Card className="border-primary/20 shadow-lg shadow-primary/5">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Approval Journey</CardTitle>
          <CardDescription>Your overall compliance progress for {profile.business_name || "your business"}.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex-1">
              <Progress value={progressPercent} className="h-3" />
            </div>
            <span className="font-bold text-xl text-primary">{progressPercent}%</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Stage: {profile.project_stage || "Planning"}</span>
            <span>Target Operations: Q4 2026</span>
          </div>
        </CardContent>
      </Card>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Approvals</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold text-success flex items-center gap-2">
              {completed} <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold text-primary flex items-center gap-2">
              {inProgress} <CircleDashed className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending / Overdue</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold text-destructive flex items-center gap-2">
              {pending} <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Critical Actions */}
        <Card className="border-warning/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileWarning className="w-5 h-5 text-warning" />
              <CardTitle>Critical Actions</CardTitle>
            </div>
            <CardDescription>Immediate steps required to unblock your workflow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {actions.map((action, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/30">
                <div className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center shrink-0 text-xs font-medium">
                  {i + 1}
                </div>
                <div className="flex-1 text-sm font-medium pt-0.5">{action.text}</div>
                <Button size="sm" variant="ghost" className="h-7 px-2 hover:bg-primary/10 hover:text-primary" onClick={() => router.push(action.link)}>Act</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Up Next in Grid */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Approval Workflow</CardTitle>
              <CardDescription>Current active requirements in your grid.</CardDescription>
            </div>
            <Link href="/dashboard/grid">
              <Button variant="outline" size="sm" className="gap-2">
                View Full Grid <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
              {approvals.length > 0 ? (
                <>
                  <div className="relative pl-6 border-l-2 border-success pb-4">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-success ring-4 ring-background" />
                    <h4 className="text-sm font-semibold">{approvals[2]?.name || 'Business Registration'}</h4>
                    <p className="text-xs text-muted-foreground mt-1">Approved ? Recently</p>
                  </div>
                  <div className="relative pl-6 border-l-2 border-primary pb-4">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary ring-4 ring-background animate-pulse" />
                    <h4 className="text-sm font-semibold">{approvals[0]?.name || 'Consent to Establish'}</h4>
                    <Badge variant="secondary" className="mt-2 text-[10px] bg-primary/10 text-primary hover:bg-primary/20">Under Review</Badge>
                  </div>
                  <div className="relative pl-6 border-l-2 border-muted">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-muted ring-4 ring-background" />
                    <h4 className="text-sm font-semibold text-muted-foreground">{approvals[1]?.name || 'FSSAI Licence'}</h4>
                    <p className="text-xs text-muted-foreground mt-1">Dependent on previous approvals</p>
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Complete the wizard to populate your workflow.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
