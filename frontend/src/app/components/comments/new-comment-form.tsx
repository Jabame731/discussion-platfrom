import { useState } from "react";
import { toast } from "react-toastify";
import type { Comment } from "../../models";
import { useAppDispatch } from "../../data/store";
import { createComment } from "../../data/store/effects/comment.effects";

const NewCommentForm = ({
  threadId,
  onSuccess,
  threadSlug,
}: {
  threadId: string | number;
  threadSlug: string | number;
  onSuccess?: (comment: Comment) => void;
}) => {
  const dispatch = useAppDispatch();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await dispatch(
        createComment({
          threadId,
          payload: { body: body.trim() },
          threadSlug: threadSlug,
        }),
      ).unwrap();
      setBody("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to post comment";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-sm text-red-400">{error}</p>}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add a comment..."
        className="textarea min-h-24"
        required
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !body.trim()}
          className="btn-primary"
        >
          {loading ? "Posting..." : "Comment"}
        </button>
      </div>
    </form>
  );
};

export default NewCommentForm;
