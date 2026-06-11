import { useState } from "react";
import Stars from "../ui/stars";
import type { Review } from "../../models";

type ReviewFormProps = {
  mode?: "create" | "edit";
  loading?: boolean;
  success?: boolean;
  slug: string;
  error: string | null;
  review?: Partial<Review>;
  onSubmit: (data: { rating: number; feedback: string; slug: string }) => void;
};

const ReviewForm = ({
  mode = "create",
  onSubmit,
  loading,
  success,
  slug,
  error,
  review,
}: ReviewFormProps) => {
  const [reviewData, setReviewData] = useState({
    rating: review?.rating ?? 0,
    feedback: review?.feedback ?? "",
  });

  const handleRatingChange = (rating: number) => {
    setReviewData((prev) => ({ ...prev, rating }));
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setReviewData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      rating: reviewData?.rating,
      feedback: reviewData?.feedback,
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
        <Stars
          rating={reviewData.rating}
          size="md"
          interactive
          onChange={handleRatingChange}
        />
        {reviewData.rating > 0 && (
          <span className="text-xs text-stone-500">{reviewData.rating}/5</span>
        )}
      </div>

      <textarea
        name="feedback"
        value={reviewData.feedback}
        onChange={handleFieldChange}
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
        disabled={loading || !reviewData.rating}
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
