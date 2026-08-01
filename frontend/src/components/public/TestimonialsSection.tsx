import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, UserCheck } from "lucide-react";

export interface TestimonialItem {
  name: string;
  role: string;
  category: "Student" | "Teacher" | "Principal" | "Registrar" | "Administrator" | "Finance Officer";
  institution: string;
  avatar: string;
  rating: number;
  review: string;
}

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: TestimonialItem[] = [
    {
      name: "Dr. Rajesh Sharma",
      role: "Principal",
      category: "Principal",
      institution: "Delhi Institute of Technology & Science",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
      rating: 5,
      review:
        "College ERP transformed our administrative workflow completely. Having schema-isolated multi-tenancy gives our management 100% confidence regarding student data privacy and regulatory compliance.",
    },
    {
      name: "Prof. Ananya Sen",
      role: "Head of Department (CSE)",
      category: "Teacher",
      institution: "Bangalore National University",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
      rating: 5,
      review:
        "The automated timetable conflict solver and course attendance tracking saved our faculty over 20 hours every semester. The real-time attendance deficit alerts (<75%) are brilliant.",
    },
    {
      name: "Aarav Mehta",
      role: "Final Year Student (B.Tech)",
      category: "Student",
      institution: "Mumbai Institute of Technology",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250",
      rating: 5,
      review:
        "Checking my semester results, downloading hall tickets, paying semester fees via UPI, and requesting library book reservations through the portal is so seamless!",
    },
    {
      name: "Sunil Verma",
      role: "Chief Registrar",
      category: "Registrar",
      institution: "Apex University Campus",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
      rating: 5,
      review:
        "The Admissions application pipeline and digital certificate QR verification cut our document verification cycle time from weeks down to single minutes during new student intake.",
    },
    {
      name: "Priya Nair",
      role: "Chief Financial Officer",
      category: "Finance Officer",
      institution: "Global Business School",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
      rating: 5,
      review:
        "Integrating Razorpay and Stripe directly into the fee collection module simplified payment reconciliation. Automated fee receipt generation and dues reports are 100% accurate.",
    },
    {
      name: "Vikramaditya K.",
      role: "Campus Hostel Administrator",
      category: "Administrator",
      institution: "City Polytechnic Campus",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
      rating: 5,
      review:
        "Managing hostel block allocations, bed transfers, visitor logs, and maintenance tickets in one place linked with the Fee system has streamlined our entire residential operations.",
    },
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="testimonials">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-xs font-semibold backdrop-blur-md">
          <UserCheck className="w-3.5 h-3.5 text-amber-400" />
          Institutional Voice & Satisfaction
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Trusted by Educators & Administrators
        </h2>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          See how campus principals, registrars, finance heads, and students rely on College ERP daily.
        </p>
      </div>

      {/* Mobile Carousel View */}
      <div className="md:hidden relative bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-sm text-slate-300 italic leading-relaxed">
              "{testimonials[currentIndex].review}"
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                {testimonials[currentIndex].name.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{testimonials[currentIndex].name}</h4>
                <p className="text-xs text-indigo-400 font-medium">{testimonials[currentIndex].role}</p>
                <p className="text-[10px] text-slate-500">{testimonials[currentIndex].institution}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/60">
          <button
            onClick={handlePrev}
            aria-label="Previous Testimonial"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-mono text-slate-400">
            {currentIndex + 1} / {testimonials.length}
          </span>
          <button
            onClick={handleNext}
            aria-label="Next Testimonial"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-slate-900/60 dark:bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 backdrop-blur-xl transition-all shadow-lg hover:shadow-amber-500/10 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-slate-700 group-hover:text-amber-500/40 transition-colors" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic mb-6">
                "{item.review}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-800/60">
              <div className="w-10 h-10 rounded-2xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center font-bold text-indigo-300 text-sm shadow-md">
                {item.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {item.name}
                </h4>
                <p className="text-[11px] text-indigo-400 font-medium">{item.role}</p>
                <p className="text-[10px] text-slate-500">{item.institution}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
