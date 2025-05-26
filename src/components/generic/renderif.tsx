import React from "react";

const RenderIf = ({
  children,
  condition,
}: {
  children: React.ReactNode | ((param?: any) => React.ReactNode);
  condition: boolean | undefined | null;
}) => {
  return (
    <>
      {condition
        ? typeof children === "function"
          ? children()
          : children
        : null}
    </>
  );
};

export default RenderIf;