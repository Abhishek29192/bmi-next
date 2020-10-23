import extractDefinitions from "../extractDefinitions";

const Link = ({ children, href: link, ...rest }): any => {
  return {
    text: extractDefinitions(children).join(""),
    link,
    ...rest
  };
};

export default Link;
