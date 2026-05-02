import * as React from "react";

export function Button({ className = "", variant = "default", ...props }) {
const base =
"inline-flex items-center justify-center text-sm font-medium transition rounded-xl";

const variants = {
default: "bg-blue-950 text-white hover:bg-blue-900",
outline: "border border-slate-300 bg-white hover:bg-slate-100",
secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200"
};

return (
<button
className={`${base} px-4 py-2 ${variants[variant] || variants.default} ${className}`}
{...props}
/>
);
}
