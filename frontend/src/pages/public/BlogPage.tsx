import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Calendar, Clock, ArrowRight, Tag } from "lucide-react";

export const BlogPage: React.FC = () => {
  const posts = [
    {
      title: "Designing Schema-Isolated Multi-Tenancy for Higher Ed SaaS",
      category: "Architecture",
      date: "August 1, 2026",
      readTime: "6 min read",
      excerpt: "How we leveraged PostgreSQL schema isolation (`django-tenants`) to guarantee 100% data sovereignty for multi-campus university trusts.",
    },
    {
      title: "Optimizing Redis RBAC Permission Evaluation for 500k Students",
      category: "Engineering",
      date: "July 28, 2026",
      readTime: "4 min read",
      excerpt: "Sub-millisecond dynamic permission authorization using Redis key pattern caching and automated cache invalidation signals.",
    },
    {
      title: "Automating Fee Receipts & Payment Reconciliation with Razorpay & Stripe",
      category: "Finance & Security",
      date: "July 20, 2026",
      readTime: "5 min read",
      excerpt: "Building resilient webhook listener engines for instant student fee reconciliation, automated receipting, and audit logs.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/60 text-purple-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          CampusPro Insights & Blog
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
          Engineering & EdTech{" "}
          <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Publications
          </span>
        </h1>
        <p className="text-slate-300 text-sm">
          Technical deep dives, architectural breakdowns, and educational operational insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post, idx) => (
          <div
            key={idx}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/40 transition-all group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded font-mono font-semibold">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" /> {post.readTime}
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                {post.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">{post.excerpt}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" /> {post.date}
              </span>
              <Link to="#" className="text-xs text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                Read Article <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
