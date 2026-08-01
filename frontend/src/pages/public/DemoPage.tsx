import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Play, CheckCircle2, ArrowRight, ShieldCheck, GraduationCap } from "lucide-react";

export const DemoPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState("admin");
  const [demoRequested, setDemoRequested] = useState(false);

  const rolePreviews = [
    { id: "admin", name: "System Administrator", desc: "Manage multi-tenant settings, RBAC role permissions, campus configuration & tenant schema backups." },
    { id: "academic", name: "Dean & HOD", desc: "Manage programs, semesters, faculty allocations, timetable schedule conflict checking & result approval." },
    { id: "faculty", name: "Faculty Member", desc: "Take daily & subject attendance, record student marks, upload course syllabus & view timetable grid." },
    { id: "accountant", name: "Finance & Accountant", desc: "Configure fee structures, log offline payments, monitor Razorpay/Stripe transactions & process refunds." },
    { id: "student", name: "Student & Parent", desc: "View attendance report, check exam hall ticket, pay outstanding fees online & download bonafide certificates." },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Interactive Product Demo
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
          Experience CampusPro ERP{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            In Action
          </span>
        </h1>
        <p className="text-slate-300 text-base">
          Launch our live interactive sandbox portal or schedule a 1-on-1 walkthrough with an enterprise solution architect.
        </p>
      </div>

      {/* Role Preview Selector */}
      <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-8">
        <h2 className="text-xl font-bold text-white text-center">Select Role Perspective</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {rolePreviews.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`p-3.5 rounded-xl text-xs font-semibold border transition-all ${
                selectedRole === role.id
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/25"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              {role.name}
            </button>
          ))}
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">
              {rolePreviews.find((r) => r.id === selectedRole)?.name} Perspective
            </h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              {rolePreviews.find((r) => r.id === selectedRole)?.desc}
            </p>
          </div>

          <Link
            to="/dashboard"
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg flex-shrink-0 flex items-center gap-2"
          >
            Launch Interactive Sandbox <Play className="w-3.5 h-3.5 fill-current" />
          </Link>
        </div>
      </div>
    </div>
  );
};
