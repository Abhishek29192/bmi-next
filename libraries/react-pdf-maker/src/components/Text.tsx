import extractDefinitions from "../extractDefinitions";
import { ComponentProps } from "../types";

const Text = ({ children, ...rest }: ComponentProps): any => {
  return {
    text: extractDefinitions(children),
    ...rest
  };
};

export default Text;
