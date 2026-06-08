import clsx from "clsx";
import type { VoteButtonsProps } from "../../models";

const VoteButtons = ({
  upvotes,
  downvotes,
  userVote,
  onVote,
  loading,
  compact,
}: VoteButtonsProps) => {
  const score = upvotes - downvotes;

  return (
    <div className={clsx("flex items-center gap-1", compact && "scale-90")}>
      <button
        onClick={() => onVote("upvote")}
        disabled={loading}
        className={clsx("btn-vote-up", userVote === "upvote" && "active")}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
        <span>{upvotes}</span>
      </button>
      <span
        className={clsx(
          "text-xs font-semibold px-1 min-w-8 text-center",
          score > 0
            ? "text-sage-400"
            : score < 0
              ? "text-red-400"
              : "text-stone-500",
        )}
      >
        {score > 0 ? `+${score}` : score}
      </span>
      <button
        onClick={() => onVote("downvote")}
        disabled={loading}
        className={clsx("btn-vote-down", userVote === "downvote" && "active")}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <span>{downvotes}</span>
      </button>
    </div>
  );
};

export default VoteButtons;
