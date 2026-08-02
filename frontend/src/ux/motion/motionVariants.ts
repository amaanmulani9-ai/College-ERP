import { MOTION_TOKENS } from "./motionTokens";

export const MOTION_VARIANTS = {
  fade: {
    enter: "transition-opacity duration-200 ease-out opacity-100",
    exit: "transition-opacity duration-150 ease-in opacity-0",
    hidden: "opacity-0",
  },
  scale: {
    enter: "transition-all duration-200 ease-out scale-100 opacity-100",
    exit: "transition-all duration-150 ease-in scale-95 opacity-0",
    hidden: "scale-95 opacity-0",
  },
  slideUp: {
    enter: "transition-all duration-300 ease-out translate-y-0 opacity-100",
    exit: "transition-all duration-200 ease-in translate-y-4 opacity-0",
    hidden: "translate-y-4 opacity-0",
  },
  slideDown: {
    enter: "transition-all duration-300 ease-out translate-y-0 opacity-100",
    exit: "transition-all duration-200 ease-in -translate-y-4 opacity-0",
    hidden: "-translate-y-4 opacity-0",
  },
  slideRight: {
    enter: "transition-all duration-300 ease-out translate-x-0 opacity-100",
    exit: "transition-all duration-200 ease-in translate-x-full opacity-0",
    hidden: "translate-x-full opacity-0",
  },
  modal: {
    backdrop: "transition-opacity duration-200 ease-out bg-slate-950/80 backdrop-blur-md",
    panel: "transition-all duration-200 ease-out scale-100 opacity-100 translate-y-0",
    hidden: "scale-95 opacity-0 translate-y-2",
  },
  drawer: {
    backdrop: "transition-opacity duration-300 ease-out bg-slate-950/80 backdrop-blur-md",
    panel: "transition-transform duration-300 ease-out translate-x-0",
    hidden: "translate-x-full",
  },
  popover: {
    enter: "transition-all duration-150 ease-out scale-100 opacity-100",
    exit: "transition-all duration-100 ease-in scale-95 opacity-0",
    hidden: "scale-95 opacity-0",
  },
  tooltip: {
    enter: "transition-all duration-150 ease-out scale-100 opacity-100",
    exit: "transition-all duration-100 ease-in scale-90 opacity-0",
    hidden: "scale-90 opacity-0",
  },
  dropdown: {
    enter: "transition-all duration-150 ease-out scale-100 opacity-100 translate-y-0",
    exit: "transition-all duration-100 ease-in scale-95 opacity-0 -translate-y-1",
    hidden: "scale-95 opacity-0 -translate-y-1",
  },
  accordion: {
    open: "transition-all duration-200 ease-out max-h-96 opacity-100",
    closed: "transition-all duration-150 ease-in max-h-0 opacity-0 overflow-hidden",
  },
  toast: {
    enter: "transition-all duration-200 ease-out translate-y-0 opacity-100 scale-100",
    exit: "transition-all duration-150 ease-in translate-y-2 opacity-0 scale-95",
  },
};
