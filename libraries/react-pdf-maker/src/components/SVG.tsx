import { ComponentProps } from "../types";

const SVG = ({ children, ...rest }: ComponentProps): any => {
  return {
    svg: children,
    ...rest
  };
};

export default SVG;
