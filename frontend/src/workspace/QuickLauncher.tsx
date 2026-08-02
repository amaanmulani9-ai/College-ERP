import React from "react";
import {
  X,
  Compass,
  Users,
  BookOpen,
  DollarSign,
  Building,
  Bus,
  Shield,
  Sparkles,
  Award,
  Grid,
} from "lucide-react";
import { useWorkspace, WorkspaceModuleShortcut } from "./WorkspaceContext";
import { useTabs } from "./TabContext";

export const QuickLauncher: React.FC = () => {
  const { isQuickLauncherOpen, setIsQuickLauncherOpen, pinnedModules, favoriteModules } = useWorkspace();
  const { openTab } = useTabs();

  if (!isQuickLauncherOpen) return null;

  const categories = [
    {
      title: "Core Directory & Academics",
      modules: [
        { id: "students", name: "Student Directory", route: "/students", iconName: "Users", category: "Directory" },
        { id: "staff", name: "HR & Staff", route: "/hr", iconName: "Users", category: "HR" },
        { id: "academics", name: "Academic Courses", route: "/academics/departments", iconName: "BookOpen", category: "Academics" },
        { id: "examinations", name: "Examinations", route: "/examinations", iconName: "BookOpen", category: "Academics" },
      ],
    },
    {
      title: "Facilities, Security & AI",
      modules: [
        { id: "visitor", name: "Visitor & Security", route: "/visitor", iconName: "Shield", category: "Security" },
        { id: "ai", name: "AI Academic Assistant", route: "/ai", iconName: "Sparkles", category: "AI & Innovation" },
        { id: "hostel", name: "Hostels & Beds", route: "/hostel", iconName: "Building", category: "Facilities" },
        { id: "transport", name: "Transport Fleet", route: "/transport", iconName: "Bus", category: "Facilities" },
      ],
    },
    {
      title: "Career & Network",
      modules: [
        { id: "placement", name: "Placement & Careers", route: "/placement", iconName: "Award", category: "Careers" },
        { id: "alumni", name: "Alumni Network", route: "/alumni", iconName: "Users", category: "Alumni" },
        { id: "fees", name: "Fees & Payments", route: "/fees", iconName: "DollarSign", category: "Finance" },
      ],
    },
  ];

  const handleLaunch = (mod: WorkspaceModuleShortcut) => {
    openTab({
      title: mod.name,
      route: mod.route,
      iconName: mod.iconName,
    });
    setIsQuickLauncherOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/10 text-indigo-400">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Enterprise Quick Launcher</h3>
              <p className="text-xs text-slate-400">Launch ERP modules and workspace consoles</p>
            </div>
          </div>
          <button
            onClick={() => setIsQuickLauncherOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {cat.title}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {cat.modules.map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => handleLaunch(mod)}
                    className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800/80 hover:border-indigo-500/50 text-left transition-all group flex flex-col gap-2"
                  >
                    <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all w-fit">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {mod.name}
                      </div>
                      <div className="text-[10px] text-slate-500">{mod.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
