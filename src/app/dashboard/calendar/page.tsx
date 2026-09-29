"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, AlertTriangle, ArrowRight } from "lucide-react";

export default function ComplianceCalendar() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("permitgrid_approvals");
    if (saved) {
      try {
        const approvals = JSON.parse(saved);
        const dynamicEvents = approvals.map((app: any, idx: number) => {
          const days = (idx + 1) * 15;
          const date = new Date();
          date.setDate(date.getDate() + days);
          
          return {
            id: idx,
            name: `${app.name} Renewal`,
            desc: `Mandatory filing/renewal for ${app.authority}`,
            dateObj: date,
            month: date.toLocaleString('default', { month: 'short' }),
            day: date.getDate(),
            daysAway: days,
            urgent: days <= 20
          };
        }).sort((a: any, b: any) => a.daysAway - b.daysAway);
        
        setEvents(dynamicEvents.length > 0 ? dynamicEvents : []);
      } catch(e) {}
    }
  }, []);

  const urgentEvent = events.find(e => e.urgent);
  const regularEvents = events.filter(e => !e.urgent);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-full">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Compliance & Renewals</h1>
          <p className="text-muted-foreground">Never miss a deadline. Track upcoming renewals, returns, and compliance audits.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
          <CalendarIcon className="w-4 h-4 mr-2" /> Sync to Google Calendar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Urgent Renewals */}
        <div className="md:col-span-2 space-y-6">
          {urgentEvent && (
            <Card className="border-destructive/30 bg-destructive/5 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  <CardTitle className="text-lg">Urgent Attention Required</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-destructive/20">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-destructive/10 flex flex-col items-center justify-center text-destructive border border-destructive/20 shrink-0">
                      <span className="text-xs font-semibold uppercase">{urgentEvent.month}</span>
                      <span className="text-lg font-bold leading-none">{urgentEvent.day}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-base mb-1">{urgentEvent.name}</h4>
                      <p className="text-sm text-muted-foreground">Expires in {urgentEvent.daysAway} days.</p>
                    </div>
                  </div>
                  <Button variant="destructive" size="sm">Initiate Renewal</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {events.length === 0 ? (
                <p className="text-muted-foreground">No upcoming renewals found. Generate approvals in your dashboard first.</p>
              ) : regularEvents.map((evt) => (
                <div key={evt.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center text-primary border border-primary/20 shrink-0">
                    <span className="text-xs font-semibold uppercase">{evt.month}</span>
                    <span className="text-lg font-bold leading-none">{evt.day}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base mb-1">{evt.name}</h4>
                    <p className="text-sm text-muted-foreground">{evt.desc}</p>
                  </div>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{evt.daysAway} Days Away</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compliance Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted" />
                  <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="376" strokeDashoffset="75" className="text-success" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-foreground">80%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Your unit is mostly compliant, but 1 critical renewal is pending.</p>
              <Button variant="outline" className="w-full">Download Audit Report</Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Automated Tracking</h3>
              <p className="text-sm text-muted-foreground mb-4">PermitGrid AI automatically reads your approved licenses and schedules renewal alerts so you never pay a late fee.</p>
              <Button variant="link" className="p-0 h-auto text-primary flex items-center">
                Configure Alert Settings <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
