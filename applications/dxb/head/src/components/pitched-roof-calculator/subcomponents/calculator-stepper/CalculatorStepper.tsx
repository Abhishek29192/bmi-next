import { Button, Form, Typography } from "@bmi-digital/components";
import { ArrowBack as ArrowBackIcon } from "@bmi-digital/components/icon";
import { useMediaQuery, useTheme } from "@mui/material";
import Divider from "@mui/material/Divider";
import classnames from "classnames";
import React, { FormEvent } from "react";
import ProgressIndicator from "../../../ProgressIndicator";
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
          <ProgressIndicator size={40} className={styles["spinner"]} />
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
  subtitle: React.ReactNode;
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
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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