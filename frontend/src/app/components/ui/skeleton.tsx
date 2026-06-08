import clsx from "clsx";

const Skeleton = ({ className }: { className: string }) => {
  return (
    <div className={clsx("animate-pulse bg-[#1e1c18] rounded", className)} />
  );
};

export default Skeleton;
