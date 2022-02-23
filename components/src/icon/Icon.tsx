import React, { forwardRef, Ref } from "react";
import { SVGImport } from "@bmi-digital/svg-import";

type Props = React.SVGProps<SVGElement> & {
  source: SVGImport;
};

const Icon = ({ source: MarkupComponent, ...props }: Props, ref?: Ref<any>) => (
  <MarkupComponent {...props} ref={ref} />
);

const IconWithRef = forwardRef(Icon);

export default IconWithRef;
