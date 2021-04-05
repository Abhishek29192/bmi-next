import React from "react";
import Typography from "@bmi/typography";

export type InfoPairProps = {
  title: string;
  children: React.ReactNode | React.ReactNode[];
};

export const InfoPair = ({ title, children }: InfoPairProps) => (
  <div style={{ marginBottom: "2rem" }}>
    <Typography variant="h6">{title}</Typography>
    <Typography variant="body1">{children}</Typography>
  </div>
);
