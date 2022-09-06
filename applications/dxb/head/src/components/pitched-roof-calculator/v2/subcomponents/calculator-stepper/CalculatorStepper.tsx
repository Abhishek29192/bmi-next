import { Button, Form, Typography } from "@bmi/components";
import { useMediaQuery, useTheme } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import classnames from "classnames";
import React, { FormEvent } from "react";
import styles from "./CalculatorStepper.module.scss";

export type Props = {
  selected: string;
  children: React.ReactNode;
  loading: boolean;
};

const isStepElement = (
  element: React.ReactNode
): element is React.ReactElement<StepProps, typeof Step> =>
  !!element &&
  typeof element === "object" &&
  "type" in element &&
  element.type === Step;

const CalculatorStepper = ({ selected, children, loading }: Props) => {
  // TODO: add warnings for invalid items/keys
  const current = React.Children.toArray(children).filter((item) => {
    return isStepElement(item) && (item.key + "").substring(2) === selected;
  });

  return (
    <div className={styles["CalculatorStepper"]}>
      {loading ? (
        <div className={styles["spinnerContainer"]}>
          <CircularProgress className={styles["spinner"]} />
        </div>
      ) : (
        current
      )}
    </div>
  );
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
  nextButtonOnClick?: (e: FormEvent, value: Record<string, unknown>) => void;
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const backButton = backLabel ? (
    <Button
      variant="outlined"
      onClick={backButtonOnClick}
      accessibilityLabel="Back"
      startIcon={<ArrowBackIcon />}
      className={styles["footerButton"]}
    >
      {backLabel}
    </Button>
  ) : null;

  const link = linkLabel ? (
    <Button
      onClick={linkOnClick}
      variant="text"
      className={classnames(
        styles["footerButton"],
        styles["footerButton--link"]
      )}
    >
      {linkLabel}
    </Button>
  ) : null;

  const nextButton = nextLabel ? (
    <Form.SubmitButton
      className={styles["footerButton"]}
      accessibilityLabel="Next"
    >
      {nextLabel}
    </Form.SubmitButton>
  ) : null;

  const totalFooterButtons =
    Number(Boolean(nextButton)) +
    Number(Boolean(backButton)) +
    Number(Boolean(link));

  const footer = totalFooterButtons ? (
    <div className={classnames(styles["footer"])}>
      {isMobile ? (
        <>
          {nextButton}
          {backButton}
          {link}
        </>
      ) : (
        <>
          {backButton}
          <div className={styles["skipAndNextButtons"]}>
            {link}
            {nextButton}
          </div>
        </>
      )}
    </div>
  ) : null;

  const content = (
    <>
      <div className={styles["formContent"]}>
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
        {!footer ? <Divider className={styles["hr"]} /> : null}
      </div>
      {footer ? footer : null}
    </>
  );

  const paddingClasses = classnames(
    totalFooterButtons === 1 && styles["form--sm-padding"],
    totalFooterButtons === 2 && styles["form--md-padding"],
    totalFooterButtons === 3 && styles["form--lg-padding"]
  );

  return isForm ? (
    <Form
      data-testid="calculator-step-form"
      onSubmit={nextButtonOnClick}
      className={classnames(paddingClasses, styles["form"])}
    >
      {content}
    </Form>
  ) : (
    <div className={classnames(paddingClasses, styles["stepWithoutForm"])}>
      {content}
    </div>
  );
};

CalculatorStepper.Step = Step;

export default CalculatorStepper;
