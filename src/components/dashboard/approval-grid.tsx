"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CircleDashed, Lock, Clock, FileText, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const fallbackApprovals = [
  { id: "bus-reg", name: "Business Registration", authority: "MCA", status: "approved", stage: "setup" },
  { id: "build-app", name: "Building Approval", authority: "MIDC / Local Body", status: "in-progress", stage: "parallel-1" },
  { id: "fire-noc", name: "Fire NOC (Prov)", authority: "Maharashtra Fire Services", status: "pending", stage: "parallel-1" },
  { id: "mpcb-cte", name: "MPCB Consent to Establish", authority: "MPCB", status: "pending", stage: "parallel-1" },
  { id: "factory-plan", name: "Factory Plan Approval", authority: "DISH", status: "locked", stage: "parallel-2" },
  { id: "fssai", name: "FSSAI State Licence", authority: "FDA Maharashtra", status: "locked", stage: "operations" },
];

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "approved": return <CheckCircle2 className="w-5 h-5 text-success" />;
    case "in-progress": return <CircleDashed className="w-5 h-5 text-primary animate-spin-slow" />;
    case "pending": return <Clock className="w-5 h-5 text-warning" />;
    case "locked": return <Lock className="w-5 h-5 text-muted-foreground" />;
    default: return <Clock className="w-5 h-5 text-warning" />;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "approved": return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Approved</Badge>;
    case "in-progress": return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Under Review</Badge>;
    case "pending": return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">To Do</Badge>;
    case "locked": return <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Locked</Badge>;
    default: return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">To Do</Badge>;
  }
};

const ApprovalCard = ({ approval, index, isAI }: { approval: any, index: number, isAI?: boolean }) => {
  const status = approval.status || "pending";
  return (
    <Dialog>
      <DialogTrigger>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="relative z-10 w-full md:w-auto"
        >
          <Card className={`w-full md:w-[280px] p-4 transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer ${
            status === 'locked' ? 'opacity-70 bg-muted/30' : 'bg-card'
          }`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <StatusIcon status={status} />
                {isAI && <Bot className="w-4 h-4 text-primary opacity-50" />}
              </div>
              <StatusBadge status={status} />
            </div>
            <h3 className="font-semibold text-sm mb-1 line-clamp-2" title={approval.name}>{approval.name}</h3>
            <p className="text-xs text-muted-foreground mb-4 line-clamp-1">{approval.authority}</p>
            
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileText className="w-3.5 h-3.5" />
                <span>Documents</span>
              </div>
              <span className="h-6 text-xs px-2 text-primary hover:bg-primary/10 rounded-md inline-flex items-center justify-center font-medium transition-colors">View Details</span>
            </div>
          </Card>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2 pr-6">
            <StatusBadge status={status} />
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
              <h4 className="text-sm font-semibold mb-2">Why it may apply <Badge variant="secondary" className="ml-2 text-[10px]">AI Assessment</Badge></h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border border-border/50 leading-relaxed">
                {approval.why_it_applies || "Based on your business profile, location, and operations, this approval is flagged as required."}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Required Documents</h4>
              <ul className="space-y-2 bg-background p-3 rounded-md border border-border/50">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CircleDashed className="w-4 h-4" /> Standard business documents
                </li>
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Next Action</h4>
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-md">
                <p className="text-sm font-medium text-primary mb-3">Prepare required documentation</p>
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
  const [approvals, setApprovals] = useState<any[]>([]);
  const [isDynamic, setIsDynamic] = useState(false);

  useEffect(() => {
    const aiData = localStorage.getItem("permitgrid_approvals");
    if (aiData) {
      try {
        const parsed = JSON.parse(aiData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setApprovals(parsed);
          setIsDynamic(true);
        } else {
          setApprovals(fallbackApprovals);
        }
      } catch (e) {
        setApprovals(fallbackApprovals);
      }
    } else {
      setApprovals(fallbackApprovals);
    }
  }, []);

  if (approvals.length === 0) return <div className="p-8 text-center">Loading Grid...</div>;

  // If using AI data, we map them into stages
  const preEst = approvals.filter(a => a.stage === 'pre-establishment' || a.stage === 'parallel-1');
  const preOp = approvals.filter(a => a.stage === 'pre-operation' || a.stage === 'parallel-2');
  const op = approvals.filter(a => a.stage === 'operations');
  const others = approvals.filter(a => !['pre-establishment', 'parallel-1', 'pre-operation', 'parallel-2', 'operations'].includes(a.stage));

  if (isDynamic) {
    return (
      <div className="w-full pb-12 pt-8 px-4 max-w-5xl mx-auto">
        <div className="flex flex-col gap-12 relative">
          {/* Vertical spine line */}
          <div className="absolute left-1/2 top-4 bottom-4 w-px bg-border -translate-x-1/2 -z-10 hidden md:block" />

          {preEst.length > 0 && (
            <div className="flex flex-col items-center">
              <Badge variant="outline" className="mb-6 bg-background">Phase 1: Pre-Establishment</Badge>
              <div className="flex flex-wrap justify-center gap-6">
                {preEst.map((app, i) => <ApprovalCard key={i} approval={app} index={i} isAI={true} />)}
              </div>
            </div>
          )}

          {preOp.length > 0 && (
            <div className="flex flex-col items-center">
              <Badge variant="outline" className="mb-6 bg-background">Phase 2: Pre-Operation</Badge>
              <div className="flex flex-wrap justify-center gap-6">
                {preOp.map((app, i) => <ApprovalCard key={i} approval={app} index={i} isAI={true} />)}
              </div>
            </div>
          )}

          {op.length > 0 && (
            <div className="flex flex-col items-center">
              <Badge variant="outline" className="mb-6 bg-background">Phase 3: Operations</Badge>
              <div className="flex flex-wrap justify-center gap-6">
                {op.map((app, i) => <ApprovalCard key={i} approval={app} index={i} isAI={true} />)}
              </div>
            </div>
          )}

          {others.length > 0 && (
            <div className="flex flex-col items-center">
              <Badge variant="outline" className="mb-6 bg-background">Other Applicable Approvals</Badge>
              <div className="flex flex-wrap justify-center gap-6">
                {others.map((app, i) => <ApprovalCard key={i} approval={app} index={i} isAI={true} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback visual grid if no AI data
  return (
    <div className="w-full overflow-x-auto pb-12 pt-8 px-4 flex justify-center">
      <div className="flex flex-col items-center relative min-w-max">
        {/* Background Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10" style={{ minHeight: '600px' }}>
          <path d="M 500,120 L 500,180" stroke="var(--border)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
          <path d="M 200,180 L 800,180" stroke="var(--border)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
          <path d="M 200,180 L 200,220" stroke="var(--border)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
          <path d="M 500,180 L 500,220" stroke="var(--border)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
          <path d="M 800,180 L 800,220" stroke="var(--border)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
          <path d="M 200,360 L 200,420" stroke="var(--border)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
          <path d="M 500,360 L 500,420" stroke="var(--border)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
          <path d="M 200,420 L 500,420" stroke="var(--border)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
          <path d="M 500,420 L 500,480" stroke="var(--border)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
        </svg>

        <div className="mb-16 flex flex-col items-center w-[1000px]">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Phase 1: Business Setup</div>
          <ApprovalCard approval={approvals[0]} index={0} />
        </div>

        <div className="mb-16 flex flex-col items-center w-[1000px]">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Phase 2: Pre-Establishment</div>
          <div className="flex gap-12 justify-center w-full">
            <ApprovalCard approval={approvals[1]} index={1} />
            <ApprovalCard approval={approvals[2]} index={2} />
            <ApprovalCard approval={approvals[3]} index={3} />
          </div>
        </div>

        <div className="mb-16 flex flex-col items-center w-[1000px]">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Phase 3: Pre-Operation</div>
          <div className="flex gap-12 justify-center w-full">
            <div className="w-[280px]"></div>
            <ApprovalCard approval={approvals[4]} index={4} />
            <div className="w-[280px]"></div>
          </div>
        </div>

        <div className="flex flex-col items-center w-[1000px]">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Phase 4: Operations</div>
          <ApprovalCard approval={approvals[5]} index={5} />
        </div>
      </div>
    </div>
  );
}
