import { useState } from "react";
import type { NewThreadFormProps } from "../../models";

const NewThreadForm = ({
  protocolId,
  onSuccess,
  onCancel,
}: NewThreadFormProps) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card p-5 space-y-4 animate-fade-up"
    >
      <h3 className="font-serif text-lg text-stone-100">Start a Discussion</h3>
      {error && (
        <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Thread title..."
        className="input"
        required
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Share your thoughts..."
        className="textarea min-h-30"
        required
      />
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
        className="input text-sm"
      />
      <div className="flex items-center gap-2 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-ghost">
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !title.trim() || !body.trim()}
          className="btn-primary"
        >
          {loading ? "Posting..." : "Post Thread"}
        </button>
      </div>
    </form>
  );
};

export default NewThreadForm;
