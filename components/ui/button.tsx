import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  // Base classes
  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Variant classes
  const variantClasses = {
    primary: "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/50 hover:scale-105 active:scale-98 focus:ring-cyan-500",
    secondary: "border border-slate-700 text-slate-300 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-600 focus:ring-slate-500",
    ghost: "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 focus:ring-slate-500",
    danger: "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-500/30 focus:ring-red-500",
  };

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // Width classes
  const widthClasses = fullWidth ? "w-full" : "";

  // Combine all classes
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`;

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
