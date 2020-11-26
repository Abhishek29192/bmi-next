import React, { forwardRef, MouseEvent } from "react";

type HtmlLink = { href: string };
type RouterLink = { to: string; linkComponent: React.ElementType };

export type ClickableAction =
  | { model?: "default" }
  | { model: "submit" }
  | { model: "reset" }
  | ({ model: "htmlLink" } & HtmlLink)
  | ({ model: "routerLink" } & RouterLink)
  | ({ model: "download" } & HtmlLink);

type Props = {
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  children?: React.ReactNode;
  markupComponent?: React.ElementType<any>;
} & ClickableAction;

type RefElements = HTMLAnchorElement | HTMLButtonElement;

const getObjectWithoutKeys = <O extends Record<string, any>>(
  object: O,
  keys: (keyof O)[]
): Partial<O> => {
  return Object.entries(object).reduce((carry, [key, value]) => {
    if (keys.includes(key)) {
      return carry;
    }

    return {
      ...carry,
      [key]: value
    };
  }, {});
};

const Clickable = ({
  forwardedRef,
  className,
  onClick,
  children,
  markupComponent: Component,
  ...rest
}: Props & { forwardedRef: React.Ref<RefElements> }) => {
  let MarkupComponent: React.ElementType;
  let extraProps: object = {};

  switch (rest.model) {
    case "submit":
      MarkupComponent = Component || "button";

      extraProps = {
        type: "submit",
        ...getObjectWithoutKeys<typeof rest>(rest, ["model"])
      };
      break;

    case "reset":
      MarkupComponent = Component || "button";
      extraProps = {
        type: "reset",
        ...getObjectWithoutKeys<typeof rest>(rest, ["model"])
      };
      break;

    case "htmlLink":
      MarkupComponent = Component || "a";
      extraProps = getObjectWithoutKeys<typeof rest>(rest, ["model"]);

      break;

    case "routerLink":
      MarkupComponent = Component
        ? (props: Record<string, any>) => (
            <Component component={rest.linkComponent} {...props} />
          )
        : rest.linkComponent;
      extraProps = getObjectWithoutKeys<typeof rest>(rest, [
        "model",
        "linkComponent"
      ]);

      break;

    case "download":
      MarkupComponent = Component || "a";
      extraProps = {
        target: "_blank",
        rel: "noopener noreferrer",
        ...getObjectWithoutKeys<typeof rest>(rest, ["model"])
      };

      break;

    default:
      MarkupComponent = Component || "button";
      extraProps = {
        type: "button",
        ...getObjectWithoutKeys<typeof rest>(rest, ["model"])
      };
      break;
  }

  return (
    <MarkupComponent
      ref={forwardedRef}
      className={className}
      onClick={onClick}
      {...extraProps}
    >
      {children}
    </MarkupComponent>
  );
};

const withRef = <P extends Record<string, any>>(
  Component: React.ElementType
) => {
  const ClickableWithRef = forwardRef<RefElements, P>((props, ref) => (
    <Component {...props} forwardedRef={ref} />
  ));

  ClickableWithRef.displayName = "ClickableWithRef";

  return ClickableWithRef;
};

export default withRef<Props>(Clickable);

export const withClickable = <P extends Record<string, any> = {}>(
  Component: React.ElementType
) => {
  return withRef(
    ({
      action,
      forwardedRef,
      children,
      ...props
    }: P &
      Props & {
        action?: ClickableAction;
        forwardedRef: React.Ref<RefElements>;
      }) => (
      <Clickable
        forwardedRef={forwardedRef}
        markupComponent={Component}
        {...action}
        {...props}
      >
        {children}
      </Clickable>
    )
  );
};
