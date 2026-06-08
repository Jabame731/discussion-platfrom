import clsx from "clsx";
import type { ToastContainerProps } from "../../models";

const ToastContainer = ({ toasts }: ToastContainerProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={clsx(
            "animate-fade-up px-4 py-3 rounded-xl text-sm font-medium shadow-2xl border pointer-events-auto",
            t.type === "success" && "bg-sage-900 border-sage-700 text-sage-200",
            t.type === "error" && "bg-red-900/80 border-red-700 text-red-200",
            t.type === "info" && "bg-stone-800 border-stone-600 text-stone-200",
          )}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
