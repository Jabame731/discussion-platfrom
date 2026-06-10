import type { Review, User } from "../../models";
import Avatar from "./avatar";
import Stars from "./stars";

const ReviewItem = ({
  review,
  user,
  onEdit,
  onDelete,
}: {
  review: Review;
  user?: User | null;
  onEdit: (review: Review) => void;
  onDelete: (review: Review) => void;
}) => {
  const isOwner = user?.username === review.author?.username;

  return (
    <div className="py-4 border-b border-[#2a2820] last:border-0 animate-fade-up">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar name={review.author?.name ?? "?"} size="xs" />
          <span className="text-xs font-medium text-stone-400">
            {review.author?.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Stars rating={review.rating} size="sm" />

          {isOwner && (
            <>
              <button
                onClick={() => onEdit(review)}
                className="text-blue-500 text-xs"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(review)}
                className="text-red-500 text-xs"
              >
                Delete
              </button>
            </>
          )}
        </div>
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
