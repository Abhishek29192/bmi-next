import { Canvas } from "@bmi-digital/react-pdf-maker";
import React from "react";

export const Line = ({
  width,
  thickness = 1,
  color = "black"
}: {
  width: number;
  thickness?: number;
  color?: string;
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
