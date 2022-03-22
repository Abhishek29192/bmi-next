import extractDefinitions from "../extractDefinitions";
import toArray from "../utils/toArray";
import { ComponentProps } from "../types";

const Row = ({ children, ...rest }: ComponentProps): any => {
  return {
    columns: toArray(extractDefinitions(children)),
    ...rest
  };
};

export default Row;
