import React, { useState } from "react";
import { SearchBar } from "./SearchBar";
import { SearchFilters } from "./SearchFilters";
import { SearchResults } from "./SearchResults";
import { SearchPreview } from "./SearchPreview";
import { CommandItemData } from "./CommandItem";
import { useWorkspace } from "../WorkspaceContext";
import { useTabs } from "../TabContext";

const categories = [
  "All Results",
  "Modules",
  "Students",
  "Staff & HR",
  "Finance & Fees",
  "Facilities",
  "AI Assistant",
  "Security",
];

const mockDatabaseItems: CommandItemData[] = [
  { id: "mod-1", title: "Student Directory", description: "Search 2.4k active enrolled students across departments", category: "Modules", route: "/students" },
  { id: "mod-2", title: "Examinations & Grade Registry", description: "Mid-term exam schedules, grade entry, and transcripts", category: "Modules", route: "/examinations" },
  { id: "mod-3", title: "Visitor Security Gate Passes", description: "Digital QR gate pass generation, check-in/out timestamps", category: "Security", route: "/visitor" },
  { id: "mod-4", title: "AI Academic Assistant Hub", description: "Interactive AI chat assistant, prompt library, and RAG search", category: "AI Assistant", route: "/ai" },
  { id: "mod-5", title: "Fees & Payment Gateway", description: "Student fee receipts, pending dues, and payment collection", category: "Finance & Fees", route: "/fees" },
  { id: "mod-6", title: "Hostel Allotment & Beds", description: "Hostel rooms, bed availability, and resident warden directory", category: "Facilities", route: "/hostel" },
  { id: "mod-7", title: "Transport Fleet & Routes", description: "Bus vehicle routes, driver rosters, and transport passes", category: "Facilities", route: "/transport" },
  { id: "mod-8", title: "Placement & Corporate Drives", description: "Company drives, eligibility matching, and student offers", category: "Modules", route: "/placement" },
  { id: "mod-9", title: "Alumni Directory & Network", description: "Alumni profiles, mentorship programs, and fundraising", category: "Modules", route: "/alumni" },
  { id: "mod-10", title: "HR & Employee Personnel", description: "Staff roster, designations, joining dates, and payroll", category: "Staff & HR", route: "/hr" },
];

export const GlobalSearchOverlay: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useWorkspace();
  const { openTab } = useTabs();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Results");
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!isSearchOpen) return null;

  const filteredItems = mockDatabaseItems.filter((item) => {
    const matchesCategory =
      activeCategory === "All Results" || item.category === activeCategory;
    const matchesQuery =
      !query ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(query.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const selectedItem = filteredItems[selectedIndex] || filteredItems[0] || null;

  const handleSelect = (item: CommandItemData) => {
    openTab({
      title: item.title,
      route: item.route,
    });
    setIsSearchOpen(false);
  };

  const handleOpenNewTab = (item: CommandItemData) => {
    openTab({
      title: item.title,
      route: item.route,
    });
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[75vh]">
        {/* Top Search Input Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90">
          <SearchBar
            value={query}
            onChange={(val) => {
              setQuery(val);
              setSelectedIndex(0);
            }}
            onClear={() => setQuery("")}
          />
          <SearchFilters
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              setSelectedIndex(0);
            }}
          />
        </div>

        {/* Main Body: Multi-Pane Split */}
        <div className="flex-1 flex overflow-hidden">
          {/* Results List Pane */}
          <div className="flex-1 p-4 overflow-y-auto">
            <SearchResults
              items={filteredItems}
              selectedIndex={selectedIndex}
              onSelect={handleSelect}
              onOpenNewTab={handleOpenNewTab}
            />
          </div>

          {/* Side Details Preview Pane */}
          <div className="w-80 hidden md:block">
            <SearchPreview
              item={selectedItem}
              onOpen={handleSelect}
              onOpenNewTab={handleOpenNewTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
