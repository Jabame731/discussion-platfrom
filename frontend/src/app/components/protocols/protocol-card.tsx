import { Link } from "react-router";
import type { ProtocolCardProps } from "../../models";
import { isHit } from "../../utils/helpers";
import clsx from "clsx";
import Avatar from "../ui/avatar";
import Stars from "../ui/stars";
import Tag from "../ui/tag";

const ProtocolCard = ({ protocol, index = 0 }: ProtocolCardProps) => {
  const doc = isHit(protocol) ? protocol.document : protocol;
  const authorName = isHit(protocol)
    ? protocol.document.author_name
    : (protocol.author?.name ?? "Unknown");
  const slug = isHit(protocol) ? protocol.document.id : protocol.slug;
  const tags = doc.tags ?? [];
  const rating = parseFloat(String(doc.average_rating ?? 0));
  const content = isHit(protocol)
    ? protocol.document.content
    : protocol.content;
  return (
    <Link
      to={`/protocols/${slug}`}
      className={clsx(
        "card card-hover block p-5 animate-fade-up",
        `stagger-${Math.min(index + 1, 5)}`,
      )}
      style={{ opacity: 0 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Avatar name={authorName} size="sm" />
          <span className="text-xs text-stone-500">{authorName}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Stars rating={rating} size="sm" />
          <span className="text-xs text-stone-500">
            {rating.toFixed(1)} · {doc.reviews_count ?? 0} reviews
          </span>
        </div>
      </div>

      <h3 className="font-serif text-lg text-stone-100 leading-snug mb-2 line-clamp-2">
        {doc.title}
      </h3>

      {content && (
        <p className="text-sm text-stone-500 leading-relaxed line-clamp-2 mb-3">
          {content.replace(/#{1,6}\s/g, "").substring(0, 160)}...
        </p>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.slice(0, 4).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          {tags.length > 4 && (
            <span className="text-xs text-stone-600">+{tags.length - 4}</span>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 pt-3 border-t border-[#2a2820] text-xs text-stone-600">
        <span className="flex items-center gap-1">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
          {doc.upvotes_count ?? 0}
        </span>
        <span className="ml-auto">
          {(() => {
            const raw = isHit(protocol)
              ? protocol.document.created_at
              : protocol.created_at;
            if (!raw) return "";
            const d = new Date(typeof raw === "number" ? raw * 1000 : raw);
            return d.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          })()}
        </span>
      </div>
    </Link>
  );
};

export default ProtocolCard;
