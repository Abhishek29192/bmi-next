import React from "react";
import { Typography } from "@bmi-digital/components";

export type InfoPairProps = {
  title: string;
  children: React.ReactNode;
};

export type MaybeInfoPairProps = InfoPairProps & { fallback: React.ReactNode };

export const MaybeInfoPair = (props: MaybeInfoPairProps) => {
  const { fallback, ...infoPairProps } = props;

  if (React.Children.count(props.children) === 0) {
    return <InfoPair {...infoPairProps}>{fallback}</InfoPair>;
  }

  return <InfoPair {...infoPairProps} />;
};

export const InfoPair = ({ title, children }: InfoPairProps) => (
  <div style={{ marginBottom: "1.5rem" }}>
    <Typography variant="h6">{title}</Typography>
    <Typography component="div" variant="body1">
      {children}
    </Typography>
  </div>
);
