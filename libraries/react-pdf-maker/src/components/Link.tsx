import extractDefinitions from "../extractDefinitions";
import { PDFNode } from "../types";
import { ComponentProps } from "../types";

type LinkProps = ComponentProps & { href: string };

const Link = ({ children, href: link, ...rest }: LinkProps): any => {
  return {
    text: (extractDefinitions(children) as PDFNode[]).join(""),
    link,
    ...rest
  };
};

export default Link;
