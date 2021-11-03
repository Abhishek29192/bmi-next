import { View } from "@bmi-digital/react-pdf-maker";
import React from "react";
import { Line } from "./Line";
import { Typography } from "./Typography";

export const Field = ({
  title,
  values
}: {
  title: string;
  values: string[];
}) => (
  <View marginBottom={10}>
    <Typography variant="h4" marginBottom={8}>
      {title}:
    </Typography>
    {values.map((value, key) => (
      <View key={key} marginTop={key > 0 ? 15 : 0}>
        <Typography marginBottom={5}>{value}</Typography>
        <Line color="black" width={230} />
      </View>
    ))}
  </View>
);
