import React from "react";

// ─── Shared Props ──────────────────────────────────────────────────────────
interface BaseTextProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

// ─── Heading Components ────────────────────────────────────────────────────
export interface HeadingProps extends BaseTextProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  gradient?: boolean;
}

const headingBaseClasses = "font-extrabold tracking-tight leading-tight text-white";

const headingSizeClasses: Record<string, string> = {
  h1: "text-4xl sm:text-5xl lg:text-6xl",
  h2: "text-3xl sm:text-4xl",
  h3: "text-2xl sm:text-3xl",
  h4: "text-xl sm:text-2xl",
  h5: "text-lg sm:text-xl font-bold",
  h6: "text-base sm:text-lg font-semibold",
};

const gradientClasses = "bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent";

export const Heading: React.FC<HeadingProps> = ({
  as: Tag = "h2",
  children,
  className = "",
  gradient = false,
  id,
}) => {
  return (
    <Tag
      id={id}
      className={[headingBaseClasses, headingSizeClasses[Tag], gradient ? gradientClasses : "", className].filter(Boolean).join(" ")}
    >
      {children}
    </Tag>
  );
};

// Shorthand heading components
export const H1: React.FC<Omit<HeadingProps, "as">> = (props) => <Heading as="h1" {...props} />;
export const H2: React.FC<Omit<HeadingProps, "as">> = (props) => <Heading as="h2" {...props} />;
export const H3: React.FC<Omit<HeadingProps, "as">> = (props) => <Heading as="h3" {...props} />;
export const H4: React.FC<Omit<HeadingProps, "as">> = (props) => <Heading as="h4" {...props} />;
export const H5: React.FC<Omit<HeadingProps, "as">> = (props) => <Heading as="h5" {...props} />;
export const H6: React.FC<Omit<HeadingProps, "as">> = (props) => <Heading as="h6" {...props} />;

// ─── Text / Paragraph ─────────────────────────────────────────────────────
export type TextSize = "xs" | "sm" | "base" | "lg" | "xl";
export type TextColor = "primary" | "secondary" | "muted" | "disabled" | "success" | "danger" | "warning" | "info";
export type TextWeight = "normal" | "medium" | "semibold" | "bold" | "extrabold";

export interface TextProps extends BaseTextProps {
  as?: "p" | "span" | "div" | "small" | "strong" | "em";
  size?: TextSize;
  color?: TextColor;
  weight?: TextWeight;
  muted?: boolean;
  truncate?: boolean;
  lineClamp?: 1 | 2 | 3 | 4 | 5;
}

const textSizeClasses: Record<TextSize, string> = {
  xs:   "text-xs   leading-normal",
  sm:   "text-sm   leading-normal",
  base: "text-base leading-relaxed",
  lg:   "text-lg   leading-relaxed",
  xl:   "text-xl   leading-relaxed",
};

const textColorClasses: Record<TextColor, string> = {
  primary:   "text-slate-100",
  secondary: "text-slate-300",
  muted:     "text-slate-400",
  disabled:  "text-slate-600",
  success:   "text-emerald-400",
  danger:    "text-red-400",
  warning:   "text-amber-400",
  info:      "text-sky-400",
};

const textWeightClasses: Record<TextWeight, string> = {
  normal:    "font-normal",
  medium:    "font-medium",
  semibold:  "font-semibold",
  bold:      "font-bold",
  extrabold: "font-extrabold",
};

const lineClampClasses: Record<number, string> = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
};

export const Text: React.FC<TextProps> = ({
  as: Tag = "p",
  size = "sm",
  color = "secondary",
  weight = "normal",
  muted = false,
  truncate = false,
  lineClamp,
  children,
  className = "",
  id,
}) => {
  const colorClass = muted ? "text-slate-500" : textColorClasses[color];
  return (
    <Tag
      id={id}
      className={[
        textSizeClasses[size],
        colorClass,
        textWeightClasses[weight],
        truncate ? "truncate" : "",
        lineClamp ? lineClampClasses[lineClamp] : "",
        className,
      ].filter(Boolean).join(" ")}
    >
      {children}
    </Tag>
  );
};

// ─── Label ─────────────────────────────────────────────────────────────────
export interface LabelProps extends BaseTextProps {
  htmlFor?: string;
  required?: boolean;
  size?: "sm" | "md";
}

export const Label: React.FC<LabelProps> = ({
  htmlFor,
  required = false,
  size = "md",
  children,
  className = "",
  id,
}) => (
  <label
    htmlFor={htmlFor}
    id={id}
    className={[
      size === "md" ? "text-xs" : "text-[11px]",
      "font-semibold text-slate-300 leading-none",
      className,
    ].filter(Boolean).join(" ")}
  >
    {children}
    {required && (
      <span className="ml-0.5 text-red-400 font-bold" aria-hidden="true">*</span>
    )}
  </label>
);

// ─── Caption ───────────────────────────────────────────────────────────────
export interface CaptionProps extends BaseTextProps {}
export const Caption: React.FC<CaptionProps> = ({ children, className = "", id }) => (
  <span
    id={id}
    className={["text-[11px] font-medium text-slate-500 leading-normal", className].filter(Boolean).join(" ")}
  >
    {children}
  </span>
);

// ─── Overline ──────────────────────────────────────────────────────────────
export interface OverlineProps extends BaseTextProps {}
export const Overline: React.FC<OverlineProps> = ({ children, className = "", id }) => (
  <span
    id={id}
    className={["text-[10px] font-bold tracking-widest uppercase text-slate-500 font-mono", className].filter(Boolean).join(" ")}
  >
    {children}
  </span>
);

// ─── Code ──────────────────────────────────────────────────────────────────
export interface CodeProps extends BaseTextProps {
  inline?: boolean;
}
export const Code: React.FC<CodeProps> = ({ children, inline = true, className = "", id }) => {
  if (inline) {
    return (
      <code
        id={id}
        className={["text-[11px] font-mono font-semibold text-indigo-300 bg-indigo-950/60 border border-indigo-800/60 rounded-md px-1.5 py-0.5", className].filter(Boolean).join(" ")}
      >
        {children}
      </code>
    );
  }
  return (
    <pre
      id={id}
      className={["text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-x-auto", className].filter(Boolean).join(" ")}
    >
      <code>{children}</code>
    </pre>
  );
};

// ─── Kbd (Keyboard shortcut) ───────────────────────────────────────────────
export interface KbdProps extends BaseTextProps {}
export const Kbd: React.FC<KbdProps> = ({ children, className = "" }) => (
  <kbd
    className={["text-[10px] font-mono font-bold text-slate-400 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 shadow-inner", className].filter(Boolean).join(" ")}
  >
    {children}
  </kbd>
);

// ─── Truncated Text with Tooltip ──────────────────────────────────────────
export interface TruncatedTextProps extends TextProps {
  maxChars?: number;
  title?: string;
}
export const TruncatedText: React.FC<TruncatedTextProps> = ({
  children,
  maxChars,
  title,
  ...props
}) => {
  const text = typeof children === "string" ? children : "";
  const truncated = maxChars && text.length > maxChars ? `${text.slice(0, maxChars)}…` : text;

  return (
    <Text {...props} title={title ?? text} truncate={!maxChars}>
      {truncated || children}
    </Text>
  );
};
