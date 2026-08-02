import React from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  DollarSign,
  Building,
  Bus,
  Shield,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Pin,
  Star,
  Clock,
  Compass,
  Grid,
} from "lucide-react";
import { useWorkspace, WorkspaceModuleShortcut } from "./WorkspaceContext";
import { useTabs } from "./TabContext";

export const WorkspaceSidebar: React.FC = () => {
  const { sidebarMode, setSidebarMode, pinnedModules, favoriteModules, recentModules } = useWorkspace();
  const { openTab } = useTabs();

  const isMini = sidebarMode === "mini" || sidebarMode === "collapsed";

  const allModules: WorkspaceModuleShortcut[] = [
    { id: "dash", name: "Workspace Home", route: "/workspace", iconName: "LayoutDashboard", category: "Main" },
    { id: "students", name: "Student Directory", route: "/students", iconName: "Users", category: "Directory" },
    { id: "academics", name: "Academic Courses", route: "/academics/departments", iconName: "BookOpen", category: "Academics" },
    { id: "fees", name: "Fees & Payments", route: "/fees", iconName: "DollarSign", category: "Finance" },
    { id: "hostel", name: "Hostels & Beds", route: "/hostel", iconName: "Building", category: "Facilities" },
    { id: "transport", name: "Transport Fleet", route: "/transport", iconName: "Bus", category: "Facilities" },
    { id: "visitor", name: "Visitor Security", route: "/visitor", iconName: "Shield", category: "Security" },
    { id: "ai", name: "AI Assistant", route: "/ai", iconName: "Sparkles", category: "AI & Innovation" },
  ];

  const handleModuleClick = (mod: WorkspaceModuleShortcut) => {
    openTab({
      title: mod.name,
      route: mod.route,
      iconName: mod.iconName,
    });
  };

  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 select-none z-20 ${
        isMini ? "w-16" : "w-60"
      }`}
    >
      {/* Sidebar Header Toggle */}
      <div className="h-10 px-3 flex items-center justify-between border-b border-slate-800/80">
        {!isMini && <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Navigation</span>}
        <button
          onClick={() => setSidebarMode(isMini ? "expanded" : "mini")}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all mx-auto"
          title={isMini ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isMini ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {/* Pinned Shortcuts Section */}
        {pinnedModules.length > 0 && (
          <div>
            {!isMini && (
              <div className="px-3 py-1 text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Pin className="w-3 h-3" /> Pinned Shortcuts
              </div>
            )}
            <div className="space-y-1 mt-1">
              {pinnedModules.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => handleModuleClick(mod)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isMini ? "justify-center px-0" : ""
                  } text-slate-300 hover:text-white hover:bg-slate-800/80`}
                  title={mod.name}
                >
                  <div className="text-indigo-400"><Compass className="w-4 h-4" /></div>
                  {!isMini && <span className="truncate">{mod.name}</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* All Modules List */}
        <div>
          {!isMini && (
            <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              System Modules
            </div>
          )}
          <div className="space-y-1 mt-1">
            {allModules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => handleModuleClick(mod)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isMini ? "justify-center px-0" : ""
                } text-slate-400 hover:text-white hover:bg-slate-800/60`}
                title={mod.name}
              >
                <div className="text-slate-400 group-hover:text-white"><Grid className="w-4 h-4" /></div>
                {!isMini && <span className="truncate">{mod.name}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
