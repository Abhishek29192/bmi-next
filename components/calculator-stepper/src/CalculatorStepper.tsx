import React, { FormEvent } from "react";
import classnames from "classnames";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import Divider from "@material-ui/core/Divider";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Form from "@bmi/form";
import styles from "./CalculatorStepper.module.scss";

export type Props = {
  selected: string;
  children: React.ReactNode;
};

const isStepElement = (
  element: React.ReactNode
): element is React.ReactElement<StepProps, typeof Step> =>
  !!element &&
  typeof element === "object" &&
  "type" in element &&
  element.type === Step;

const CalculatorStepper = ({ selected, children }: Props) => {
  // TODO: add warnings for invalid items/keys
  const current = React.Children.toArray(children).filter((item) => {
    return isStepElement(item) && (item.key + "").substring(2) === selected;
  });

  return <div className={styles["CalculatorStepper"]}>{current}</div>;
};

export type StepProps = {
  isForm?: boolean;
  title: string;
  subtitle: string;
  paragraph?: React.ReactNode;
  backLabel?: string;
  backButtonOnClick?: () => void;
  linkLabel?: string;
  linkOnClick?: () => void;
  nextLabel?: string;
  nextButtonOnClick?: (e: FormEvent, value: object) => void;
  children: React.ReactNode;
};

const Step = ({
  isForm = true,
  title,
  subtitle,
  paragraph,
  backLabel,
  backButtonOnClick,
  linkLabel,
  linkOnClick,
  nextLabel,
  nextButtonOnClick,
  children
}: StepProps) => {
  const backButton = (
    <Button
      variant="outlined"
      onClick={backButtonOnClick}
      accessibilityLabel={"Back"}
      startIcon={<ArrowBackIcon />}
      className={styles["rowItem"]}
    >
      {backLabel}
    </Button>
  );

  const link = (
    <Button onClick={linkOnClick} variant="text" className={styles["rowItem"]}>
      {linkLabel}
    </Button>
  );

  const nextButton = (
    <Form.SubmitButton
      className={styles["rowItem"]}
      accessibilityLabel={"Next"}
    >
      {nextLabel}
    </Form.SubmitButton>
  );

  const footer = (
    <div
      className={classnames(
        styles["footer"],
        styles["breakableRow"],
        styles["breakableRow--reverse"]
      )}
    >
      <div className={styles["breakableRow"]}>
        {backLabel ? backButton : null}
      </div>
      <div className={styles["breakableRow"]}>
        {linkLabel ? link : null}
        {nextLabel ? nextButton : null}
      </div>
    </div>
  );

  const hasButtons = backLabel || nextLabel || linkLabel;

  const content = (
    <>
      <Typography variant="h4" className={classnames(styles["step-title"])}>
        {title}
      </Typography>
      <Typography variant="h6" className={classnames(styles["computation"])}>
        {paragraph}
      </Typography>
      <Typography variant="body1" className={classnames(styles["subtitle"])}>
        {subtitle}
      </Typography>
      <div className={styles["content"]}>{children}</div>
      <Divider className={styles["hr"]} />
      {hasButtons ? footer : null}
    </>
  );

  return isForm ? (
    <Form onSubmit={nextButtonOnClick}>{content}</Form>
  ) : (
    <div>{content}</div>
  );
};

CalculatorStepper.Step = Step;

export default CalculatorStepper;
