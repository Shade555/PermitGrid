"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertCircle, FileText, ArrowRight, MessageSquareWarning, UploadCloud } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const mockApplications = [
  {
    id: "app-1",
    name: "MPCB Consent to Establish",
    department: "Maharashtra Pollution Control Board",
    status: "query_raised",
    submittedOn: "Oct 10, 2026",
    estimatedCompletion: "Nov 05, 2026",
    progress: 60,
    timeline: [
      { step: "Application Submitted", date: "Oct 10, 2026", status: "completed" },
      { step: "Initial Scrutiny", date: "Oct 12, 2026", status: "completed" },
      { step: "Department Review", date: "Oct 15, 2026", status: "query_raised", note: "Missing signature on Factory Layout Plan." },
      { step: "Site Inspection", date: "Pending", status: "pending" },
      { step: "Final Approval", date: "Pending", status: "pending" },
    ]
  }
];

const generateDynamicTracker = () => {
  if (typeof window === 'undefined') return mockApplications;
  const saved = localStorage.getItem("permitgrid_approvals");
  if (!saved) return mockApplications;
  
  try {
    const approvals = JSON.parse(saved);
    if (!approvals || approvals.length === 0) return mockApplications;
    
    return approvals.slice(0, 3).map((app: any, idx: number) => {
      const statusMap = ["query_raised", "in_progress", "approved"];
      const status = statusMap[idx % 3];
      const progressMap = { "in_progress": 40, "query_raised": 60, "approved": 100 };
      
      return {
        id: `app-${idx}`,
        name: app.name,
        department: app.authority,
        status: status,
        submittedOn: "Oct 10, 2026",
        estimatedCompletion: "Nov 15, 2026",
        progress: progressMap[status as keyof typeof progressMap] || 50,
        timeline: [
          { step: "Application Submitted", date: "Oct 10, 2026", status: "completed" },
          { step: "Initial Scrutiny", date: "Oct 12, 2026", status: "completed" },
          { step: "Department Verification", date: "Oct 15, 2026", status: status === "approved" ? "completed" : status, note: status === 'query_raised' ? 'Query: Needs clearer document scans.' : undefined },
          { step: "Final Approval", date: "Pending", status: status === "approved" ? "completed" : "pending" },
        ]
      };
    });
  } catch (e) {
    return mockApplications;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "completed":
    case "approved":
      return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Approved</Badge>;
    case "in_progress":
      return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">In Progress</Badge>;
    case "query_raised":
      return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Action Required</Badge>;
    default:
      return <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Pending</Badge>;
  }
};

const TimelineIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "completed": return <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center text-success"><CheckCircle2 className="w-5 h-5" /></div>;
    case "in_progress": return <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary animate-pulse"><Clock className="w-5 h-5" /></div>;
    case "query_raised": return <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center text-destructive"><AlertCircle className="w-5 h-5" /></div>;
    default: return <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground"><Clock className="w-5 h-5 opacity-50" /></div>;
  }
};

export default function ApplicationTracker() {
  const [applications, setApplications] = useState<any[]>(mockApplications);
  const [selectedApp, setSelectedApp] = useState<any>(mockApplications[0]);
  const [resolvingQuery, setResolvingQuery] = useState(false);
  const [queryResolved, setQueryResolved] = useState(false);

  useEffect(() => {
    const dyn = generateDynamicTracker();
    setApplications(dyn);
    if (dyn.length > 0) setSelectedApp(dyn[0]);
  }, []);

  const handleResolveQuery = () => {
    setResolvingQuery(true);
    setTimeout(() => {
      setResolvingQuery(false);
      setQueryResolved(true);
      
      // Update local state to reflect resolution
      const updatedApp = { ...selectedApp };
      updatedApp.status = "in_progress";
      updatedApp.timeline[2].status = "completed"; // Mark query step as completed
      updatedApp.timeline[2].note = "Document submitted successfully. Awaiting officer review.";
      updatedApp.timeline[3].status = "in_progress"; // Next step in progress
      setSelectedApp(updatedApp);
      
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Application Tracker</h1>
        <p className="text-muted-foreground">Monitor real-time status, respond to queries, and track approval timelines.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        
        {/* LEFT COLUMN: Application List */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Active Applications</h2>
          {applications.map((app) => (
            <Card 
              key={app.id} 
              className={`cursor-pointer transition-all hover:border-primary/50 ${selectedApp.id === app.id ? 'border-primary ring-1 ring-primary/50 bg-primary/5' : 'bg-card'}`}
              onClick={() => {
                setSelectedApp(app);
                setQueryResolved(false);
              }}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm line-clamp-1">{app.name}</h3>
                  <StatusBadge status={app.status} />
                </div>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-1">{app.department}</p>
                <div className="w-full bg-muted rounded-full h-1.5 mb-2">
                  <div 
                    className={`h-1.5 rounded-full ${app.status === 'query_raised' ? 'bg-destructive' : app.status === 'approved' ? 'bg-success' : 'bg-primary'}`} 
                    style={{ width: `${app.progress}%` }} 
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>{app.progress}% Complete</span>
                  <span>Est: {app.estimatedCompletion}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* RIGHT COLUMN: Timeline & Details */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col border-border/50">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-1">{selectedApp.name}</CardTitle>
                  <CardDescription>{selectedApp.department}</CardDescription>
                </div>
                <StatusBadge status={selectedApp.status} />
              </div>
              <div className="flex gap-6 mt-4 pt-4 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Submitted</p>
                  <p className="text-sm font-medium">{selectedApp.submittedOn}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Est. Completion</p>
                  <p className="text-sm font-medium">{selectedApp.estimatedCompletion}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Application ID</p>
                  <p className="text-sm font-medium font-mono text-primary">MH-{Math.floor(Math.random() * 90000) + 10000}</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 p-6 overflow-y-auto">
              {/* Government Query Box */}
              <AnimatePresence>
                {selectedApp.status === "query_raised" && !queryResolved && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    className="mb-8 p-4 rounded-xl border border-destructive/30 bg-destructive/5 flex flex-col sm:flex-row gap-4 items-start"
                  >
                    <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
                      <MessageSquareWarning className="w-5 h-5 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-destructive mb-1">Department Query Raised</h4>
                      <p className="text-sm text-foreground/80 mb-4">
                        "The Factory Layout Plan uploaded on Oct 10 is missing the signature of the authorized architect. Please re-upload the signed document to proceed with the scrutiny."
                      </p>
                      
                      <Dialog>
                        <DialogTrigger>
                          <span className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-8 px-3 text-destructive-foreground bg-destructive hover:bg-destructive/90 cursor-pointer">
                            <UploadCloud className="w-4 h-4 mr-2" />
                            Upload Revised Document
                          </span>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Respond to Query</DialogTitle>
                            <DialogDescription>
                              Upload the requested document to resume processing your application.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-6 space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Select File</label>
                              <Input type="file" className="cursor-pointer" />
                            </div>
                            <div className="bg-muted p-3 rounded-md text-xs text-muted-foreground">
                              AI will automatically pre-validate this document against the query context before submission.
                            </div>
                          </div>
                          <Button 
                            className="w-full" 
                            onClick={handleResolveQuery}
                            disabled={resolvingQuery}
                          >
                            {resolvingQuery ? "Validating & Submitting..." : "Submit to Department"}
                          </Button>
                        </DialogContent>
                      </Dialog>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Timeline */}
              <div className="relative pl-4 mt-4">
                <div className="absolute left-8 top-4 bottom-4 w-px bg-border -z-10" />
                
                <div className="space-y-8">
                  {selectedApp.timeline.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <TimelineIcon status={item.status} />
                      <div className="flex-1 pt-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`font-medium ${item.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'}`}>
                            {item.step}
                          </h4>
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                        </div>
                        {item.note && (
                          <p className={`text-sm mt-2 p-3 rounded-lg border ${item.status === 'query_raised' ? 'bg-destructive/10 border-destructive/20 text-destructive' : 'bg-muted/50 border-border text-muted-foreground'}`}>
                            {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
