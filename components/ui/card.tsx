import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  glow?: boolean;
}

export function Card({
  children,
  variant = "default",
  padding = "md",
  hover = false,
  glow = false,
  className = "",
  ...props
}: CardProps) {
  // Base classes
  const baseClasses = "rounded-2xl transition-all duration-300";

  // Variant classes
  const variantClasses = {
    default: "bg-slate-800 border border-slate-700",
    glass: "bg-slate-900/50 backdrop-blur-lg border border-slate-700/50",
    elevated: "bg-slate-800 border border-slate-700 shadow-lg shadow-slate-950/50",
  };

  // Padding classes
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  // Hover classes
  const hoverClasses = hover
    ? "hover:scale-[1.02] hover:border-slate-600 cursor-pointer"
    : "";

  // Glow classes
  const glowClasses = glow
    ? "hover:ring-2 hover:ring-cyan-500/50 hover:shadow-cyan-500/20"
    : "";

  // Combine all classes
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${glowClasses} ${className}`;

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
}
