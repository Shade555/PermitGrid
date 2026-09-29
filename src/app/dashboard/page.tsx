import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, CircleDashed, Clock, FileWarning } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardOverview() {
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
          <CardDescription>Your overall compliance progress for Nova Foods Pvt Ltd.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex-1">
              <Progress value={72} className="h-3" />
            </div>
            <span className="font-bold text-xl text-primary">72%</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Stage: Pre-establishment</span>
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
            <div className="text-3xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold text-success flex items-center gap-2">
              7 <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold text-primary flex items-center gap-2">
              3 <CircleDashed className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending / Overdue</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold text-destructive flex items-center gap-2">
              2 <Clock className="w-5 h-5" />
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
            {[
              { text: "Upload revised site plan for Building Approval", type: "document" },
              { text: "Complete FSSAI facility details", type: "form" },
              { text: "Review MPCB application draft", type: "review" },
            ].map((action, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/30">
                <div className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center shrink-0 text-xs font-medium">
                  {i + 1}
                </div>
                <div className="flex-1 text-sm font-medium pt-0.5">{action.text}</div>
                <Button size="sm" variant="ghost" className="h-7 px-2">Act</Button>
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
              <div className="relative pl-6 border-l-2 border-success pb-4">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-success ring-4 ring-background" />
                <h4 className="text-sm font-semibold">Business Registration</h4>
                <p className="text-xs text-muted-foreground mt-1">Approved • 12 Aug 2026</p>
              </div>
              <div className="relative pl-6 border-l-2 border-primary pb-4">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary ring-4 ring-background animate-pulse" />
                <h4 className="text-sm font-semibold">MPCB Consent to Establish</h4>
                <Badge variant="secondary" className="mt-2 text-[10px] bg-primary/10 text-primary hover:bg-primary/20">Under Review</Badge>
              </div>
              <div className="relative pl-6 border-l-2 border-muted">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-muted ring-4 ring-background" />
                <h4 className="text-sm font-semibold text-muted-foreground">FSSAI Licence</h4>
                <p className="text-xs text-muted-foreground mt-1">Dependent on Factory Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
