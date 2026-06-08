import type { ProtocolListProps } from "../../models";
import { isHit } from "../../utils/helpers";
import CardSkeleton from "../ui/card-skeleton";
import ProtocolCard from "./protocol-card";

const ProtocolList = ({ protocols, loading, error }: ProtocolListProps) => {
  if (loading)
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  if (error)
    return (
      <div className="card p-8 text-center text-stone-500">
        <p className="text-red-400 mb-1">Failed to load protocols</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  if (!protocols?.length) return null;
  return (
    <div className="space-y-3">
      {protocols.map((p, i) => (
        <ProtocolCard
          key={isHit(p) ? p.document.id : p.id}
          protocol={p}
          index={i}
        />
      ))}
    </div>
  );
};

export default ProtocolList;
