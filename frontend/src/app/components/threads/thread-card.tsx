import clsx from "clsx";
import type { ThreadCardProps } from "../../models";
import { isHit } from "../../utils/helpers";
import Avatar from "../ui/avatar";
import { Link } from "react-router";
import VoteButtons from "../ui/vote-buttons";
import Tag from "../ui/tag";

const ThreadCard = ({
  thread,
  index = 0,
  compact = false,
}: ThreadCardProps) => {
  const doc = isHit(thread) ? thread.document : thread;
  const authorName = isHit(thread)
    ? thread.document.author_name
    : (thread.author?.name ?? "Unknown");
  const tags = doc.tags ?? [];
  const id = isHit(thread) ? thread.document.id : thread.id;

  const createdAt = (() => {
    const raw = isHit(thread) ? thread.document.created_at : thread.created_at;
    if (!raw) return "";
    const d = new Date(typeof raw === "number" ? raw * 1000 : raw);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  })();

  return (
    <div
      className={clsx(
        "card card-hover p-5 animate-fade-up",
        `stagger-${Math.min(index + 1, 5)}`,
      )}
      style={{ opacity: 0 }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar name={authorName} size="sm" />
          <div className="min-w-0">
            <span className="text-xs text-stone-500">{authorName}</span>
            {!isHit(thread) && thread.protocol?.title && (
              <span className="text-xs text-stone-600">
                {" "}
                · {thread.protocol.title}
              </span>
            )}
            {isHit(thread) && thread.document.protocol_title && (
              <span className="text-xs text-stone-600">
                {" "}
                · {thread.document.protocol_title}
              </span>
            )}
          </div>
        </div>
        <span className="text-xs text-stone-600 shrink-0">{createdAt}</span>
      </div>

      <Link to={`/threads/${id}`}>
        <h3 className="font-serif text-base text-stone-100 leading-snug mb-2 hover:text-sage-300 transition-colors line-clamp-2">
          {doc.title}
        </h3>
      </Link>

      {!compact && (
        <p className="text-sm text-stone-500 leading-relaxed line-clamp-2 mb-3">
          {(isHit(thread) ? thread.document.body : thread.body)?.substring(
            0,
            180,
          )}
          ...
        </p>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.slice(0, 3).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-[#2a2820]">
        {/* <VoteButtons
          upvotes={upvotes} downvotes={downvotes}
          userVote={userVote} onVote={vote} compact
        /> */}
        <Link
          to={`/threads/${id}`}
          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-300 transition-colors"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          {doc.comments_count ?? 0} comments
        </Link>
      </div>
    </div>
  );
};

export default ThreadCard;
