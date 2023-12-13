import ArrowBackIcon from "@bmi-digital/components/icon/ArrowBack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import classnames from "classnames";
import React, { FormEvent } from "react";
import ProgressIndicator from "../../../ProgressIndicator";
import {
  classes,
  FooterButton,
  Root,
  StepWrapper,
  StyledComputation,
  StyledContent,
  StyledFooter,
  StyledFooterBackButtonLink,
  StyledForm,
  StyledFormContent,
  StyledFormSubmitButton,
  StyledHR,
  StyledSkipAndNextButtons,
  StyledSpinnerContainer,
  StyledStepTitle,
  StyledSubTitle
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
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const backButton = backLabel ? (
    <FooterButton
      variant="outlined"
      onClick={backButtonOnClick}
      accessibilityLabel="Back"
      startIcon={<ArrowBackIcon />}
    >
      {backLabel}
    </FooterButton>
  ) : null;

  const link = linkLabel ? (
    <StyledFooterBackButtonLink onClick={linkOnClick} variant="text">
      {linkLabel}
    </StyledFooterBackButtonLink>
  ) : null;

  const nextButton = nextLabel ? (
    <StyledFormSubmitButton accessibilityLabel="Next" component={FooterButton}>
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
      <StyledFormContent className={classes["formContent"]}>
        <StyledStepTitle variant="h4">{title}</StyledStepTitle>
        {paragraph && (
          <StyledComputation variant="h6">{paragraph}</StyledComputation>
        )}
        {subtitle && (
          <StyledSubTitle variant="body1" className={classes["subtitle"]}>
            {subtitle}
          </StyledSubTitle>
        )}
        <StyledContent className={classes["content"]}>{children}</StyledContent>
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
    <StepWrapper>
      <StyledForm
        data-testid="calculator-step-form"
        onSubmit={nextButtonOnClick}
        className={paddingClasses}
      >
        {content}
      </StyledForm>
    </StepWrapper>
  ) : (
    <StepWrapper>
      <div className={paddingClasses}>{content}</div>
    </StepWrapper>
  );
};

CalculatorStepper.Step = Step;

export default CalculatorStepper;
