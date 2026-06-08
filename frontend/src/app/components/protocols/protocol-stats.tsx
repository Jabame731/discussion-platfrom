import type { Protocol, Thread } from "../../models";
import Stars from "../ui/stars";

const ProtocolStats = ({
  protocol,
}: {
  protocol: Protocol & { threads?: Thread[] };
}) => {
  const stats = [
    {
      label: "Rating",
      value: `${(protocol.average_rating ?? 0).toFixed(1)} / 5`,
    },
    { label: "Reviews", value: protocol.reviews_count ?? 0 },
    { label: "Upvotes", value: protocol.upvotes_count ?? 0 },
    { label: "Views", value: (protocol.views_count ?? 0).toLocaleString() },
    { label: "Threads", value: protocol.threads?.length ?? 0 },
  ];
  return (
    <div className="card p-5 space-y-3">
      <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-widest">
        Stats
      </h4>
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex items-center justify-between text-sm"
        >
          <span className="text-stone-500">{s.label}</span>
          <span className="font-medium text-stone-300">{s.value}</span>
        </div>
      ))}
      <div className="pt-2">
        <Stars rating={protocol.average_rating ?? 0} size="md" />
      </div>
    </div>
  );
};

export default ProtocolStats;
