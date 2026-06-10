import clsx from "clsx";
import type { ReactNode } from "react";

const PageShell = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={clsx("max-w-6xl mx-auto px-4 sm:px-6 py-8", className)}>
      {children}
    </div>
  );
};

export default PageShell;
