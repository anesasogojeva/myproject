import React, { useEffect } from "react";
import { X } from "lucide-react";

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-[2px] animate-fadeIn"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${SIZES[size] || SIZES.md} bg-white rounded-t-3xl sm:rounded-2xl shadow-elevated
        max-h-[92vh] flex flex-col animate-fadeInScale`}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 shrink-0">
            <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="px-6 py-5 overflow-y-auto scroll-thin">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-stone-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
