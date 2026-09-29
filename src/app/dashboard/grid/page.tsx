import { ApprovalGrid } from "@/components/dashboard/approval-grid";

export default function GridPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Approval Grid</h1>
        <p className="text-muted-foreground mt-1">
          Your personalized, interconnected workflow of required industrial approvals.
        </p>
      </div>
      
      <div className="bg-muted/10 rounded-xl border border-border shadow-inner p-4 overflow-hidden relative">
        <ApprovalGrid />
      </div>
    </div>
  );
}
