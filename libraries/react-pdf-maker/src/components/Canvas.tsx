import toArray from "../utils/toArray";
import extractDefinitions from "../extractDefinitions";

export const createVectorComponent = (type) => (props) => ({ type, ...props });

const Canvas = ({ children, ...rest }): any => {
  return {
    canvas: toArray(extractDefinitions(children), true),
    ...rest
  };
};

Canvas.Rect = createVectorComponent("rect");
Canvas.Line = createVectorComponent("line");
Canvas.PolyLine = createVectorComponent("polyline");
Canvas.Ellipse = createVectorComponent("ellipse");

export default Canvas;
