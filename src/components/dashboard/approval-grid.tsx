"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CircleDashed, Lock, Clock, FileText, Bot, Building2, Sparkles, ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";



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
      <DialogContent className="max-w-[95vw] sm:max-w-3xl sm:p-8">
        <DialogHeader className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <StatusBadge status={status} />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded-full">{approval.stage}</span>
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight mb-1">{approval.name}</DialogTitle>
          <DialogDescription className="text-sm font-medium flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            {approval.authority}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          <div className="space-y-6">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-foreground">Why it applies</h4>
                <Badge className="bg-teal-500/10 text-teal-500 hover:bg-teal-500/20 border-teal-500/20 text-[10px] font-medium h-5 px-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Assessment
                </Badge>
              </div>
              <div className="text-sm text-foreground/80 bg-muted/40 p-4 rounded-xl border border-border/50 leading-relaxed shadow-inner">
                {approval.why_it_applies || "Based on your business profile, location, and operations, this approval is flagged as required."}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Required Documents</h4>
              <ul className="space-y-2 bg-background p-4 rounded-xl border border-border/50 shadow-sm">
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="mt-0.5 rounded-full p-1 bg-primary/10">
                    <FileText className="w-3 h-3 text-primary" />
                  </div>
                  <span className="leading-snug">Standard business incorporation & identity documents</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="mt-0.5 rounded-full p-1 bg-primary/10">
                    <FileText className="w-3 h-3 text-primary" />
                  </div>
                  <span className="leading-snug">Site plan & layout schematics</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="space-y-6 h-full flex flex-col">
            <div className="space-y-3 flex-1 h-full flex flex-col">
              <h4 className="text-sm font-semibold text-foreground">Next Action</h4>
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 rounded-xl flex flex-col flex-1 justify-center text-center relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ArrowRightCircle className="w-24 h-24 text-primary translate-x-4 -translate-y-4" />
                </div>
                <h3 className="font-semibold text-primary mb-2 text-lg relative z-10">Prepare Documentation</h3>
                <p className="text-xs text-primary/80 mb-6 relative z-10">Head over to the Document Center to auto-generate or upload requirements.</p>
                <Button className="w-full relative z-10 shadow-lg shadow-primary/20">Go to Document Center</Button>
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

  useEffect(() => {
    const aiData = localStorage.getItem("permitgrid_approvals");
    if (aiData) {
      try {
        const parsed = JSON.parse(aiData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setApprovals(parsed);
        }
      } catch (e) {}
    }
  }, []);

  if (approvals.length === 0) {
    return (
      <div className="p-16 text-center">
        <h2 className="text-xl font-bold mb-2">No Grid Generated</h2>
        <p className="text-muted-foreground mb-4">Complete the business wizard to generate your regulatory roadmap.</p>
        <Button onClick={() => window.location.href = '/wizard?new=true'}>Go to Wizard</Button>
      </div>
    );
  }

  const preEst = approvals.filter(a => a.stage === 'pre-establishment' || a.stage === 'parallel-1');
  const preOp = approvals.filter(a => a.stage === 'pre-operation' || a.stage === 'parallel-2');
  const op = approvals.filter(a => a.stage === 'operations');
  const others = approvals.filter(a => !['pre-establishment', 'parallel-1', 'pre-operation', 'parallel-2', 'operations'].includes(a.stage));

  return (
    <div className="w-full pb-12 pt-8 px-4 max-w-5xl mx-auto">
      <div className="flex flex-col gap-12 relative">
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
