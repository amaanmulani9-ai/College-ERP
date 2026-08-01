# Enterprise College ERP — UI Design System Specification

**Version:** v0.20.1-ui-final  
**Updated:** August 1, 2026  
**Status:** Canonical Design System Reference  

---

## 1. Design Philosophy

The College ERP UI design system is engineered to provide an authoritative, modern, enterprise SaaS aesthetic tailored for educational management. It combines vibrant dark-mode glassmorphism accents with high-contrast accessibility and responsive layouts.

---

## 2. Color Palette & Tokens

### 2.1 Core Surfaces
- **Background Slate:** `bg-slate-950` (`#020617`)
- **Card Container:** `bg-slate-900/60` with `backdrop-blur-xl` and `border border-slate-800`
- **Sub-Element Container:** `bg-slate-950/80` with `border border-slate-800/80`

### 2.2 Brand & Accent Gradients
- **Primary Action Gradient:** `from-indigo-600 via-purple-600 to-pink-600`
- **Hero Title Gradient:** `from-white via-slate-100 to-indigo-200`
- **Highlight Text Gradient:** `from-indigo-400 via-purple-400 to-pink-400`
- **Status Green (Active/Operational):** `text-emerald-400`, `bg-emerald-950/80`, `border-emerald-800`

---

## 3. Typography Hierarchy

| Element | Font Weight | Sizes (Responsive) | Usage |
|:---|:---|:---|:---|
| **H1 Display** | `font-extrabold` (800) | `text-4xl sm:text-6xl lg:text-7xl` | Hero headlines, core page headers |
| **H2 Section** | `font-extrabold` (800) | `text-3xl sm:text-5xl` | Main section titles |
| **H3 Card Header** | `font-bold` (700) | `text-lg sm:text-xl` | Module names, advantage titles |
| **Body Primary** | `font-medium` (500) | `text-sm sm:text-base` | Subheadings, intro descriptions |
| **Body Secondary**| `font-normal` (400) | `text-xs text-slate-400` | Card descriptions, metadata |
| **Pill / Badge** | `font-mono font-bold` | `text-[10px] text-[11px]` | Tags, version badges, route status |

---

## 4. Component Tokens

### 4.1 Buttons
- **Primary CTA:** `px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all`
- **Secondary Action:** `px-8 py-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:bg-slate-800 font-semibold text-slate-300 transition-all`
- **Header Pill Action:** `px-4 py-2 text-xs font-semibold rounded-xl`

### 4.2 Cards
- **Standard Card:** `rounded-3xl p-6 bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 backdrop-blur-xl shadow-lg transition-all`
- **Interactive Card:** `whileHover={{ y: -6 }}` micro-elevation via Framer Motion.

---

## 5. Animation Tokens & Framer Motion Standards

- **Fade-In & Rise:** `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}`
- **Stagger Children:** `staggerChildren: 0.05`
- **Hover Lift:** `whileHover={{ y: -5, transition: { duration: 0.2 } }}`
