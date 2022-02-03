import React, { useRef } from "react";
import LinkCard, { Props as LinkCardProps } from "@bmi/link-card";
import withGTM from "../../../utils/google-tag-manager";
import { useScrollTo } from "../helpers";

export const IntegratedLinkCard = ({ isOpen, ...rest }: LinkCardProps) => {
  const linkCardElement = useRef<HTMLElement>(null);
  const [setCardExpansionCompleted] = useScrollTo(isOpen, linkCardElement);

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
