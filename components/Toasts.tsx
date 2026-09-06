"use client";

import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useCart } from "@/context/CartContext";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: "bg-emerald/10 border-emerald/30 text-emerald",
  error: "bg-oxblood/10 border-oxblood/30 text-oxblood",
  info: "bg-gold/10 border-gold/30 text-gold",
};

function ToastItem({ toast, onDismiss }: { toast: { id: string; message: string; type: "success" | "error" | "info" }; onDismiss: (id: string) => void }) {
  const Icon = icons[toast.type];
  const colorClass = colors[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`relative flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 animate-slide-in ${colorClass}`}
      role="alert"
      aria-live="polite"
    >
      <Icon className="mt-0.5 flex-shrink-0" size={18} strokeWidth={2} />
      <p className="flex-1 text-sm text-ink">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 p-1 text-ink/50 transition hover:text-ink"
        aria-label="Dismiss"
      >
        <X size={16} strokeWidth={2} />
      </button>
    </div>
  );
}

export default function Toasts() {
  const { toasts, dismissToast } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[80] flex flex-col gap-2 max-w-sm pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
}