import classnames from "classnames";
import React, { createContext, useContext } from "react";
import Container, { Props as ContainerProps } from "../container/Container";
import Typography, { Props as TypographyProps } from "../typography/Typography";
import { useStyles } from "./styles";

export const SectionContext = createContext<boolean>(false);

export type BackgroundColor = "transparent" | "alabaster" | "white" | "pearl";

export type Props = {
  backgroundColor?: BackgroundColor;
  children: React.ReactNode;
  size?: "lg" | "md" | "sm" | "xl" | "xs" | false;
  spacing?: "default" | "none";
  className?: string;
  id?: string;
  hasNoPadding?: boolean;
  isSlim?: boolean;
  overflowVisible?: boolean;
  isDialog?: boolean;
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
  overflowVisible = false,
  isDialog = false,
  ...containerProps
}: Props) => {
  const isNested = useContext(SectionContext);
  const classes = useStyles();

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
        className={classnames(
          className,
          !isDialog && classes.root,
          backgroundColor !== "transparent" &&
            ((backgroundColor === "white" && classes.white) ||
              (backgroundColor === "alabaster" && classes.alabaster) ||
              (backgroundColor === "pearl" && classes.pearl)),
          spacing === "none" && classes.noSpacing,
          isSlim && classes.slim,
          overflowVisible && classes.overflowVisible
        )}
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

const SectionTitle = ({ className, ...rest }: TypographyProps) => {
  const classes = useStyles();
  return (
    <Typography
      variant="h2"
      hasUnderline
      className={classnames(classes.title, className)}
      {...rest}
    />
  );
};

Section.Title = SectionTitle;

export default Section;
