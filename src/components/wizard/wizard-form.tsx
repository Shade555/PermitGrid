"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Building2, MapPin, Scale, Factory, AlertCircle, CalendarClock, LayoutDashboard, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const steps = [
  { id: "location", title: "Location", icon: MapPin },
  { id: "business", title: "Business Profile", icon: Building2 },
  { id: "scale", title: "Scale & Capacity", icon: Scale },
  { id: "operations", title: "Operations", icon: Factory },
  { id: "conditions", title: "Special Conditions", icon: AlertCircle },
  { id: "stage", title: "Project Stage", icon: CalendarClock },
];

export function WizardForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    business_name: "Nova Foods Pvt Ltd",
    entity_type: "Private Limited",
    industry: "Food Processing",
    business_activity: "Manufacturing",
    activity_type: "manufacturing",
    investment_amount: 50000000,
    employee_count: 80,
    project_stage: "Planning"
  });
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(curr => curr + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:8000/api/business-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const result = await res.json();
        // Save the AI generated approvals to local storage to be read by the Grid
        if (result.data && result.data.recommended_approvals) {
          localStorage.setItem("permitgrid_approvals", JSON.stringify(result.data.recommended_approvals));
          localStorage.setItem("permitgrid_profile", JSON.stringify(formData));
        }
        router.push("/dashboard/grid");
      } else {
        console.error("Failed to submit profile");
        setIsSubmitting(false);
      }
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto min-h-[600px] flex flex-col bg-card border border-border shadow-2xl rounded-2xl overflow-hidden relative">
      {/* Header */}
      <div className="px-8 py-6 bg-muted/30 border-b border-border flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Business Profile Setup</h2>
          <span className="text-sm text-muted-foreground font-medium">Step {currentStep + 1} of {steps.length}</span>
        </div>
        
        <div className="flex gap-2 w-full justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10 -translate-y-1/2" />
          <motion.div 
            className="absolute top-1/2 left-0 h-0.5 bg-primary -z-10 -translate-y-1/2"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center gap-2 bg-card p-1 rounded-full">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                    isActive ? "border-primary bg-primary text-primary-foreground shadow-[0_0_15px_rgba(37,99,235,0.4)]" :
                    isCompleted ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 p-8 relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 p-8 overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                {steps[currentStep].title}
              </h3>
              
              <div className="flex-1 space-y-6 pb-20">
                {currentStep === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select defaultValue="maharashtra">
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="gujarat">Gujarat</SelectItem>
                          <SelectItem value="karnataka">Karnataka</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <Input id="district" placeholder="e.g. Pune" defaultValue="Pune" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City / Taluka</Label>
                      <Input id="city" placeholder="e.g. Haveli" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pin">PIN Code</Label>
                      <Input id="pin" placeholder="e.g. 411001" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="industrial-area">Industrial Area / MIDC (Optional)</Label>
                      <Input id="industrial-area" placeholder="e.g. Hinjewadi Phase 1" />
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="business-name">Business Name</Label>
                      <Input id="business-name" value={formData.business_name} onChange={(e) => setFormData({...formData, business_name: e.target.value})} placeholder="e.g. Nova Foods Pvt Ltd" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="entity-type">Entity Type</Label>
                      <Select defaultValue="Private Limited">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Private Limited">Private Limited</SelectItem>
                          <SelectItem value="LLP">LLP</SelectItem>
                          <SelectItem value="Proprietorship">Proprietorship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="activity">Business Activity</Label>
                      <Select defaultValue="Manufacturing">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Activity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="Service">Service</SelectItem>
                          <SelectItem value="Trading">Trading</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select defaultValue="Food Processing">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Food Processing">Food Processing</SelectItem>
                          <SelectItem value="Chemicals">Chemicals</SelectItem>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {currentStep > 1 && (
                  <div className="flex items-center justify-center h-full min-h-[200px]">
                    <p className="text-muted-foreground text-center">
                      Additional fields for {steps[currentStep].title} will go here.
                      <br/>
                      (Placeholder for demo)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer / Actions */}
      <div className="p-6 bg-background border-t border-border flex justify-between items-center sticky bottom-0">
        <Button 
          variant="outline" 
          onClick={handlePrev} 
          disabled={currentStep === 0 || isSubmitting}
          className="w-32"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext} className="w-32">
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-auto bg-success hover:bg-success/90 text-white shadow-lg shadow-success/20">
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
            ) : (
              <>Generate Approval Grid <LayoutDashboard className="w-4 h-4 ml-2" /></>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
