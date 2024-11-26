import React from "react";

export function Button({
  children,
  className = "",
  variant = "default",
  ...props
}) {
  const baseStyles = "px-4 py-2 rounded";
  const variants = {
    default: "bg-blue-500 text-white",
    outline: "border border-blue-500 text-blue-500",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
