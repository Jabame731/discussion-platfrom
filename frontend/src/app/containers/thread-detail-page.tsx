import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import clsx from "clsx";

import PageShell from "../components/layout/page-shell";
import Spinner from "../components/ui/spinner";
import Avatar from "../components/ui/avatar";
import Tag from "../components/ui/tag";
import VoteButtons from "../components/ui/vote-buttons";
import CommentNode from "../components/comments/comment-node";
import NewCommentForm from "../components/comments/new-comment-form";

import {
  selectCurrentThread,
  selectThreadLoading,
  selectThreadError,
  selectCommentsByThread,
  selectCommentsLoading,
  selectCurrentUser,
  selectIsLoggedIn,
  useAppDispatch,
  useAppSelector,
  threadActions,
} from "../data/store";

import { ThreadsUsecase } from "../usecases";
import {
  updateThread,
  deleteThread,
  voteThread,
} from "../data/store/effects/thread.effects";

const ThreadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const thread = useAppSelector(selectCurrentThread);
  const loading = useAppSelector(selectThreadLoading);
  const error = useAppSelector(selectThreadError);
  const comments = useAppSelector(selectCommentsByThread(id ?? ""));
  const commentsLoading = useAppSelector(selectCommentsLoading(id ?? ""));
  const user = useAppSelector(selectCurrentUser);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: "", body: "", tags: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(null);
  const [voteLoading, setVoteLoading] = useState(false);
  const [localVotes, setLocalVotes] = useState({ up: 0, down: 0 });

  const isOwner = user?.username === thread?.author?.username;

  useEffect(() => {
    if (!id) return;
    const usecase = new ThreadsUsecase(dispatch);
    usecase.getThread(id);
  }, [id, dispatch]);

  useEffect(() => {
    if (thread) {
      setLocalVotes({
        up: thread.upvotes_count ?? 0,
        down: thread.downvotes_count ?? 0,
      });
      setEditData({
        title: thread.title,
        body: thread.body,
        tags: thread.tags?.join(", ") ?? "",
      });
    }
  }, [thread]);

  const handleVote = async (type: "upvote" | "downvote") => {
    if (!isLoggedIn) {
      toast.info("Sign in to vote", { position: "bottom-right" });
      return;
    }
    if (voteLoading || !thread) return;
    setVoteLoading(true);

    const prev = userVote;
    const prevVotes = { ...localVotes };

    // Optimistic update
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
        voteThread({ id: thread.slug, voteType: type }),
      ).unwrap();
      if (result) {
        setLocalVotes({
          up: result.upvotes_count,
          down: result.downvotes_count,
        });
        setUserVote(result.action === "removed" ? null : type);
      }
    } catch {
      // Rollback
      setUserVote(prev);
      setLocalVotes(prevVotes);
    } finally {
      setVoteLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thread) return;
    setEditLoading(true);
    try {
      const tags = editData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      await dispatch(
        updateThread({
          slug: thread.slug,
          payload: { title: editData.title, body: editData.body, tags },
        }),
      ).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await dispatch(
        deleteThread({
          id: thread?.id as number,
          slug: thread?.slug as string,
        }),
      ).unwrap();
      if (thread!.protocol_id) {
        navigate(`/protocols/${thread!.protocol?.slug ?? thread!.protocol_id}`);
      } else {
        navigate("/threads");
      }
    } catch {
      toast.error("Failed to delete thread", { position: "bottom-right" });
      setDeleteLoading(false);
    }
  };

  if (loading)
    return (
      <PageShell>
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </PageShell>
    );

  if (error || !thread)
    return (
      <PageShell>
        <div className="card p-8 text-center">
          <p className="text-red-400">{error ?? "Thread not found."}</p>
          <Link to="/threads" className="btn-ghost mt-4 inline-block">
            ← Back to threads
          </Link>
        </div>
      </PageShell>
    );

  const createdAt = new Date(thread.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <PageShell className="max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-stone-600 mb-6 animate-fade-in flex-wrap">
        <Link to="/threads" className="hover:text-stone-400 transition-colors">
          Threads
        </Link>
        {thread.protocol && (
          <>
            <span>/</span>
            <Link
              to={`/protocols/${thread.protocol.slug}`}
              className="hover:text-stone-400 transition-colors truncate max-w-40"
            >
              {thread.protocol.title}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-stone-400 truncate max-w-48">{thread.title}</span>
      </div>

      {/* Thread Body */}
      <div className="card p-6 mb-6 animate-fade-up" style={{ opacity: 0 }}>
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <h3 className="font-serif text-lg text-stone-200 mb-2">
              Edit Thread
            </h3>
            <input
              value={editData.title}
              onChange={(e) =>
                setEditData((d) => ({ ...d, title: e.target.value }))
              }
              className="input text-base"
              placeholder="Thread title"
              required
            />
            <textarea
              value={editData.body}
              onChange={(e) =>
                setEditData((d) => ({ ...d, body: e.target.value }))
              }
              className="textarea min-h-36"
              placeholder="Thread body"
              required
            />
            <input
              value={editData.tags}
              onChange={(e) =>
                setEditData((d) => ({ ...d, tags: e.target.value }))
              }
              className="input text-sm"
              placeholder="Tags (comma separated)"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={editLoading}
                className="btn-primary text-sm"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-ghost text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Tags */}
            {thread.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {thread.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="font-serif text-2xl sm:text-3xl text-stone-100 leading-snug mb-4">
              {thread.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-3 text-sm text-stone-500 mb-5 flex-wrap">
              <div className="flex items-center gap-2">
                <Avatar name={thread.author?.name ?? "?"} size="xs" />
                <span>{thread.author?.name ?? "Unknown"}</span>
              </div>
              <span className="text-stone-700">·</span>
              <span>{createdAt}</span>
              {thread.status !== "open" && (
                <>
                  <span className="text-stone-700">·</span>
                  <span
                    className={clsx(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      thread.status === "pinned"
                        ? "bg-amber-900/40 text-amber-400"
                        : "bg-stone-800 text-stone-400",
                    )}
                  >
                    {thread.status}
                  </span>
                </>
              )}
            </div>

            {/* Body */}
            <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-wrap">
              {thread.body}
            </p>

            {/* Actions row */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#2a2820]">
              <VoteButtons
                upvotes={localVotes.up}
                downvotes={localVotes.down}
                userVote={userVote}
                onVote={handleVote}
                loading={voteLoading}
              />

              {isOwner && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="text-xs text-red-500 hover:text-red-400 transition-colors px-2 py-1 rounded disabled:opacity-50"
                  >
                    {deleteLoading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Comments section */}
      <div className="animate-fade-up stagger-1" style={{ opacity: 0 }}>
        <h2 className="font-serif text-lg text-stone-200 mb-4">
          {thread.comments_count} Comment
          {thread.comments_count !== 1 ? "s" : ""}
        </h2>

        {isLoggedIn ? (
          <div className="mb-6">
            <NewCommentForm threadId={id ?? ""} threadSlug={thread.slug} />
          </div>
        ) : (
          <div className="card p-4 mb-6 text-sm text-stone-500">
            <Link to="/login" className="text-sage-400 hover:text-sage-300">
              Sign in
            </Link>{" "}
            to join the discussion.
          </div>
        )}

        {commentsLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : comments.length === 0 ? (
          <div className="card p-8 text-center text-stone-500 text-sm">
            No comments yet. Be the first to reply!
          </div>
        ) : (
          <div className="space-y-0">
            {comments.map((comment) => (
              <CommentNode
                key={comment.id}
                comment={comment}
                depth={0}
                threadId={id ?? ""}
                threadSlug={thread.slug}
              />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default ThreadDetailPage;
