import Typography from "@bmi-digital/components/typography";
import classnames from "classnames";
import React from "react";
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
      className={classnames("header3", !description && "header3--extra-margin")}
    >
      {header}
    </Typography>
    {description ? (
      <Typography className="description">{description}</Typography>
    ) : null}
    {children}
  </Section>
);

export default FormSection;
