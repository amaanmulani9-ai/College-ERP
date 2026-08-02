import React, { useState } from "react";
import { TrendingUp, TrendingDown, Users, GraduationCap, DollarSign, Activity, Award, BookOpen } from "lucide-react";
import { RoleType } from "./MobileRoleSwitcher";

export interface KPIMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  color: string;
}

const ROLE_KPIS: Record<RoleType, KPIMetric[]> = {
  superadmin: [
    { id: "adm",   title: "Total Admissions", value: "12,450", change: "+14.2%", isPositive: true,  icon: Users,        color: "text-blue-400" },
    { id: "fees",  title: "Fee Collections",  value: "₹2.48 Cr",change: "+8.6%",  isPositive: true,  icon: DollarSign,   color: "text-emerald-400" },
    { id: "fac",   title: "Faculty Onboarded",value: "842",    change: "+2.1%",  isPositive: true,  icon: GraduationCap,color: "text-purple-400" },
    { id: "health",title: "System Uptime",    value: "99.98%", change: "Stable", isPositive: true,  icon: Activity,     color: "text-cyan-400" },
  ],
  principal: [
    { id: "p1", title: "Campus Attendance",value: "94.2%",  change: "+1.8%",  isPositive: true,  icon: Activity,     color: "text-emerald-400" },
    { id: "p2", title: "Faculty Efficiency",value: "96.8%", change: "+3.2%",  isPositive: true,  icon: GraduationCap,color: "text-purple-400" },
    { id: "p3", title: "Pass Percentage",  value: "98.1%",  change: "+0.5%",  isPositive: true,  icon: Award,        color: "text-amber-400" },
    { id: "p4", title: "Research Grants",  value: "₹85 Lac",change: "+22.0%", isPositive: true,  icon: DollarSign,   color: "text-blue-400" },
  ],
  hod: [
    { id: "h1", title: "Department Roll",  value: "420 Students", change: "+5%", isPositive: true,icon: Users,        color: "text-indigo-400" },
    { id: "h2", title: "Course Syllabus",  value: "88% Covered",  change: "On Time",isPositive: true,icon: BookOpen, color: "text-emerald-400" },
    { id: "h3", title: "Lab Utilization",  value: "92.4%",        change: "+4%", isPositive: true,  icon: Activity,     color: "text-cyan-400" },
    { id: "h4", title: "Backlog Rate",     value: "3.2%",         change: "-1.1%",isPositive: true, icon: TrendingDown, color: "text-emerald-400" },
  ],
  teacher: [
    { id: "t1", title: "Classes Assigned", value: "6 Batches", change: "Active", isPositive: true,  icon: BookOpen,     color: "text-purple-400" },
    { id: "t2", title: "Avg Attendance",   value: "91.8%",     change: "+2.4%",  isPositive: true,  icon: Activity,     color: "text-emerald-400" },
    { id: "t3", title: "Evaluations Pending",value: "24 Papers",change: "Due Fri",isPositive: false, icon: Award,        color: "text-amber-400" },
    { id: "t4", title: "Student Pass Rate",value: "95.0%",     change: "+4.1%",  isPositive: true,  icon: Users,        color: "text-blue-400" },
  ],
  student: [
    { id: "s1", title: "Current CGPA",     value: "3.84",      change: "Top 5%", isPositive: true,  icon: Award,        color: "text-amber-400" },
    { id: "s2", title: "Overall Attendance",value: "93.5%",    change: "Eligible",isPositive: true, icon: Activity,     color: "text-emerald-400" },
    { id: "s3", title: "Credits Earned",   value: "112 / 160", change: "Sem 6",  isPositive: true,  icon: BookOpen,     color: "text-indigo-400" },
    { id: "s4", title: "Dues Pending",     value: "₹0.00",     change: "Cleared",isPositive: true,  icon: DollarSign,   color: "text-cyan-400" },
  ],
  parent: [
    { id: "pr1", title: "Student Attendance",value: "93.5%",   change: "Good",   isPositive: true,  icon: Activity,     color: "text-emerald-400" },
    { id: "pr2", title: "Latest CGPA",      value: "3.84",     change: "Rank 4", isPositive: true,  icon: Award,        color: "text-amber-400" },
    { id: "pr3", title: "Fee Status",       value: "Paid",     change: "Receipt #84",isPositive: true,icon: DollarSign, color: "text-cyan-400" },
    { id: "pr4", title: "Behavior Record",  value: "Exemplary",change: "0 Reports",isPositive: true,icon: Users,        color: "text-purple-400" },
  ],
};

interface MobileKPICarouselProps {
  role: RoleType;
}

export const MobileKPICarousel: React.FC<MobileKPICarouselProps> = ({ role }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const kpis = ROLE_KPIS[role] ?? ROLE_KPIS.superadmin;

  return (
    <div className="space-y-2 font-sans text-xs select-none">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">Key Performance Metrics</span>
        <span className="text-[10px] font-mono text-slate-500">{activeSlide + 1} / {kpis.length}</span>
      </div>

      {/* Main Single Featured Carousel Slide for Phone */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl relative overflow-hidden">
        {(() => {
          const kpi = kpis[activeSlide] || kpis[0];
          const Icon = kpi.icon;
          return (
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase">{kpi.title}</p>
                <p className={`text-2xl font-bold font-mono ${kpi.color}`}>{kpi.value}</p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold">
                  {kpi.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3 text-rose-400" />}
                  <span>{kpi.change}</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                <Icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
            </div>
          );
        })()}

        {/* Carousel Dot Control */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {kpis.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-1.5 rounded-full transition-all ${
                activeSlide === idx ? "w-6 bg-indigo-500" : "w-1.5 bg-slate-700"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
