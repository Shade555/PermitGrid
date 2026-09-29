"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileUp, FileText, CheckCircle2, AlertTriangle, Clock, Trash2, Search, Zap } from "lucide-react";

// Mock data for the MVP
const initialDocuments = [
  { id: "1", name: "Company_PAN_Card.pdf", type: "Identity Proof", status: "verified", date: "Oct 12, 2026", usedBy: 4 },
  { id: "2", name: "Pune_Factory_Site_Plan_v2.pdf", type: "Site Plan", status: "needs_review", date: "Oct 14, 2026", usedBy: 2 },
  { id: "3", name: "Board_Resolution_Signatory.pdf", type: "Authorization", status: "verified", date: "Oct 10, 2026", usedBy: 3 },
  { id: "4", name: "Pollution_Control_Equip.pdf", type: "Technical Report", status: "pending", date: "Oct 15, 2026", usedBy: 1 },
];

export default function DocumentCenter() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showValidation, setShowValidation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = documents.filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSimulatedUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShowValidation(true);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  const handleApproveValidation = () => {
    setShowValidation(false);
    setDocuments([{
      id: Math.random().toString(),
      name: "Food_Category_Matrix.pdf",
      type: "FSSAI Document",
      status: "verified",
      date: "Oct 15, 2026",
      usedBy: 1
    }, ...documents]);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Document Center</h1>
          <p className="text-muted-foreground">Upload once, reuse across all your industrial approvals.</p>
        </div>
        
        <Dialog open={showValidation} onOpenChange={setShowValidation}>
          <DialogTrigger>
            <span onClick={handleSimulatedUpload} className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}>
              <FileUp className="w-4 h-4 mr-2" />
              Upload Document
            </span>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                AI Pre-validation Readiness Check
              </DialogTitle>
              <DialogDescription>
                PermitGrid AI has analyzed your uploaded document against regulatory requirements.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Food_Category_Matrix.pdf</p>
                    <p className="text-xs text-muted-foreground">Detected Type: FSSAI Technical Doc</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-success">92%</p>
                  <p className="text-xs text-muted-foreground">Readiness Score</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Validation Results</h4>
                
                <div className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Company Name matches profile</p>
                    <p className="text-muted-foreground text-xs">Found "Nova Foods Pvt Ltd"</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">All mandatory fields present</p>
                    <p className="text-muted-foreground text-xs">Categories, additives, and quantities detected.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 text-sm">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Missing signature</p>
                    <p className="text-muted-foreground text-xs">The authorized signatory section appears blank. This might cause a query during review.</p>
                  </div>
                </div>
              </div>
              
              <Button className="w-full" onClick={handleApproveValidation}>
                Accept & Save to Vault
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isUploading && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Uploading & Analyzing...</span>
              <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Vault Storage</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documents..."
                className="pl-9 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Type / Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Used In</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredDocs.map((doc) => (
                  <motion.tr 
                    key={doc.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="group border-b transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        {doc.name}
                      </div>
                    </TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>
                      {doc.status === 'verified' && <Badge variant="outline" className="bg-success/10 text-success border-success/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>}
                      {doc.status === 'needs_review' && <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20"><AlertTriangle className="w-3 h-3 mr-1" /> Needs Review</Badge>}
                      {doc.status === 'pending' && <Badge variant="outline" className="bg-muted text-muted-foreground border-border"><Clock className="w-3 h-3 mr-1" /> Processing</Badge>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">{doc.usedBy} Approvals</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
