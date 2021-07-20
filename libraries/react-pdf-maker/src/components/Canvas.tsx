import toArray from "../utils/toArray";
import extractDefinitions from "../extractDefinitions";

const Canvas = ({ children, ...rest }): any => {
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
}) => ({ type: "rect", key: undefined, props: undefined, ...props });

Canvas.Line = (props: {
  lineWidth: number;
  lineColor: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) => ({ type: "line", key: undefined, props: undefined, ...props });

Canvas.PolyLine = (props: {}) => ({ type: "polyline", ...props });

Canvas.Ellipse = (props: {}) => ({ type: "ellipse", ...props });

export default Canvas;
