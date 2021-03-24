import React from "react";
import Typography from "@bmi/typography";

type Props = {
  title: string;
  children: React.ReactNode | React.ReactNode[];
};

const InfoPair = ({ title, children }: Props) => (
  <div style={{ marginBottom: "2rem" }}>
    <Typography variant="h6">{title}</Typography>
    <Typography variant="body1">{children}</Typography>
  </div>
);

export default InfoPair;
