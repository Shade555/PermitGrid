"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileCheck2, Search, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-hidden selection:bg-primary/20">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-secondary/5 blur-[120px]" />
      </div>

      <nav className="relative z-10 border-b border-border/50 bg-background/50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileCheck2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">PermitGrid</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pt-24 pb-32">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={item} className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              AI-Powered Industrial Approvals
            </span>
          </motion.div>

          <motion.h1 
            variants={item}
            className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-8 leading-[1.1]"
          >
            Every approval. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              One intelligent grid.
            </span>
          </motion.h1>

          <motion.p 
            variants={item}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            PermitGrid helps businesses discover applicable industrial approvals, prepare documentation, track applications, manage renewals, and navigate government services from one unified platform.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto shadow-lg shadow-primary/20">
              Build My Approval Grid
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto bg-background/50">
              Explore the Platform
            </Button>
          </motion.div>
        </motion.div>

        {/* Conceptual Grid Visualization */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
          className="mt-24 max-w-5xl mx-auto"
        >
          <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/20 border border-red-400/50" />
                <div className="w-3 h-3 rounded-full bg-amber-400/20 border border-amber-400/50" />
                <div className="w-3 h-3 rounded-full bg-green-400/20 border border-green-400/50" />
              </div>
              <div className="mx-auto flex items-center gap-2 px-3 py-1 bg-background rounded-md border border-border text-xs text-muted-foreground font-mono">
                <Search className="w-3 h-3" /> permitgrid.gov.in/dashboard
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-center gap-8 bg-grid-black/[0.02] relative">
              <div className="absolute inset-0 bg-gradient-to-b from-card/0 to-card pointer-events-none" />
              
              {/* Visualized Workflow */}
              <div className="flex flex-col items-center gap-4 relative z-10">
                <div className="p-4 rounded-xl bg-primary/10 text-primary border border-primary/20 flex flex-col items-center">
                  <LayoutDashboard className="w-6 h-6 mb-2" />
                  <span className="text-sm font-semibold">Business Profile</span>
                </div>
                <div className="h-8 w-px bg-border relative">
                  <div className="absolute inset-0 bg-primary/50 animate-pulse" />
                </div>
                <div className="p-3 px-6 rounded-full bg-secondary/10 text-secondary border border-secondary/20 text-sm font-medium">
                  Approval Intelligence
                </div>
                <div className="h-8 w-px bg-border relative">
                  <div className="absolute inset-0 bg-primary/50 animate-pulse" />
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {['FSSAI Licence', 'Fire NOC', 'Factory Act'].map((name, i) => (
                    <motion.div 
                      key={name}
                      whileHover={{ scale: 1.05 }}
                      className="p-3 bg-background border border-border rounded-lg shadow-sm flex flex-col items-center text-center gap-1 w-28"
                    >
                      <div className="w-2 h-2 rounded-full bg-success mb-1" />
                      <span className="text-xs font-medium">{name}</span>
                    </motion.div>
                  ))}
                  {['GST Reg.', 'EPR Cert.', 'BIS Cert.'].map((name, i) => (
                    <motion.div 
                      key={name}
                      whileHover={{ scale: 1.05 }}
                      className="p-3 bg-background border border-border rounded-lg shadow-sm flex flex-col items-center text-center gap-1 w-28"
                    >
                      <div className="w-2 h-2 rounded-full bg-warning mb-1" />
                      <span className="text-xs font-medium">{name}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="h-8 w-px bg-border relative mt-2" />
                <div className="p-4 rounded-xl bg-background border border-border shadow-md flex flex-col items-center w-full max-w-[300px]">
                  <span className="text-sm font-semibold">Compliance Dashboard</span>
                  <div className="w-full h-2 bg-muted rounded-full mt-3 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '60%' }}
                      transition={{ delay: 1.5, duration: 1 }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
