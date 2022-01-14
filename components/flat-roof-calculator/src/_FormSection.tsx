import React from "react";
import Typography from "@bmi/typography";
import classnames from "classnames";
import styles from "./FlatRoofCalculator.module.scss";
import Section, { SectionProps } from "./_Section";

type Props = SectionProps & {
  header: string;
  description?: string;
  children: React.ReactNode;
};

const FormSection = ({ header, description, children, ...rest }: Props) => (
  <Section {...rest}>
    <Typography
      variant="h3"
      hasUnderline
      className={classnames(
        styles["header3"],
        !description && styles["header3--extra-margin"]
      )}
    >
      {header}
    </Typography>
    {description ? (
      <Typography className={styles["description"]}>{description}</Typography>
    ) : null}
    {children}
  </Section>
);

export default FormSection;
