"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, FileCheck2, Search, LayoutDashboard, Building2, Workflow, ShieldCheck, X, Database, Cpu, Lock, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { GradientBackground } from "@/components/ui/paper-design-shader-background";
import { ShinyButton } from "@/components/ui/shiny-button";
import { useRouter } from "next/navigation";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Home() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"none" | "signIn" | "signUp">("none");
  const [activeCard, setActiveCard] = useState<"signIn" | "signUp">("signIn");
  const [isGlitching, setIsGlitching] = useState(false);

  // Handle the custom glitch transition
  const handleSwitchMode = (mode: "signIn" | "signUp") => {
    if (isGlitching || mode === activeCard) return;
    setIsGlitching(true);
    
    // Halfway through the glitch, swap the card
    setTimeout(() => {
      setActiveCard(mode);
    }, 150); 
    
    // End glitch state
    setTimeout(() => {
      setIsGlitching(false);
    }, 400);
  };

  const handleOpenAuth = (mode: "signIn" | "signUp") => {
    setActiveCard(mode);
    setAuthMode(mode);
  };

  return (
    <div className="min-h-screen bg-transparent overflow-hidden selection:bg-primary/20 relative">
      <GradientBackground />

      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border/10 bg-background/5 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileCheck2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">PermitGrid</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex hover:bg-white/5" onClick={() => handleOpenAuth("signIn")}>
              Sign In
            </Button>
            <ShinyButton 
              label="Get Started" 
              onClick={() => handleOpenAuth("signUp")}
              className="scale-90 md:scale-100"
            />
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-32">
        {/* HERO SECTION */}
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto text-center mb-20 md:mb-32">
          <motion.div variants={item} className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs md:text-sm font-semibold tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Industrial Compliance, Orchestrated
            </span>
          </motion.div>

          <motion.h1 variants={item} className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 md:mb-8 leading-[1.1]">
            Every approval. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">
              One intelligent grid.
            </span>
          </motion.h1>

          <motion.p variants={item} className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4 md:px-0">
            PermitGrid is an AI-powered operating layer that helps enterprises discover applicable industrial approvals, prepare documentation, track parallel workflows, and navigate government services from one unified platform.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ShinyButton 
              label="Build My Approval Grid →" 
              onClick={() => router.push("/wizard")}
              className="w-full sm:w-auto"
            />
          </motion.div>
        </motion.div>

        {/* WHAT IT DOES SECTION */}
        <div className="mb-24 md:mb-32">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">How PermitGrid Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto px-4">Stop guessing which NOCs you need. Our intelligent workflow orchestration guides you from business idea to operational compliance.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line (hidden on mobile) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-border/50 -translate-y-1/2 -z-10" />
            
            <div className="bg-background/40 backdrop-blur-md p-6 rounded-2xl border border-border/50 text-center relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-4 text-primary font-bold z-10 relative">1</div>
              <h3 className="font-semibold mb-2">Business Profile</h3>
              <p className="text-sm text-muted-foreground">Answer dynamic, progressive questions about your industry, scale, and materials.</p>
            </div>
            
            <div className="bg-background/40 backdrop-blur-md p-6 rounded-2xl border border-border/50 text-center relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-4 text-primary font-bold z-10 relative">2</div>
              <h3 className="font-semibold mb-2">AI Discovery</h3>
              <p className="text-sm text-muted-foreground">Our Regulatory Engine identifies exactly which central and state approvals apply to you.</p>
            </div>

            <div className="bg-background/40 backdrop-blur-md p-6 rounded-2xl border border-border/50 text-center relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-4 text-primary font-bold z-10 relative">3</div>
              <h3 className="font-semibold mb-2">Parallel Workflows</h3>
              <p className="text-sm text-muted-foreground">The Approval Grid shows you which departments you can apply to simultaneously.</p>
            </div>

            <div className="bg-background/40 backdrop-blur-md p-6 rounded-2xl border border-border/50 text-center relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-4 text-primary font-bold z-10 relative">4</div>
              <h3 className="font-semibold mb-2">Document Vault</h3>
              <p className="text-sm text-muted-foreground">Upload once, reuse across approvals. Pre-validate documents using AI before submission.</p>
            </div>
          </div>
        </div>

        {/* ARCHITECTURE & TECH SECTION */}
        <div className="mb-10">
          <div className="bg-card/30 border border-border/20 rounded-3xl p-6 sm:p-8 md:p-12 backdrop-blur-sm">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Enterprise-Grade Architecture</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              
              <div className="space-y-4">
                <Cpu className="w-8 h-8 text-teal-400" />
                <h4 className="text-lg font-semibold">AI Regulatory Engine</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Powered by LLaMA 3 and pgvector. A hybrid system combining structured rules and RAG to retrieve authoritative regulatory context without hallucinations.
                </p>
              </div>

              <div className="space-y-4">
                <Layers className="w-8 h-8 text-blue-400" />
                <h4 className="text-lg font-semibold">Modern Tech Stack</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Built on a robust Next.js 15 frontend with a high-performance Python FastAPI backend, ensuring scale, speed, and reliability.
                </p>
              </div>

              <div className="space-y-4">
                <Database className="w-8 h-8 text-purple-400" />
                <h4 className="text-lg font-semibold">Supabase Ecosystem</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Leveraging PostgreSQL for strict relational schemas, pgvector for semantic search, and secure Supabase Storage for the Document Vault.
                </p>
              </div>

              <div className="space-y-4">
                <Lock className="w-8 h-8 text-amber-400" />
                <h4 className="text-lg font-semibold">Security & Privacy</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Row Level Security (RLS) guarantees that sensitive business profiles, project blueprints, and application statuses remain strictly confidential.
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Auth Modal Overlay */}
      <AnimatePresence>
        {authMode !== "none" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[20px] bg-background/40"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 hover:text-white rounded-full bg-white/5 hover:bg-white/10 z-50"
              onClick={() => setAuthMode("none")}
            >
              <X className="w-6 h-6" />
            </Button>

            <div className="relative w-full max-w-md min-h-[500px] h-auto rounded-2xl shadow-2xl overflow-hidden bg-card/80 backdrop-blur-2xl border border-border/50">
              
              {/* GLITCH TRANSITION ELEMENTS */}
              <AnimatePresence>
                {isGlitching && (
                  <>
                    <motion.div
                      animate={{ 
                        clipPath: [
                          "inset(20% 0 80% 0)", 
                          "inset(50% 0 30% 0)", 
                          "inset(10% 0 60% 0)", 
                          "inset(80% 0 10% 0)", 
                          "inset(0% 0 0% 0)"
                        ],
                        x: [-10, 10, -5, 5, 0],
                        opacity: [0.8, 1, 0.5, 1, 0]
                      }}
                      transition={{ duration: 0.35, ease: "linear" }}
                      className="absolute inset-0 bg-primary z-40 mix-blend-screen pointer-events-none"
                    />
                    <motion.div
                      animate={{ 
                        clipPath: [
                          "inset(80% 0 10% 0)", 
                          "inset(10% 0 40% 0)", 
                          "inset(60% 0 20% 0)", 
                          "inset(30% 0 50% 0)", 
                          "inset(0% 0 0% 0)"
                        ],
                        x: [10, -10, 5, -5, 0],
                        opacity: [0.8, 1, 0.5, 1, 0]
                      }}
                      transition={{ duration: 0.35, ease: "linear" }}
                      className="absolute inset-0 bg-cyan-400 z-40 mix-blend-overlay pointer-events-none"
                    />
                  </>
                )}
              </AnimatePresence>

              {/* CARD CONTENT */}
              <div className="relative p-6 md:p-8 z-10 flex flex-col justify-center h-full">
                <div className="mb-6 md:mb-8 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary mx-auto flex items-center justify-center mb-4">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {activeCard === "signIn" ? "Welcome back" : "Create an account"}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    {activeCard === "signIn" ? "Sign in to your PermitGrid account" : "Start your compliance journey today"}
                  </p>
                </div>
                
                <div className="space-y-4">
                  {activeCard === "signUp" && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" type="text" placeholder="John Doe" className="bg-background/50 border-border/50 h-11" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email</Label>
                    <Input id="email" type="email" placeholder="name@company.com" className="bg-background/50 border-border/50 h-11" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      {activeCard === "signIn" && <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>}
                    </div>
                    <Input id="password" type="password" className="bg-background/50 border-border/50 h-11" />
                  </div>
                  <Button 
                    className="w-full mt-4 md:mt-6 h-11"
                    onClick={() => {
                      // Grab name if on signUp form
                      if (activeCard === "signUp") {
                        const nameInput = document.getElementById("name") as HTMLInputElement;
                        if (nameInput && nameInput.value) {
                          localStorage.setItem("permitgrid_user_name", nameInput.value);
                        }
                      }
                      setAuthMode("none");
                      router.push("/wizard");
                    }}
                  >
                    {activeCard === "signIn" ? "Sign In" : "Create Account"}
                  </Button>
                </div>

                <div className="mt-6 md:mt-8 text-center text-sm">
                  <span className="text-muted-foreground">
                    {activeCard === "signIn" ? "Don't have an account? " : "Already have an account? "}
                  </span>
                  <button 
                    onClick={() => handleSwitchMode(activeCard === "signIn" ? "signUp" : "signIn")} 
                    className="text-primary font-medium hover:underline focus:outline-none"
                    disabled={isGlitching}
                  >
                    {activeCard === "signIn" ? "Get Started" : "Sign In"}
                  </button>
                </div>
              </div>
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
