import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/public/Navbar";
import { Footer } from "../components/public/Footer";

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Navbar */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-grow z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
