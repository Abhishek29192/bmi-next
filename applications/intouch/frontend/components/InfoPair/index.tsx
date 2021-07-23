import React from "react";
import Typography from "@bmi/typography";

export type InfoPairProps = {
  title: string;
  children: React.ReactNode | React.ReactNode[];
};

export const InfoPair = ({ title, children }: InfoPairProps) => (
  <div style={{ marginBottom: "1.5rem" }}>
    <Typography variant="h6">{title}</Typography>
    <Typography component="div" variant="body1">
      {children}
    </Typography>
  </div>
);
