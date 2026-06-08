import { useState } from "react";

const NewCommentForm = ({
  threadId,
  onSuccess,
}: {
  threadId: string | number;
  onSuccess?: (comment: Comment) => void;
}) => {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const id = threadId;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-sm text-red-400">{error}</p>}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add a comment..."
        className="textarea min-h-25"
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
