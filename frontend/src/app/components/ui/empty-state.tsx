import { BiSolidLeaf } from "react-icons/bi";
import type { EmptyStateProps } from "../../models";

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="text-5xl mb-4 opacity-40">
        {icon || <BiSolidLeaf className="text-green-800" />}
      </div>
      <h3 className="font-serif text-lg text-stone-300 mb-2">{title}</h3>
      {description && (
        <p className="text-stone-500 text-sm max-w-xs mb-5">{description}</p>
      )}
      {action}
    </div>
  );
};

export default EmptyState;
