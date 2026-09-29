"use client";

import { motion } from "framer-motion";
import { WizardForm } from "@/components/wizard/wizard-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WizardPage() {
  const router = useRouter();

  useEffect(() => {
    // If the user already has a registered business profile in local storage,
    // and they haven't explicitly requested to add a new one, route them to the dashboard.
    const searchParams = new URLSearchParams(window.location.search);
    const isNew = searchParams.get("new") === "true";
    const hasProfile = localStorage.getItem("permitgrid_profile");
    
    if (hasProfile && !isNew) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background styling */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* Simple Header */}
      <nav className="relative z-10 border-b border-border bg-background/50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 container mx-auto px-6 py-12 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 max-w-2xl"
        >
          <h1 className="text-3xl font-bold tracking-tight mb-3">Tell us about your project</h1>
          <p className="text-muted-foreground">
            We need a few details to determine exactly which approvals, licences, and registrations your business requires.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="w-full"
        >
          <WizardForm />
        </motion.div>
      </main>
    </div>
  );
}
