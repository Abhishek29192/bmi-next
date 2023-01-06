import { LinkCard, LinkCardProps } from "@bmi-digital/components";
import React, { useRef } from "react";
import withGTM from "../../../utils/google-tag-manager";
import { useScrollTo } from "./useScrollTo";

export const IntegratedLinkCard = ({
  isOpen,
  ...rest
}: LinkCardProps): JSX.Element => {
  const linkCardElement = useRef<HTMLElement>(null);
  const [setCardExpansionCompleted] = useScrollTo(!!isOpen, linkCardElement);

  return (
    <LinkCard
      isOpen={isOpen}
      ref={linkCardElement}
      {...rest}
      onExpandCompleted={() => {
        setCardExpansionCompleted(true);
      }}
    />
  );
};

export const GTMIntegratedLinkCard = withGTM<LinkCardProps>(IntegratedLinkCard);
