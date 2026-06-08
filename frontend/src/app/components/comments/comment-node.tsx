import { useState } from "react";
import type { CommentNodeProps } from "../../models";
import clsx from "clsx";
import Avatar from "../ui/avatar";
import { DEPTH_COLORS, MAX_DEPTH } from "../../utils/helpers";

const CommentNode = ({
  comment,
  depth = 0,
  onReplyAdded,
}: CommentNodeProps) => {
  const [replying, setReplying] = useState(false);
  const [expanded, setExpanded] = useState(depth < 2);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //   const { upvotes, downvotes, userVote, vote } = useVote(
  //     comment.upvotes_count,
  //     comment.downvotes_count,
  //     (type) => commentsApi.vote(comment.id, type),
  //   );

  const replies = comment.replies ?? [];
  const depthColor = DEPTH_COLORS[Math.min(depth, 4)] ?? DEPTH_COLORS[4];

  const submitReply = () => {};
  return (
    <div
      className={clsx(
        "relative",
        depth > 0 && `pl-4 ml-2 border-l-2 ${depthColor}`,
      )}
    >
      <div className="py-3">
        <div className="flex items-center gap-2 mb-2">
          <Avatar name={comment.author?.name ?? "?"} size="xs" />
          <span className="text-xs font-medium text-stone-400">
            {comment.author?.name ?? "Unknown"}
          </span>
          <span className="text-xs text-stone-600">·</span>
          <span className="text-xs text-stone-600">
            {new Date(comment.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <p
          className={clsx(
            "text-sm leading-relaxed mb-3",
            comment.is_deleted ? "text-stone-600 italic" : "text-stone-300",
          )}
        >
          {comment.is_deleted ? "[deleted]" : comment.body}
        </p>

        {!comment.is_deleted && (
          <div className="flex items-center gap-3">
            {/* <VoteButtons
              upvotes={upvotes}
              downvotes={downvotes}
              userVote={userVote}
              onVote={vote}
              compact
            /> */}

            {depth < MAX_DEPTH && (
              <button
                onClick={() => setReplying((v) => !v)}
                className={clsx(
                  "text-xs font-medium transition-colors flex items-center gap-1",
                  replying
                    ? "text-sage-400"
                    : "text-stone-500 hover:text-stone-300",
                )}
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
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
                Reply
              </button>
            )}

            {replies.length > 0 && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="text-xs text-stone-600 hover:text-stone-400 transition-colors"
              >
                {expanded
                  ? "▾ Hide"
                  : `▸ ${replies.length} repl${replies.length > 1 ? "ies" : "y"}`}
              </button>
            )}
          </div>
        )}

        {replying && (
          <div className="mt-3 space-y-2 animate-fade-up">
            {error && <p className="text-xs text-red-400">{error}</p>}
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${comment.author?.name ?? "this comment"}...`}
              className="textarea text-sm min-h-20"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={submitReply}
                disabled={submitting || !replyText.trim()}
                className="btn-primary text-xs py-1.5 px-3"
              >
                {submitting ? "Posting..." : "Reply"}
              </button>
              <button
                onClick={() => {
                  setReplying(false);
                  setReplyText("");
                  setError(null);
                }}
                className="btn-ghost text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {expanded && replies.length > 0 && (
        <div className="space-y-0">
          {replies.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onReplyAdded={onReplyAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentNode;
