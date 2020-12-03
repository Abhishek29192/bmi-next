import extractDefinitions from "../extractDefinitions";

const Text = ({ children, ...rest }): any => {
  return {
    text: extractDefinitions(children),
    ...rest
  };
};

export default Text;
