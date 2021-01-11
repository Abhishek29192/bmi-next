import React from "react";
import classnames from "classnames";
import styles from "./CalculatorStepper.module.scss";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import Divider from "@material-ui/core/Divider";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Form from "@bmi/form";

type Props = {
  selected: string;
  children: React.ReactNode;
};

const CalculatorStepper = ({ selected, children }: Props) => {
  const SelectedIdentifier = (
    <Typography
      variant="body1"
      style={{
        backgroundColor: "#D9D8D8"
      }}
    >
      Selected: {selected}
    </Typography>
  );

  const isSelected = selected ? SelectedIdentifier : null;

  const items = React.Children.map(children, (child) => {
    const { value } = child.props;

    if (value !== selected) {
      return React.cloneElement(child, {
        className: classnames(styles["item"])
      });
    } else {
      return child;
    }
  });

  return (
    <div className={classnames(styles["stepper"])}>
      <div>{isSelected}</div>
      {items}
    </div>
  );
};

type StepProps = {
  value: string;
  title: string;
  subtitle: string;
  displayComputation?: string;
  backButtonLabel?: string;
  backButtonOnClick?: () => void;
  linkLabel?: string;
  linkOnClick?: () => void;
  nextLabel?: string;
  nextButtonOnClick?: (value: object) => void;
  children: React.ReactNode;
};

const Step = ({
  value,
  title,
  subtitle,
  displayComputation,
  backButtonLabel,
  backButtonOnClick,
  linkLabel,
  linkOnClick,
  nextLabel,
  nextButtonOnClick,
  children
}: StepProps) => {
  const BackButton = (
    <Button
      variant="outlined"
      onClick={backButtonOnClick}
      accessibilityLabel={"Back"}
      startIcon={<ArrowBackIcon />}
    >
      {backButtonLabel}
    </Button>
  );

  const Link = (
    <Button onClick={linkOnClick} variant="text">
      {linkLabel}
    </Button>
  );

  const NextButton = (
    <Form.SubmitButton accessibilityLabel={"Next"}>
      {nextLabel}
    </Form.SubmitButton>
  );

  const backButton = <div className={styles["back-button"]}>{BackButton}</div>;
  const displayBackButton = backButtonLabel ? backButton : null;

  const nextButton = <div className={styles["next-button"]}>{NextButton}</div>;
  const displayNextButton = nextLabel ? nextButton : null;

  const theLink = <div className={styles["link"]}>{Link}</div>;
  const displayLink = linkLabel ? theLink : null;

  const footerMarkup = (
    <div className={classnames(styles["footer"])}>
      {displayBackButton}
      {displayLink}
      {displayNextButton}
    </div>
  );

  const hasButton = backButtonLabel || nextLabel || linkLabel;
  const Footer = hasButton ? footerMarkup : null;

  return (
    <Form
      onSubmit={nextButtonOnClick}
      className={classnames(styles["CalculatorStepper"])}
    >
      <Typography variant="h4" className={classnames(styles["step-title"])}>
        {title}
      </Typography>
      <Typography variant="body2" className={classnames(styles["computation"])}>
        {displayComputation}
      </Typography>
      <Typography variant="body1" className={classnames(styles["subtitle"])}>
        {subtitle}
      </Typography>
      <Typography variant="h5" className={classnames(styles["component"])}>
        {children}
      </Typography>

      <Divider />
      {Footer}
    </Form>
  );
};

CalculatorStepper.Step = Step;

export default CalculatorStepper;
