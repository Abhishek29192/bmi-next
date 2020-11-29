import React, { forwardRef } from "react";

type Props = React.SVGProps<SVGElement> & {
  source: SVGImport;
};

const Icon = ({ source: MarkupComponent, ...props }: Props, ref) => (
  <MarkupComponent {...props} ref={ref} />
);

const IconWithRef = forwardRef(Icon);

export default IconWithRef;
