import React, { useState, useEffect } from "react";
import { CommandInput } from "./CommandInput";
import { CommandGroup } from "./CommandGroup";
import { CommandItem, CommandItemData } from "./CommandItem";
import { CommandFooter } from "./CommandFooter";
import { RecentCommands } from "./RecentCommands";
import { FavoriteCommands } from "./FavoriteCommands";
import { useWorkspace } from "../WorkspaceContext";
import { useTabs } from "../TabContext";

const masterCommandItems: CommandItemData[] = [
  { id: "c1", title: "Create Student Registration", description: "Open new student enrollment workflow", category: "Quick Actions", route: "/students" },
  { id: "c2", title: "Add HR Staff Employee", description: "Register new staff member profile", category: "Quick Actions", route: "/hr" },
  { id: "c3", title: "Record Student Fee Payment", description: "Collect tuition/hostel fee payment", category: "Quick Actions", route: "/fees" },
  { id: "c4", title: "Register Gate Visitor", description: "Issue visitor gate pass", category: "Quick Actions", route: "/visitor" },
  { id: "c5", title: "Ask AI Academic Assistant", description: "Open AI chat assistant query", category: "Quick Actions", route: "/ai" },

  { id: "m1", title: "Student Directory", description: "Search & view student profiles", category: "Modules", route: "/students" },
  { id: "m2", title: "Examinations & Grades", description: "Mid-term & semester result registry", category: "Modules", route: "/examinations" },
  { id: "m3", title: "Visitor Security Management", description: "QR gate passes & entry/exit logs", category: "Modules", route: "/visitor" },
  { id: "m4", title: "AI Academic Assistant Hub", description: "Provider-agnostic LLM assistant & RAG", category: "Modules", route: "/ai" },
  { id: "m5", title: "Fees & Payment Gateway", description: "Tuition fees, dues & receipts", category: "Modules", route: "/fees" },
  { id: "m6", title: "Hostel Room Allotments", description: "Hostel blocks, beds & resident wardens", category: "Modules", route: "/hostel" },
  { id: "m7", title: "Transport Fleet & Routes", description: "Vehicles, drivers & bus passes", category: "Modules", route: "/transport" },
  { id: "m8", title: "Placement & Corporate Drives", description: "Campus drives, eligibility & offers", category: "Modules", route: "/placement" },
  { id: "m9", title: "Alumni Directory & Network", description: "Alumni profiles & mentorship", category: "Modules", route: "/alumni" },
  { id: "m10", title: "HR & Employee Roster", description: "Staff profiles, designations & payroll", category: "Modules", route: "/hr" },
];

export const CommandPalette: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, toggleFavoriteModule, favoriteModules } = useWorkspace();
  const { openTab } = useTabs();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!isSearchOpen) return null;

  const filteredCommands = query
    ? masterCommandItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(query.toLowerCase())) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : masterCommandItems;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filteredCommands[selectedIndex];
      if (item) {
        openTab({
          title: item.title,
          route: item.route,
        });
        setIsSearchOpen(false);
      }
    }
  };

  const handleSelect = (item: CommandItemData) => {
    openTab({
      title: item.title,
      route: item.route,
    });
    setIsSearchOpen(false);
  };

  const quickActions = filteredCommands.filter((i) => i.category === "Quick Actions");
  const moduleCommands = filteredCommands.filter((i) => i.category === "Modules");

  return (
    <div
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-start justify-center pt-20 p-4"
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <CommandInput query={query} onQueryChange={setQuery} onClose={() => setIsSearchOpen(false)} />

        <div className="flex-1 overflow-y-auto p-2">
          {!query && (
            <>
              <FavoriteCommands
                items={masterCommandItems.slice(0, 3)}
                onSelect={handleSelect}
              />
              <RecentCommands
                items={masterCommandItems.slice(3, 6)}
                onSelect={handleSelect}
              />
            </>
          )}

          {quickActions.length > 0 && (
            <CommandGroup heading="Quick Actions">
              {quickActions.map((item, idx) => (
                <CommandItem
                  key={item.id}
                  item={item}
                  isSelected={filteredCommands.indexOf(item) === selectedIndex}
                  onSelect={handleSelect}
                  onOpenNewTab={handleSelect}
                />
              ))}
            </CommandGroup>
          )}

          {moduleCommands.length > 0 && (
            <CommandGroup heading="ERP System Modules">
              {moduleCommands.map((item) => (
                <CommandItem
                  key={item.id}
                  item={item}
                  isSelected={filteredCommands.indexOf(item) === selectedIndex}
                  onSelect={handleSelect}
                  onOpenNewTab={handleSelect}
                />
              ))}
            </CommandGroup>
          )}
        </div>

        <CommandFooter />
      </div>
    </div>
  );
};
