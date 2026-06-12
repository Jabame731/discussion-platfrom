import { useState } from "react";
import { toast } from "react-toastify";
import clsx from "clsx";
import type { Comment, CommentNodeProps, CommentWithVote } from "../../models";
import Avatar from "../ui/avatar";
import { DEPTH_COLORS, MAX_DEPTH } from "../../utils/helpers";
import {
  useAppDispatch,
  useAppSelector,
  selectCurrentUser,
  selectIsLoggedIn,
} from "../../data/store";
import {
  createComment,
  updateComment,
  deleteComment,
  voteComment,
} from "../../data/store/effects/comment.effects";

interface CommentNodePropsExtended extends CommentNodeProps {
  threadId: string;
  threadSlug: string;
}

const CommentNode = ({
  comment,
  depth = 0,
  onReplyAdded,
  threadId,
  threadSlug,
}: CommentNodePropsExtended) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const [replying, setReplying] = useState(false);
  const [expanded, setExpanded] = useState(depth < 2);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.body);
  const [editLoading, setEditLoading] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(null);
  const [voteLoading, setVoteLoading] = useState(false);
  const [localVotes, setLocalVotes] = useState({
    up: comment.upvotes_count ?? 0,
    down: comment.downvotes_count ?? 0,
  });

  const replies = comment.replies ?? [];
  const depthColor = DEPTH_COLORS[Math.min(depth, 4)] ?? DEPTH_COLORS[4];
  const isOwner = user?.username === comment.author?.username;

  const handleVote = async (type: "upvote" | "downvote") => {
    if (!isLoggedIn) {
      toast.info("Sign in to vote", { position: "bottom-right" });
      return;
    }
    if (voteLoading) return;
    setVoteLoading(true);

    const prev = userVote;
    const prevVotes = { ...localVotes };

    if (userVote === type) {
      setUserVote(null);
      setLocalVotes((v) => ({
        ...v,
        [type === "upvote" ? "up" : "down"]:
          v[type === "upvote" ? "up" : "down"] - 1,
      }));
    } else {
      if (userVote) {
        setLocalVotes((v) => ({
          up: type === "upvote" ? v.up + 1 : v.up - 1,
          down: type === "downvote" ? v.down + 1 : v.down - 1,
        }));
      } else {
        setLocalVotes((v) => ({
          ...v,
          [type === "upvote" ? "up" : "down"]:
            v[type === "upvote" ? "up" : "down"] + 1,
        }));
      }
      setUserVote(type);
    }

    try {
      const result = await dispatch(
        voteComment({
          threadId: threadSlug,
          commentId: comment.id,
          voteType: type,
        }),
      ).unwrap();
      if (result) {
        setLocalVotes({
          up: result.upvotes_count,
          down: result.downvotes_count,
        });
        setUserVote(result.action === "removed" ? null : type);
      }
    } catch {
      setUserVote(prev);
      setLocalVotes(prevVotes);
      toast.error("Failed to vote", { position: "bottom-right" });
    } finally {
      setVoteLoading(false);
    }
  };

  const submitReply = async () => {
    if (!replyText.trim()) return;
    setReplyLoading(true);
    setReplyError(null);
    try {
      const result = await dispatch(
        createComment({
          threadId,
          threadSlug,
          payload: { body: replyText.trim(), parent_id: comment.id },
        }),
      ).unwrap();
      if (result) {
        onReplyAdded?.(comment.id, result as Comment);
      }
      setReplyText("");
      setReplying(false);
      setExpanded(true);
    } catch (err) {
      setReplyError(
        err instanceof Error ? err.message : "Failed to post reply",
      );
    } finally {
      setReplyLoading(false);
    }
  };

  const submitEdit = async () => {
    if (!editText.trim()) return;
    setEditLoading(true);
    try {
      await dispatch(
        updateComment({
          threadId,
          commentId: comment.id,
          body: editText.trim(),
        }),
      ).unwrap();
      setIsEditing(false);
    } catch {
      toast.error("Failed to update comment", { position: "bottom-right" });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await dispatch(
        deleteComment({ threadId, commentId: comment.id }),
      ).unwrap();
    } catch {
      toast.error("Failed to delete comment", { position: "bottom-right" });
      setDeleteLoading(false);
    }
  };

  const score = localVotes.up - localVotes.down;

  return (
    <div
      className={clsx(
        "relative",
        depth > 0 && `pl-4 ml-2 border-l-2 ${depthColor}`,
      )}
    >
      <div className="py-3">
        {/* Author + date */}
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

        {/* Body / edit mode */}
        {isEditing ? (
          <div className="space-y-2 mb-2 animate-fade-up">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="textarea text-sm min-h-20"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={submitEdit}
                disabled={editLoading || !editText.trim()}
                className="btn-primary text-xs py-1.5 px-3"
              >
                {editLoading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditText(comment.body);
                }}
                className="btn-ghost text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p
            className={clsx(
              "text-sm leading-relaxed mb-3 whitespace-pre-wrap",
              comment.is_deleted ? "text-stone-600 italic" : "text-stone-300",
            )}
          >
            {comment.is_deleted ? "[deleted]" : comment.body}
          </p>
        )}

        {/* Actions */}
        {!comment.is_deleted && !isEditing && (
          <div className="flex items-center gap-3 flex-wrap">
            {/* Vote */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleVote("upvote")}
                disabled={voteLoading}
                className={clsx(
                  "flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded transition-colors",
                  userVote === "upvote"
                    ? "text-sage-400 bg-sage-950/60"
                    : "text-stone-500 hover:text-sage-400",
                )}
              >
                <svg
                  className="w-3 h-3"
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
                <span>{localVotes.up}</span>
              </button>
              <span
                className={clsx(
                  "text-xs font-medium min-w-4 text-center",
                  score > 0
                    ? "text-sage-400"
                    : score < 0
                      ? "text-red-400"
                      : "text-stone-600",
                )}
              >
                {score > 0 ? `+${score}` : score}
              </span>
              <button
                onClick={() => handleVote("downvote")}
                disabled={voteLoading}
                className={clsx(
                  "flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded transition-colors",
                  userVote === "downvote"
                    ? "text-red-400 bg-red-950/40"
                    : "text-stone-500 hover:text-red-400",
                )}
              >
                <svg
                  className="w-3 h-3"
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
                <span>{localVotes.down}</span>
              </button>
            </div>

            {/* Reply */}
            {depth < MAX_DEPTH && isLoggedIn && (
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

            {/* Expand/collapse */}
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

            {/* Edit / Delete for owner */}
            {isOwner && (
              <>
                {!comment.is_deleted && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleteLoading}
                      className="text-xs text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      {deleteLoading ? "Deleting…" : "Delete"}
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* Reply input */}
        {replying && (
          <div className="mt-3 space-y-2 animate-fade-up">
            {replyError && <p className="text-xs text-red-400">{replyError}</p>}
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
                disabled={replyLoading || !replyText.trim()}
                className="btn-primary text-xs py-1.5 px-3"
              >
                {replyLoading ? "Posting..." : "Reply"}
              </button>
              <button
                onClick={() => {
                  setReplying(false);
                  setReplyText("");
                  setReplyError(null);
                }}
                className="btn-ghost text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nested replies */}
      {expanded && replies.length > 0 && (
        <div className="space-y-0">
          {replies.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onReplyAdded={onReplyAdded}
              threadId={threadId}
              threadSlug={threadSlug}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentNode;
