import clsx from "clsx";
import type { SortBarProps } from "../../models";
import { DEFAULT_SORT_OPTIONS } from "../../utils/helpers";

const SortBar = ({
  value,
  onChange,
  options = DEFAULT_SORT_OPTIONS,
}: SortBarProps) => {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={clsx(
            "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
            value === opt.value
              ? "bg-sage-800/60 text-sage-300 border border-sage-700/50"
              : "text-stone-500 hover:text-stone-300 hover:bg-white/5",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default SortBar;
