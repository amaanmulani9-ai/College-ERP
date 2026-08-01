import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium py-1" aria-label="Breadcrumb navigation">
      <Link to="/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5 text-slate-500" />
        <span>Portal</span>
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const formatted = value.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            {isLast ? (
              <span className="font-bold text-white tracking-wide">{formatted}</span>
            ) : (
              <Link to={to} className="hover:text-white transition-colors">
                {formatted}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
