import LinkCard, { LinkCardProps } from "@bmi-digital/components/link-card";
import React, { MutableRefObject, useRef } from "react";
import { useScrollTo } from "./useScrollTo";

export const IntegratedLinkCard = ({
  isOpen,
  children,
  ...rest
}: LinkCardProps): JSX.Element => {
  const linkCardElement = useRef<HTMLDivElement | undefined>(
    undefined
  ) as MutableRefObject<HTMLDivElement>;
  const [setCardExpansionCompleted] = useScrollTo(
    isOpen ?? false,
    linkCardElement
  );

  return (
    <LinkCard
      isOpen={isOpen}
      ref={linkCardElement}
      {...rest}
      onExpandCompleted={() => {
        setCardExpansionCompleted(true);
      }}
    >
      {children}
    </LinkCard>
  );
};
