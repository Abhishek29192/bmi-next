import React, { forwardRef, MouseEvent } from "react";

type HtmlLink = { href: string };
type RouterLink = { to: string; linkComponent: React.ElementType };

export type ClickableAction =
  | { model?: "default" }
  | { model: "submit" }
  | { model: "reset" }
  | ({ model: "htmlLink" } & HtmlLink)
  | ({ model: "routerLink" } & RouterLink);

type Props = {
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  children?: React.ReactNode;
  component?: React.ElementType<any>;
} & ClickableAction;

type RefElements = HTMLAnchorElement | HTMLButtonElement;

const Clickable = ({
  forwardedRef,
  className,
  onClick,
  children,
  component,
  ...rest
}: Props & { forwardedRef: React.Ref<RefElements> }) => {
  let MarkupComponent: React.ElementType;
  let extraProps: object = {};

  switch (rest.model) {
    case "submit":
      MarkupComponent = component || "button";

      extraProps = {
        type: "submit"
      };
      break;

    case "reset":
      MarkupComponent = component || "button";
      extraProps = {
        type: "reset"
      };
      break;

    case "htmlLink":
      // eslint-disable-next-line no-case-declarations
      const { href } = rest;

      MarkupComponent = component || "a";
      extraProps = {
        href
      };

      break;

    case "routerLink":
      // eslint-disable-next-line no-case-declarations
      const { to, linkComponent } = rest,
        Component = component;

      MarkupComponent = Component
        ? (props: Record<string, any>) => (
            <Component to={to} component={linkComponent} {...props} />
          )
        : linkComponent;

      break;

    default:
      MarkupComponent = component || "button";
      extraProps = {
        type: "button"
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
        component={Component}
        {...action}
        {...props}
      >
        {children}
      </Clickable>
    )
  );
};
