import toArray from "../utils/toArray";
import extractDefinitions from "../extractDefinitions";
import { ComponentProps } from "../types";

const Canvas = ({ children, ...rest }: ComponentProps): any => {
  return {
    canvas: toArray(extractDefinitions(children), true),
    ...rest
  };
};

Canvas.Rect = (props: {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}) => ({ type: "rect", key: null, props: undefined, ...props });

Canvas.Line = (props: {
  lineWidth: number;
  lineColor: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) => ({ type: "line", key: null, props: undefined, ...props });

Canvas.PolyLine = (props: Record<string, unknown>) => ({
  type: "polyline",
  ...props
});

Canvas.Ellipse = (props: Record<string, unknown>) => ({
  type: "ellipse",
  ...props
});

export default Canvas;
