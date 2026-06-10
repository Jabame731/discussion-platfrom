import { useEffect, useState } from "react";

import Stars from "../ui/stars";

type ReviewFormProps = {
  mode?: "create" | "edit";
  loading?: boolean;
  success?: boolean;
  slug: string;
  error: string | null;
  initialRating?: number;
  initialFeedback?: string;
  onSubmit: (data: { rating: number; feedback: string; slug: string }) => void;
};

const ReviewForm = ({
  mode = "create",
  onSubmit,
  loading,
  success,
  slug,
  error,
  initialRating = 0,
  initialFeedback = "",
}: ReviewFormProps) => {
  const [rating, setRating] = useState(initialRating);
  const [feedback, setFeedback] = useState(initialFeedback);

  useEffect(() => {
    setRating(initialRating);
    setFeedback(initialFeedback);
  }, [initialRating, initialFeedback]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit({
      rating,
      feedback,
      slug,
    });
  };

  if (success) {
    return (
      <p className="py-3 text-sm text-sage-400">
        {mode === "edit"
          ? "Review updated successfully."
          : "Review submitted. Thank you!"}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        mode === "edit"
          ? "space-y-3"
          : "space-y-3 pt-4 border-t border-[#2a2820]"
      }
    >
      <h4 className="text-sm font-semibold text-stone-300">
        {mode === "edit" ? "" : "Write a Review"}
      </h4>

      <div className="flex items-center gap-2">
        <span className="text-xs text-stone-500">Rating:</span>

        <Stars rating={rating} size="md" interactive onChange={setRating} />

        {rating > 0 && (
          <span className="text-xs text-stone-500">{rating}/5</span>
        )}
      </div>

      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Optional feedback..."
        className="textarea min-h-20 text-sm"
      />

      {error && (
        <p className="px-3 py-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !rating}
        className="btn-primary text-sm"
      >
        {loading
          ? mode === "edit"
            ? "Updating..."
            : "Submitting..."
          : mode === "edit"
            ? "Update Review"
            : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
