import toArray from "../utils/toArray";
import extractDefinitions from "../extractDefinitions";

const View = ({ children, ...rest }): any => {
  return {
    stack: toArray(extractDefinitions(children), true),
    ...rest
  };
};

export default View;
