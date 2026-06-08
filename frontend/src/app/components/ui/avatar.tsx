import clsx from "clsx";
import type { AvatarProps } from "../../models";

const Avatar = ({ name = "?", size = "sm" }: AvatarProps) => {
  const sizes = {
    xs: "w-5 h-5 text-xs",
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  };
  const colors = [
    "bg-sage-800",
    "bg-teal-800",
    "bg-blue-900",
    "bg-purple-900",
    "bg-rose-900",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div
      className={clsx(
        "rounded-full flex items-center justify-center font-semibold text-stone-300 shrink-0",
        sizes[size],
        color,
      )}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

export default Avatar;
