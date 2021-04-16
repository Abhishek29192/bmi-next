// TODO: Use the package definition whenever they publish it.
// https://github.com/xiaody/react-lines-ellipsis/issues/46
declare module "react-lines-ellipsis" {
  import React from "react";

  interface ReactLinesEllipsisProps {
    basedOn?: "letters" | "words";
    className?: string;
    component?: React.ReactComponent;
    ellipsis?: string;
    isClamped?: () => boolean;
    maxLine?: number | string;
    onReflow?: ({ clamped, text }: { clamped: boolean; text: string }) => any;
    style?: React.CSSProperties;
    text?: string;
    trimRight?: boolean;
    winWidth?: number;
  }

  class LinesEllipsis extends React.Component<ReactLinesEllipsisProps> {
    static defaultProps?: ReactLinesEllipsisProps;
  }

  export default LinesEllipsis;
}

declare module "react-lines-ellipsis/lib/responsiveHOC" {
  import * as React from "react";

  export default function responsiveHOC(): <P extends object>(
    WrappedComponent: React.ComponentType<P>
  ) => React.ComponentClass<P>;
}
