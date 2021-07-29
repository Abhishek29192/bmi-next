import toArray from "../utils/toArray";
import extractDefinitions from "../extractDefinitions";
import { ComponentProps } from "../types";

const View = ({ children, ...rest }: ComponentProps): any => {
  return {
    stack: toArray(extractDefinitions(children), true),
    ...rest
  };
};

export default View;
