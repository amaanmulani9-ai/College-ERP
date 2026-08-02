import React from "react";
import { Star } from "lucide-react";
import { useReporting } from "../ReportingContext";
import { ReportCard } from "./ReportCard";

export const FavoriteReports: React.FC = () => {
  const { favoriteReports } = useReporting();

  if (!favoriteReports || favoriteReports.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-xl">
        <Star className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-60" />
        <h4 className="text-sm font-semibold text-slate-300">No Favorite Reports Starred</h4>
        <p className="text-xs text-slate-500 mt-1">
          Click the star icon on any report card to mark it as a favorite for instant one-click access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3" role="region" aria-label="Favorite Reports">
      <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-3">
        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        <span>Starred Favorite Reports ({favoriteReports.length})</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {favoriteReports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
};
