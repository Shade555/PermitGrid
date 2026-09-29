"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CircleDashed, Lock, Clock, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const approvals = [
  {
    id: "bus-reg",
    name: "Business Registration",
    authority: "MCA",
    status: "approved",
    stage: "setup",
  },
  {
    id: "build-app",
    name: "Building Approval",
    authority: "MIDC / Local Body",
    status: "in-progress",
    stage: "parallel-1",
  },
  {
    id: "fire-noc",
    name: "Fire NOC (Prov)",
    authority: "Maharashtra Fire Services",
    status: "pending",
    stage: "parallel-1",
  },
  {
    id: "mpcb-cte",
    name: "MPCB Consent to Establish",
    authority: "MPCB",
    status: "pending",
    stage: "parallel-1",
  },
  {
    id: "factory-plan",
    name: "Factory Plan Approval",
    authority: "DISH",
    status: "locked",
    stage: "parallel-2",
  },
  {
    id: "fssai",
    name: "FSSAI State Licence",
    authority: "FDA Maharashtra",
    status: "locked",
    stage: "operations",
  },
];

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "approved": return <CheckCircle2 className="w-5 h-5 text-success" />;
    case "in-progress": return <CircleDashed className="w-5 h-5 text-primary animate-spin-slow" />;
    case "pending": return <Clock className="w-5 h-5 text-warning" />;
    case "locked": return <Lock className="w-5 h-5 text-muted-foreground" />;
    default: return null;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "approved": return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Approved</Badge>;
    case "in-progress": return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Under Review</Badge>;
    case "pending": return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">To Do</Badge>;
    case "locked": return <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Locked</Badge>;
    default: return null;
  }
};

const ApprovalCard = ({ approval, index }: { approval: any, index: number }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="relative z-10"
        >
          <Card className={`w-[280px] p-4 transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer ${
            approval.status === 'locked' ? 'opacity-70 bg-muted/30' : 'bg-card'
          }`}>
            <div className="flex justify-between items-start mb-3">
              <StatusIcon status={approval.status} />
              <StatusBadge status={approval.status} />
            </div>
            <h3 className="font-semibold text-sm mb-1">{approval.name}</h3>
            <p className="text-xs text-muted-foreground mb-4">{approval.authority}</p>
            
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileText className="w-3.5 h-3.5" />
                <span>4 Docs required</span>
              </div>
              <Button variant="ghost" size="sm" className="h-6 text-xs px-2 text-primary">View Details</Button>
            </div>
          </Card>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2 pr-6">
            <StatusBadge status={approval.status} />
            <span className="text-xs text-muted-foreground uppercase tracking-widest">{approval.stage}</span>
          </div>
          <DialogTitle className="text-2xl">{approval.name}</DialogTitle>
          <DialogDescription className="text-base text-foreground font-medium">
            Authority: {approval.authority}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Why it may apply</h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                Based on your profile: Food manufacturing in Maharashtra with industrial activity.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Required Documents</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success" /> Project Report
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success" /> Company PAN
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CircleDashed className="w-4 h-4" /> Site Plan
                </li>
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Dependencies</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Business Registration</Badge>
                {approval.id === 'fssai' && <Badge variant="secondary">Factory Plan Approval</Badge>}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Next Action</h4>
              <div className="bg-primary/10 border border-primary/20 p-3 rounded-md">
                <p className="text-sm font-medium text-primary mb-2">Upload remaining documents</p>
                <Button size="sm" className="w-full">Go to Document Center</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export function ApprovalGrid() {
  return (
    <div className="w-full overflow-x-auto pb-12 pt-8 px-4 flex justify-center">
      <div className="flex flex-col items-center relative min-w-max">
        {/* Background Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10" style={{ minHeight: '600px' }}>
          {/* Vertical line from top to split */}
          <path d="M 500,120 L 500,180" stroke="var(--border)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
          
          {/* Horizontal split */}
          <path d="M 200,180 L 800,180" stroke="var(--border)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
          
          {/* Vertical lines to parallel 1 */}
          <path d="M 200,180 L 200,220" stroke="var(--border)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
          <path d="M 500,180 L 500,220" stroke="var(--border)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
          <path d="M 800,180 L 800,220" stroke="var(--border)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
          
          {/* Vertical lines from parallel 1 down */}
          <path d="M 200,360 L 200,420" stroke="var(--border)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
          <path d="M 500,360 L 500,420" stroke="var(--border)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
          
          {/* Horizontal merge */}
          <path d="M 200,420 L 500,420" stroke="var(--border)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
          
          {/* Final path */}
          <path d="M 500,420 L 500,480" stroke="var(--border)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
        </svg>

        {/* Stage: Setup */}
        <div className="mb-16 flex flex-col items-center w-[1000px]">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Phase 1: Business Setup</div>
          <ApprovalCard approval={approvals[0]} index={0} />
        </div>

        {/* Stage: Parallel 1 */}
        <div className="mb-16 flex flex-col items-center w-[1000px]">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Phase 2: Pre-Establishment</div>
          <div className="flex gap-12 justify-center w-full">
            <ApprovalCard approval={approvals[1]} index={1} />
            <ApprovalCard approval={approvals[2]} index={2} />
            <ApprovalCard approval={approvals[3]} index={3} />
          </div>
        </div>

        {/* Stage: Parallel 2 (Dependent) */}
        <div className="mb-16 flex flex-col items-center w-[1000px]">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Phase 3: Pre-Operation</div>
          <div className="flex gap-12 justify-center w-full">
            <div className="w-[280px]"></div> {/* Spacer */}
            <ApprovalCard approval={approvals[4]} index={4} />
            <div className="w-[280px]"></div> {/* Spacer */}
          </div>
        </div>

        {/* Stage: Operations */}
        <div className="flex flex-col items-center w-[1000px]">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Phase 4: Operations</div>
          <ApprovalCard approval={approvals[5]} index={5} />
        </div>
      </div>
    </div>
  );
}
