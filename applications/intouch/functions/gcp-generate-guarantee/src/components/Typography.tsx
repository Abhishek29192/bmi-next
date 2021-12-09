import { Text, View } from "@bmi-digital/react-pdf-maker";
import React from "react";

export const Typography = ({
  variant = "body1",
  hasUnderline = variant === "h1",
  children,
  ...rest
}: TypographProps) => (
  <View {...rest}>
    {/* eslint-disable-next-line security/detect-object-injection */}
    <Text {...textStyles[variant]}>{children}</Text>
  </View>
);

type TypographProps = {
  variant?: string;
  hasUnderline?: boolean;
  children: React.ReactNode;
  [rest: string]: any;
};

const textStyles = {
  h1: {
    fontSize: 21,
    bold: true
  },
  h2: {
    fontSize: 17,
    bold: true
  },
  h3: {
    fontSize: 14,
    bold: true
  },
  h4: {
    fontSize: 12,
    bold: true
  },
  body1: {
    fontSize: 10
  },
  body2: {
    fontSize: 8,
    color: "#878888"
  }
};
