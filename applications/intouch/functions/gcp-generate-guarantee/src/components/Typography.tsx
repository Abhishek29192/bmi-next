import React from "react";
import { Text, View, Canvas } from "@bmi-digital/react-pdf-maker";

export const Typography = ({
  variant = "body1",
  hasUnderline = variant === "h1",
  children,
  ...rest
}: TypographProps) => (
  <View {...rest}>
    <Text {...textStyles[variant]}>{children}</Text>
    {hasUnderline ? <Underline large={variant === "h1"} /> : null}
  </View>
);

type TypographProps = {
  variant?: string;
  hasUnderline?: boolean;
  children: React.ReactNode;
  [rest: string]: any;
};

const Underline = ({ large }: { large?: boolean }) => (
  <Hr width={large ? 100 : 52} thickness={large ? 4 : 3} color={"#009FE3"} />
);

const Hr = ({
  width,
  thickness,
  color
}: {
  width: number;
  thickness: number;
  color: string;
}) => (
  <Canvas>
    <Canvas.Line
      lineWidth={thickness}
      lineColor={color}
      x1={0}
      y1={0}
      x2={width}
      y2={0}
    />
  </Canvas>
);

const textStyles = {
  h1: {
    fontSize: 18.5,
    lineHeight: 1.33 /* roughly 30pt */,
    bold: true // TODO: look into increasing the font weight to 900
  },
  h4: {
    fontSize: 15,
    lineHeight: 1.625 /* 26pt */,
    bold: true
  },
  h5: {
    fontSize: 11,
    lineHeight: 1.65 /* roughly 19pt */,
    bold: true // TODO: Medium
  },
  h6: {
    fontSize: 10,
    lineHeight: 2.7 /* 27pt */,
    bold: true // TODO: Medium
  },
  body1: {
    fontSize: 10,
    lineHeight: 1.4 /* 14pt */
  },
  body2: {
    fontSize: 12,
    lineHeight: 2.25 /* 27pt */,
    bold: true // TODO: Medium
  }
};
