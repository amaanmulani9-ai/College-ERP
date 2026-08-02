import React, { useState } from "react";
import {
  Smartphone, Monitor, Tablet, Touchpad, Shield, Sliders,
  BarChart3, Settings, Zap, CheckCircle2, ChevronRight, RefreshCw,
} from "lucide-react";
import { useResponsive } from "./ResponsiveContext";
import { useMobile } from "./useMobile";
import { MobileTopTabs } from "./MobileTopTabs";
import { ResponsiveDashboard } from "./ResponsiveDashboard";
import { ResponsiveTable } from "./ResponsiveTable";

const DEMO_STUDENTS = [
  { id: "S101", name: "Aarav Sharma", department: "Computer Science", semester: "Sem 6", gpa: "3.84", status: "Active" },
  { id: "S102", name: "Ananya Verma", department: "Electronics",      semester: "Sem 4", gpa: "3.91", status: "Active" },
  { id: "S103", name: "Rohan Gupta",  department: "Mechanical",       semester: "Sem 8", gpa: "3.65", status: "Graduating" },
  { id: "S104", name: "Priya Patel",  department: "Civil Eng.",       semester: "Sem 2", gpa: "3.72", status: "Active" },
];

export const MobileFoundationCenter: React.FC = () => {
  const { device, breakpoint, isMobileView, forceMobilePreview, toggleMobilePreview } = useResponsive();
  const { activeTab, setActiveTab } = useMobile();
  const [subTab, setSubTab] = useState("overview");

  const SUB_TABS = [
    { id: "overview",  label: "Dashboard View" },
    { id: "table",     label: "Responsive Table" },
    { id: "diagnostics", label: "Device Metrics" },
    { id: "pwa",       label: "PWA Status" },
  ];

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Device Detector Banner */}
      <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 font-bold shrink-0">
            {device.isPhone ? <Smartphone className="w-5 h-5" /> : device.isTablet ? <Tablet className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                {device.deviceType} Mode
              </h2>
              <span className="text-[9px] font-mono font-bold bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800 uppercase">
                {breakpoint} ({device.screenWidth}px)
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Orientation: <span className="font-mono text-slate-200 capitalize">{device.orientation}</span> · Touch: <span className="font-mono text-slate-200">{device.isTouch ? "Yes" : "No"}</span> · Notch: <span className="font-mono text-slate-200">{device.hasNotch ? "Active" : "Standard"}</span>
            </p>
          </div>
        </div>

        {/* Desktop Mobile Preview Toggle */}
        <button
          onClick={toggleMobilePreview}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold border transition-all ${
            forceMobilePreview
              ? "bg-indigo-600 text-white border-indigo-500 shadow-lg"
              : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{forceMobilePreview ? "Exit Preview" : "Mobile Preview"}</span>
        </button>
      </div>

      {/* Top Sub Tabs */}
      <MobileTopTabs
        tabs={SUB_TABS}
        activeTab={subTab}
        onTabChange={(id) => setSubTab(id)}
      />

      {/* Tab Panels */}
      {subTab === "overview" && <ResponsiveDashboard />}

      {subTab === "table" && (
        <ResponsiveTable
          data={DEMO_STUDENTS}
          title="Student Registry (Adaptive Card/Table)"
          columns={[
            { key: "name",       header: "Student Name" },
            { key: "department", header: "Department" },
            { key: "semester",   header: "Semester" },
            { key: "gpa",        header: "CGPA" },
            {
              key: "status",
              header: "Status",
              render: (r) => (
                <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded uppercase">
                  {r.status}
                </span>
              ),
            },
          ]}
        />
      )}

      {subTab === "diagnostics" && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <h3 className="font-bold text-slate-100 text-xs">Device & Safe-Area Diagnostics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[10px]">
            {[
              { label: "Device Category",  value: device.deviceType },
              { label: "Screen Width",     value: `${device.screenWidth}px` },
              { label: "Screen Height",    value: `${device.screenHeight}px` },
              { label: "Pixel Ratio",      value: `${device.pixelRatio}x` },
              { label: "Orientation",      value: device.orientation },
              { label: "Touch Support",    value: device.isTouch ? "Enabled" : "Disabled" },
              { label: "Safe Top Inset",   value: `${device.safeAreaInsetTop}px` },
              { label: "Safe Bottom Inset",value: `${device.safeAreaInsetBottom}px` },
              { label: "Breakpoints",      value: breakpoint.toUpperCase() },
            ].map((diag) => (
              <div key={diag.label} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                <p className="text-[9px] text-slate-500 uppercase">{diag.label}</p>
                <p className="font-bold text-slate-200 mt-0.5">{diag.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === "pwa" && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <h3 className="font-bold text-slate-100 text-xs">PWA & Offline Capability</h3>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            The Mobile Foundation includes Progressive Web App (PWA) triggers, service worker hooks, and offline status listeners.
          </p>

          <div className="space-y-2">
            {[
              { title: "Service Worker Readiness", sub: "Cached assets for offline boot", ok: true },
              { title: "Web App Manifest",         sub: "Standalone viewport & icons",  ok: true },
              { title: "Offline Storage Engine",   sub: "IndexedDB / LocalStorage fallback", ok: true },
              { title: "Push Notifications",       sub: "WebPush API support",          ok: true },
            ].map((pwa) => (
              <div key={pwa.title} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div>
                  <p className="font-bold text-slate-200 text-[11px]">{pwa.title}</p>
                  <p className="text-[9px] text-slate-500">{pwa.sub}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Module Integration Card */}
      <div className="p-4 bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-800/60 rounded-2xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-indigo-300 text-xs">Enterprise Module Integration</span>
          <span className="text-[9px] font-mono text-indigo-400">UI-001 → UI-007</span>
        </div>
        <p className="text-[10px] text-indigo-200/70">
          All desktop hubs (Workspace UI-005, Reporting UI-006, Settings UI-007) render responsively inside MobileShell.
        </p>
      </div>
    </div>
  );
};
