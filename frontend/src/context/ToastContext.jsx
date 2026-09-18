import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const STYLES = {
  success: { icon: CheckCircle2, bar: "bg-emerald-600", iconColor: "text-emerald-600" },
  error: { icon: XCircle, bar: "bg-rose-600", iconColor: "text-rose-600" },
  info: { icon: Info, bar: "bg-sky-600", iconColor: "text-sky-600" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type, message, duration = 3500) => {
      const id = ++counter.current;
      setToasts((prev) => [...prev, { id, type, message }]);
      if (duration) setTimeout(() => remove(id), duration);
      return id;
    },
    [remove]
  );

  const toast = {
    success: (msg, duration) => push("success", msg, duration),
    error: (msg, duration) => push("error", msg, duration),
    info: (msg, duration) => push("info", msg, duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-20 right-4 z-[200] flex flex-col gap-2 w-[calc(100%-2rem)] sm:w-96">
        {toasts.map((t) => {
          const cfg = STYLES[t.type] || STYLES.info;
          const Icon = cfg.icon;
          return (
            <div
              key={t.id}
              className="relative overflow-hidden bg-white rounded-xl shadow-elevated border border-stone-200 flex items-start gap-3 p-4 animate-toastIn"
            >
              <span className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.bar}`} />
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${cfg.iconColor}`} />
              <p className="text-sm text-stone-700 flex-1 leading-snug">{t.message}</p>
              <button
                onClick={() => remove(t.id)}
                className="text-stone-300 hover:text-stone-500 transition"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
