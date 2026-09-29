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
import { ArrowLeft, ArrowRight, Building2, MapPin, Scale, Factory, AlertCircle, CalendarClock, Loader2, LayoutDashboard } from "lucide-react";
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
    project_stage: "Planning",
    state: "Maharashtra",
    district: "Pune",
    city: "Haveli",
    pin: "411001"
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

  const updateField = (field: string, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value === null ? "" : value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/business-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const result = await res.json();
        if (result.data && result.data.recommended_approvals) {
          localStorage.setItem("permitgrid_approvals", JSON.stringify(result.data.recommended_approvals));
          localStorage.setItem("permitgrid_profile", JSON.stringify(formData));
        }
        router.push("/dashboard/grid");
      } else {
        console.error("Failed to submit profile", await res.text());
        setIsSubmitting(false);
      }
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col bg-card border border-border shadow-2xl rounded-2xl overflow-hidden relative min-h-[650px]">
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

      {/* Form Content - Removed overflow-y-auto to stop inner scrolling */}
      <div className="flex-1 p-8 relative flex flex-col">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-1 flex flex-col"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              {steps[currentStep].title}
            </h3>
            
            <div className="flex-1 space-y-6">
              
              {/* Step 0: Location */}
              {currentStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Select value={formData.state} onValueChange={(v) => updateField("state", v)}>
                      <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="Gujarat">Gujarat</SelectItem>
                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>District</Label>
                    <Input value={formData.district} onChange={(e) => updateField("district", e.target.value)} placeholder="e.g. Pune" />
                  </div>
                  <div className="space-y-2">
                    <Label>City / Taluka</Label>
                    <Input value={formData.city} onChange={(e) => updateField("city", e.target.value)} placeholder="e.g. Haveli" />
                  </div>
                  <div className="space-y-2">
                    <Label>PIN Code</Label>
                    <Input value={formData.pin} onChange={(e) => updateField("pin", e.target.value)} placeholder="e.g. 411001" />
                  </div>
                </div>
              )}

              {/* Step 1: Business Profile */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Business Name</Label>
                    <Input value={formData.business_name} onChange={(e) => updateField("business_name", e.target.value)} placeholder="e.g. Nova Foods Pvt Ltd" />
                  </div>
                  <div className="space-y-2">
                    <Label>Entity Type</Label>
                    <Select value={formData.entity_type} onValueChange={(v) => updateField("entity_type", v)}>
                      <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Private Limited">Private Limited</SelectItem>
                        <SelectItem value="LLP">LLP</SelectItem>
                        <SelectItem value="Proprietorship">Proprietorship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Select value={formData.industry} onValueChange={(v) => updateField("industry", v)}>
                      <SelectTrigger><SelectValue placeholder="Select Industry" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Food Processing">Food Processing</SelectItem>
                        <SelectItem value="Chemicals">Chemicals</SelectItem>
                        <SelectItem value="Textiles">Textiles</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Scale & Capacity */}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Investment Amount (₹)</Label>
                    <Input 
                      type="number" 
                      value={formData.investment_amount} 
                      onChange={(e) => updateField("investment_amount", e.target.value === "" ? "" : parseFloat(e.target.value))} 
                      placeholder="50000000" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Employee Count</Label>
                    <Input 
                      type="number" 
                      value={formData.employee_count} 
                      onChange={(e) => updateField("employee_count", e.target.value === "" ? "" : parseInt(e.target.value))} 
                      placeholder="80" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2 p-4 bg-muted/50 rounded-lg border border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Automated Classification</p>
                    <p className="text-sm">
                      Based on MSME rules, an investment of ₹{formData.investment_amount.toLocaleString()} classifies this unit as: 
                      <span className="font-bold text-primary ml-1">
                        {formData.investment_amount > 500000000 ? "Medium/Large Enterprise" : formData.investment_amount > 100000000 ? "Small Enterprise" : "Micro Enterprise"}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Operations */}
              {currentStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Core Activity</Label>
                    <Select value={formData.business_activity} onValueChange={(v) => updateField("business_activity", v)}>
                      <SelectTrigger><SelectValue placeholder="Select Activity" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Service">Service</SelectItem>
                        <SelectItem value="Trading">Trading</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Activity Type</Label>
                    <Select value={formData.activity_type} onValueChange={(v) => updateField("activity_type", v)}>
                      <SelectTrigger><SelectValue placeholder="Specific Type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manufacturing">Product Manufacturing</SelectItem>
                        <SelectItem value="assembly">Assembly Line</SelectItem>
                        <SelectItem value="processing">Raw Material Processing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center space-x-2 border p-4 rounded-lg bg-background">
                      <Checkbox id="hazardous" />
                      <div className="grid gap-1.5 leading-none">
                        <label htmlFor="hazardous" className="text-sm font-medium leading-none">Handles Hazardous Materials?</label>
                        <p className="text-sm text-muted-foreground">Check this if your facility processes chemicals, bio-waste, or flammable liquids.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Special Conditions */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">Select any special conditions that apply to your project. This affects NOC requirements.</p>
                  
                  <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Checkbox id="groundwater" className="mt-1" />
                    <div className="grid gap-1">
                      <label htmlFor="groundwater" className="text-sm font-medium">Groundwater Extraction</label>
                      <p className="text-xs text-muted-foreground">Facility requires sinking a new borewell or extracting groundwater.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Checkbox id="boiler" className="mt-1" />
                    <div className="grid gap-1">
                      <label htmlFor="boiler" className="text-sm font-medium">Boiler Operation</label>
                      <p className="text-xs text-muted-foreground">Manufacturing involves the use of industrial boilers.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Checkbox id="effluent" className="mt-1" defaultChecked />
                    <div className="grid gap-1">
                      <label htmlFor="effluent" className="text-sm font-medium">Industrial Effluent Discharge</label>
                      <p className="text-xs text-muted-foreground">Generates liquid waste that requires treatment (ETP).</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Project Stage */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Current Stage of Project</Label>
                    <Select value={formData.project_stage} onValueChange={(v) => updateField("project_stage", v)}>
                      <SelectTrigger><SelectValue placeholder="Select Stage" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planning">Planning / Pre-establishment</SelectItem>
                        <SelectItem value="Construction">Under Construction</SelectItem>
                        <SelectItem value="Pre-operation">Pre-operation / Ready for Inspection</SelectItem>
                        <SelectItem value="Operational">Fully Operational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="p-6 bg-primary/10 border border-primary/20 rounded-xl mt-6">
                    <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                      <LayoutDashboard className="w-5 h-5" /> Ready to Generate Approval Grid
                    </h4>
                    <p className="text-sm text-foreground/80">
                      PermitGrid AI will now analyze your {formData.industry} facility profile in {formData.state} and compile a complete regulatory roadmap.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer / Actions */}
      <div className="p-6 bg-background border-t border-border flex justify-between items-center mt-auto">
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
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-48 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
              </>
            ) : (
              "Generate Grid"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
