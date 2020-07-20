import React from "react";

type Props = React.SVGProps<SVGElement> & {
  source: any; // TODO
};

const Icon = ({ source: MarkupComponent, ...props }: Props) => (
  <MarkupComponent {...props} />
);

export default Icon;
