import { useState } from "react";
import type { NewThreadFormProps } from "../../models";

interface ThreadFormProps {
  error: string | null;
  isSubmitting: boolean;
  onCancel?: () => void;
  onSubmit: (data: { title: string; body: string; tags: string }) => void;
}

const NewThreadForm = ({
  onCancel,
  error,
  isSubmitting,
  onSubmit,
}: ThreadFormProps) => {
  const [threadData, setThreadData] = useState({
    title: "",
    body: "",
    tags: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setThreadData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      title: threadData.title,
      body: threadData.body,
      tags: threadData.tags,
    });
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
        value={threadData.title}
        name="title"
        onChange={handleChange}
        placeholder="Thread title..."
        className="input"
        required
      />
      <textarea
        value={threadData.body}
        onChange={handleChange}
        name="body"
        placeholder="Share your thoughts..."
        className="textarea min-h-30"
        required
      />
      <input
        type="text"
        value={threadData.tags}
        name="tags"
        onChange={handleChange}
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
          disabled={
            isSubmitting || !threadData.title.trim() || !threadData.body.trim()
          }
          className="btn-primary"
        >
          {isSubmitting ? "Posting..." : "Post Thread"}
        </button>
      </div>
    </form>
  );
};

export default NewThreadForm;
