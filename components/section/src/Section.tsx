import React, { createContext, useContext } from "react";
import Typography, { Props as TypographyProps } from "@bmi/typography";
import { Container } from "@material-ui/core";
import styles from "./Section.module.scss";
import classnames from "classnames";

export const SectionContext = createContext<boolean>(false);

export type Props = {
  backgroundColor?: "transparent" | "alabaster" | "white" | "pearl";
  children: React.ReactNode;
  size?: "lg" | "md" | "sm" | "xl" | "xs" | false;
};

const Section = ({
  backgroundColor = "transparent",
  children,
  size = "xl"
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
        className={classnames(styles["Section"], {
          [styles[`Section--${backgroundColor}`]]:
            backgroundColor !== "transparent"
        })}
      >
        <Container maxWidth={size}>{children}</Container>
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
