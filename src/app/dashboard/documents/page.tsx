"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileUp, FileText, CheckCircle2, AlertTriangle, Clock, Trash2, Search, Zap } from "lucide-react";

// No mock data - purely dynamic
export default function DocumentCenter() {
  const [documents, setDocuments] = useState<any[]>([]);

  // Load docs on mount
  useEffect(() => {
    const saved = localStorage.getItem("permitgrid_documents");
    if (saved) {
      try { setDocuments(JSON.parse(saved)); } catch(e) {}
    }
  }, []);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showValidation, setShowValidation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = documents.filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const [aiResult, setAiResult] = useState<any>(null);
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(30);
    
    try {
      // Simulate reading/uploading delay
      await new Promise(r => setTimeout(r, 800));
      setUploadProgress(70);

      const profileStr = localStorage.getItem("permitgrid_profile");
      const profile = profileStr ? JSON.parse(profileStr) : { industry: "Manufacturing", state: "Maharashtra" };

      const formData = new FormData();
      formData.append("file", file);
      formData.append("industry", profile.industry || "Manufacturing");
      formData.append("state", profile.state || "Maharashtra");

      const res = await fetch("/api/analyze-document", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      setAiResult(data.data);
      
      // Save it dynamically
      const newDoc = {
        id: Math.random().toString(36).substring(7),
        name: file.name,
        type: data.data.status === "Valid" ? "Verified Upload" : "Pending Fixes",
        status: data.data.status === "Valid" ? "verified" : "needs_review",
        date: new Date().toLocaleDateString(),
        usedBy: 1
      };
      const updated = [newDoc, ...documents];
      setDocuments(updated);
      localStorage.setItem("permitgrid_documents", JSON.stringify(updated));

      setUploadProgress(100);
      setIsUploading(false);
      setShowValidation(true);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  const handleApproveValidation = () => {
    setShowValidation(false);
    if (aiResult) {
      setDocuments([{
        id: Math.random().toString(),
        name: aiResult.document_type_identified || "Uploaded Document",
        type: "User Upload",
        status: aiResult.status === "Ready" ? "verified" : "needs_revision",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        usedBy: 1
      }, ...documents]);
    }
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
            <div>
              <input type="file" id="doc-upload" className="hidden" onChange={handleUpload} />
              <label htmlFor="doc-upload" className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}>
                <FileUp className="w-4 h-4 mr-2" />
                {isUploading ? 'Analyzing...' : 'Upload Document'}
              </label>
            </div>
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
              {aiResult ? (
                <>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{aiResult.document_type_identified || "Document"}</p>
                        <p className="text-xs text-muted-foreground">Status: {aiResult.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${aiResult.status === 'Ready' ? 'text-success' : 'text-destructive'}`}>
                        {aiResult.status === 'Ready' ? '100%' : '50%'}
                      </p>
                      <p className="text-xs text-muted-foreground">Readiness Score</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Validation Results</h4>
                    
                    {aiResult.issues && aiResult.issues.length > 0 ? (
                      aiResult.issues.map((issue: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 text-sm">
                          <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-destructive">Issue Detected</p>
                            <p className="text-muted-foreground text-xs">{issue}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-success">Perfectly Valid</p>
                          <p className="text-muted-foreground text-xs">No issues detected by the AI.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p>Loading AI Results...</p>
              )}
              
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
                {filteredDocs.length === 0 ? <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No documents found. Upload a document to get started.</TableCell></TableRow> : filteredDocs.map((doc) => (
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
