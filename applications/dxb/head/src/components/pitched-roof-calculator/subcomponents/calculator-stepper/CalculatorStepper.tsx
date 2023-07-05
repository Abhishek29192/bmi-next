import { Form } from "@bmi-digital/components";
import { ArrowBack as ArrowBackIcon } from "@bmi-digital/components/icon";
import { useMediaQuery, useTheme } from "@mui/material";
import classnames from "classnames";
import React, { FormEvent } from "react";
import ProgressIndicator from "../../../ProgressIndicator";
import {
  Root,
  StyledComputation,
  StyledContent,
  StyledFooter,
  StyledFooterBackButton,
  StyledFooterBackButtonLink,
  StyledForm,
  StyledFormContent,
  StyledFormSubmitButton,
  StyledHR,
  StyledSkipAndNextButtons,
  StyledSpinnerContainer,
  StyledStepTitle,
  StyledSubTitle,
  classes
} from "./CalculatorStepper.styles";

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
    <Root>
      {loading ? (
        <StyledSpinnerContainer>
          <ProgressIndicator size={40} />
        </StyledSpinnerContainer>
      ) : (
        current
      )}
    </Root>
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
    <StyledFooterBackButton
      variant="outlined"
      onClick={backButtonOnClick}
      accessibilityLabel="Back"
      startIcon={<ArrowBackIcon />}
    >
      {backLabel}
    </StyledFooterBackButton>
  ) : null;

  const link = linkLabel ? (
    <StyledFooterBackButtonLink onClick={linkOnClick} variant="text">
      {linkLabel}
    </StyledFooterBackButtonLink>
  ) : null;

  const nextButton = nextLabel ? (
    <StyledFormSubmitButton accessibilityLabel="Next">
      {nextLabel}
    </StyledFormSubmitButton>
  ) : null;

  const totalFooterButtons =
    Number(Boolean(nextButton)) +
    Number(Boolean(backButton)) +
    Number(Boolean(link));

  const footer = totalFooterButtons ? (
    <StyledFooter>
      {isMobile ? (
        <>
          {nextButton}
          {backButton}
          {link}
        </>
      ) : (
        <>
          {backButton}
          <StyledSkipAndNextButtons>
            {link}
            {nextButton}
          </StyledSkipAndNextButtons>
        </>
      )}
    </StyledFooter>
  ) : null;

  const content = (
    <>
      <StyledFormContent>
        <StyledStepTitle variant="h4">{title}</StyledStepTitle>
        <StyledComputation variant="h6">{paragraph}</StyledComputation>
        <StyledSubTitle variant="body1">{subtitle}</StyledSubTitle>
        <StyledContent>{children}</StyledContent>
        {!footer ? <StyledHR /> : null}
      </StyledFormContent>
      {footer ? footer : null}
    </>
  );

  const paddingClasses = classnames(
    totalFooterButtons === 1 && classes["form-sm-padding"],
    totalFooterButtons === 2 && classes["form-md-padding"],
    totalFooterButtons === 3 && classes["form-lg-padding"]
  );

  return isForm ? (
    <StyledForm>
      <Form
        data-testid="calculator-step-form"
        onSubmit={nextButtonOnClick}
        className={paddingClasses}
      >
        {content}
      </Form>
    </StyledForm>
  ) : (
    <StyledForm className={paddingClasses}>{content}</StyledForm>
  );
};

CalculatorStepper.Step = Step;

export default CalculatorStepper;
