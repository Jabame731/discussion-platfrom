import type { ThreadItem } from "../../models";
import { isHit } from "../../utils/helpers";
import CardSkeleton from "../ui/card-skeleton";
import ThreadCard from "./thread-card";

const ThreadList = ({
  threads,
  loading,
}: {
  threads: ThreadItem[];
  loading: boolean;
}) => {
  if (loading)
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  if (!threads?.length) return null;
  return (
    <div className="space-y-3">
      {threads.map((t, i) => (
        <ThreadCard
          key={isHit(t) ? t.document.id : t.id}
          thread={t}
          index={i}
        />
      ))}
    </div>
  );
};

export default ThreadList;
