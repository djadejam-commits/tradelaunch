import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  glow?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  leadingIcon,
  trailingIcon,
  glow = false,
  className = "",
  id,
  ...props
}: InputProps) {
  // Use React's useId() for stable IDs that match between server and client
  const generatedId = React.useId();
  const inputId = id || generatedId;

  // Base classes
  const baseClasses = "w-full bg-slate-800 border rounded-lg px-4 py-3 text-slate-100 placeholder:text-slate-500 transition-all duration-200 focus:outline-none";

  // Border/ring classes
  const focusClasses = glow
    ? "border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
    : "border-slate-700 focus:border-slate-600 focus:ring-2 focus:ring-slate-600/50";

  // Error classes
  const errorClasses = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
    : "";

  // Icon padding adjustments
  const iconPaddingClasses = leadingIcon ? "pl-10" : trailingIcon ? "pr-10" : "";

  // Combine all classes
  const combinedClasses = `${baseClasses} ${focusClasses} ${errorClasses} ${iconPaddingClasses} ${className}`;

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Leading Icon */}
        {leadingIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {leadingIcon}
          </div>
        )}

        {/* Input Field */}
        <input
          id={inputId}
          className={combinedClasses}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
              ? `${inputId}-helper`
              : undefined
          }
          {...props}
        />

        {/* Trailing Icon */}
        {trailingIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {trailingIcon}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-sm text-red-400 flex items-center gap-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p
          id={`${inputId}-helper`}
          className="mt-1.5 text-sm text-slate-500"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
