import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen, Calendar, User, Tag, ArrowRight, Mail } from "lucide-react";

export const BlogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    document.title = "Blog & Insights | College ERP SaaS";
  }, []);

  const articles = [
    {
      id: 1,
      title: "Why Schema-Isolated Multi-Tenancy Matters for Higher Education Data Privacy",
      category: "Architecture",
      author: "Amaan Mulani",
      date: "Aug 1, 2026",
      readTime: "6 min read",
      excerpt: "Exploring why traditional shared-table tenant IDs fail regulatory compliance and how django-tenants provides 100% data boundary security.",
      featured: true,
    },
    {
      id: 2,
      title: "Automating Attendance Deficit Alerts (<75%) Using Biometric Listeners",
      category: "Operations",
      author: "Engineering Team",
      date: "Jul 28, 2026",
      readTime: "4 min read",
      excerpt: "How real-time push notifications and automated percentage calculations prevent last-minute examination hall ticket disqualifications.",
    },
    {
      id: 3,
      title: "Integrating Razorpay and Stripe Webhooks for Instant Fee Receipts",
      category: "Finance",
      author: "Finance Product Lead",
      date: "Jul 22, 2026",
      readTime: "5 min read",
      excerpt: "A deep dive into fee head breakdown, automated receipt numbering, and online transaction reconciliation.",
    },
    {
      id: 4,
      title: "Designing Conflict-Free Weekly Timetables for Multi-Faculty Institutions",
      category: "Academics",
      author: "Academic Advisory Board",
      date: "Jul 15, 2026",
      readTime: "7 min read",
      excerpt: "Solving room double-booking and teacher availability constraints with real-time validation checks.",
    },
  ];

  const categories = ["All", "Architecture", "Operations", "Finance", "Academics"];

  const filteredArticles = articles.filter((a) => {
    const matchesCat = activeCategory === "All" || a.category === activeCategory;
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featured = articles.find((a) => a.featured);

  return (
    <div className="pt-10 pb-20 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          Higher Ed Insights & Product Updates
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          College ERP Engineering & Product Blog
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Best practices, technical deep-dives, and administrative guides for modern academic institutions.
        </p>
      </div>

      {/* Search & Categories */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-3xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeCategory === c ? "bg-indigo-600 text-white" : "bg-slate-950 text-slate-400 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Featured Article Card */}
      {featured && activeCategory === "All" && !searchTerm && (
        <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 rounded-3xl p-8 sm:p-12 border border-indigo-500/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-indigo-900 text-indigo-200 border border-indigo-700 uppercase">
              Featured Deep-Dive
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
              {featured.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              {featured.excerpt}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 font-medium">
              <span>By {featured.author}</span>
              <span>•</span>
              <span>{featured.date}</span>
              <span>•</span>
              <span>{featured.readTime}</span>
            </div>
          </div>
          <div className="lg:col-span-4 flex justify-end">
            <Link to="#" className="px-6 py-3.5 bg-white text-slate-950 font-bold rounded-2xl text-xs hover:bg-slate-100 transition-colors flex items-center gap-2">
              Read Full Article <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredArticles.map((art) => (
          <div key={art.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition-colors">
            <div className="space-y-3">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-indigo-400 border border-slate-800">
                {art.category}
              </span>
              <h3 className="text-base font-bold text-white line-clamp-2 leading-snug">{art.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{art.excerpt}</p>
            </div>
            <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
              <span>{art.date}</span>
              <span className="text-indigo-400 font-semibold">Read →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-10 text-center space-y-4 max-w-2xl mx-auto backdrop-blur-xl">
        <Mail className="w-8 h-8 text-indigo-400 mx-auto" />
        <h3 className="text-2xl font-bold text-white">Subscribe to Higher Ed Engineering Digest</h3>
        <p className="text-xs text-slate-400">Receive bi-weekly technical deep-dives on multi-tenant SaaS architecture and institutional compliance.</p>
        <div className="flex gap-2 max-w-md mx-auto pt-2">
          <input type="email" placeholder="Enter institutional email..." className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500" />
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-xl transition-colors">Subscribe</button>
        </div>
      </div>
    </div>
  );
};
