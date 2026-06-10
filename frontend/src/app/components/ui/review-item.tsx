import type { Review } from "../../models";
import Avatar from "./avatar";
import Stars from "./stars";

const ReviewItem = ({ review }: { review: Review }) => {
  return (
    <div className="py-4 border-b border-[#2a2820] last:border-0 animate-fade-up">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar name={review.author?.name ?? "?"} size="xs" />
          <span className="text-xs font-medium text-stone-400">
            {review.author?.name}
          </span>
        </div>
        <Stars rating={review.rating} size="sm" />
      </div>
      {review.feedback && (
        <p className="text-sm text-stone-400 leading-relaxed">
          {review.feedback}
        </p>
      )}
    </div>
  );
};

export default ReviewItem;
