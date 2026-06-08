import clsx from "clsx";
import type { TagProps } from "../../models";

const Tag = ({ children, onClick, active }: TagProps) => {
  return (
    <span
      onClick={onClick}
      className={clsx(
        "tag",
        onClick &&
          "cursor-pointer hover:bg-sage-900/60 hover:text-sage-300 transition-colors",
        active && "bg-sage-900/60! text-sage-300! border-sage-700/60!",
      )}
    >
      {children}
    </span>
  );
};

export default Tag;
