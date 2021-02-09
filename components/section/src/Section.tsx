import React, { createContext, useContext } from "react";
import Typography, { Props as TypographyProps } from "@bmi/typography";
import Container, { Props as ContainerProps } from "@bmi/container";
import classnames from "classnames";
import styles from "./Section.module.scss";

export const SectionContext = createContext<boolean>(false);

export type Props = {
  backgroundColor?: "transparent" | "alabaster" | "white" | "pearl";
  children: React.ReactNode;
  size?: "lg" | "md" | "sm" | "xl" | "xs" | false;
  spacing?: "default" | "none";
  className?: string;
  id?: string;
  hasNoPadding?: boolean;
  isSlim?: boolean;
} & ContainerProps;

const Section = ({
  backgroundColor = "transparent",
  children,
  size = "xl",
  spacing = "default",
  className,
  id,
  hasNoPadding = false,
  isSlim = false,
  ...containerProps
}: Props) => {
  const isNested = useContext(SectionContext);

  if (isNested) {
    /* istanbul ignore next */
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn(
        "Section: You cannot nest multiple section components - only children nodes will be rendered."
      );
    }

    return <>{children}</>;
  }

  return (
    <SectionContext.Provider value={true}>
      <div
        id={id}
        className={classnames(className, styles["Section"], {
          [styles[`Section--${backgroundColor}`]]:
            backgroundColor !== "transparent",
          [styles["Section--no-spacing"]]: spacing === "none",
          [styles["Section--slim"]]: isSlim
        })}
      >
        <Container
          maxWidth={size}
          disableGutters={hasNoPadding}
          {...containerProps}
        >
          {children}
        </Container>
      </div>
    </SectionContext.Provider>
  );
};

const SectionTitle = ({ className, ...rest }: TypographyProps) => (
  <Typography
    variant="h2"
    hasUnderline
    className={classnames(styles["title"], className)}
    {...rest}
  />
);

Section.Title = SectionTitle;

export default Section;
