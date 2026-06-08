import type { ReactNode } from "react";

const TwoColumnLayout = ({
  main,
  sidebar,
}: {
  main: ReactNode;
  sidebar: ReactNode;
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
      <div>{main}</div>
      <div className="lg:sticky lg:top-20">{sidebar}</div>
    </div>
  );
};

export default TwoColumnLayout;
