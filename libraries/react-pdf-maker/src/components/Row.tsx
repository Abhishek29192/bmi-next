import extractDefinitions from "../extractDefinitions";
import toArray from "../utils/toArray";

const Row = ({ children, ...rest }): any => {
  return {
    columns: toArray(extractDefinitions(children)),
    ...rest
  };
};

export default Row;
