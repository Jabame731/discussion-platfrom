import { useState } from "react";

import Stars from "../ui/stars";

const ReviewForm = ({
  protocolId,
  onSuccess,
}: {
  protocolId: number | string;
  onSuccess?: () => void;
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    // e.preventDefault();
    // if (!rating) return;
    // await createReview({ rating, feedback: feedback.trim() || undefined });
    // if (!error) {
    //   setDone(true);
    // }
  };

  if (done)
    return (
      <p className="text-sm text-sage-400 py-3">Review submitted. Thank you!</p>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 pt-4 border-t border-[#2a2820]"
    >
      <h4 className="text-sm font-semibold text-stone-300">Write a Review</h4>
      {/* {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex items-center gap-2">
        <span className="text-xs text-stone-500">Rating:</span>
        <Stars rating={rating} size="md" interactive onChange={setRating} />
        {rating > 0 && (
          <span className="text-xs text-stone-500">{rating}/5</span>
        )}
      </div> */}
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Optional written feedback..."
        className="textarea text-sm min-h-20"
      />
      {/* <button
        type="submit"
        disabled={loading || !rating}
        className="btn-primary text-sm"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button> */}
    </form>
  );
};

export default ReviewForm;
