import { Button, Form, FormProps, Typography } from "@bmi-digital/components";
import ArrowBackIcon from "@bmi-digital/components/icon/ArrowBack";
import ArrowForwardIcon from "@bmi-digital/components/icon/ArrowForward";
import Divider from "@mui/material/Divider";
import React from "react";
import { Tree as CalculatorDataTree } from "./types/CalculatorData";
import { FieldsDisplay } from "./types/FieldsDisplay";
import { FormValues } from "./types/FormValues";
import FormSection from "./_FormSection";
import MeasurementsSection from "./_MeasurementsSection";
import { ProjectInformationSection } from "./_ProjectInformationSection";
import Section from "./_Section";
import Tree from "./_Tree";

const DecisionTreeSection = ({
  header,
  description,
  treeProps
}: {
  header: string;
  description: string;
  treeProps: {
    tree: CalculatorDataTree;
    fieldsDisplay: FieldsDisplay;
    defaultValues: FormValues;
  };
}) => (
  <FormSection {...{ header, description }}>
    <Tree {...treeProps} />
  </FormSection>
);

type Props = {
  inputContent: {
    header: string;
    helpHeader: string;
    helpDescription: React.ReactNode;
  };
  productDescription: string;
  handleSubmit: FormProps["onSubmit"];
  decisionTreeProps: {
    header: string;
    description: string;
  };
  defaultValues: FormValues;
  typeTree: CalculatorDataTree;
  treeFieldsDisplay: FieldsDisplay;
  measurementsProps: {
    header: string;
    help: {
      fieldArea: React.ReactNode;
      upstand: React.ReactNode;
      kerb: React.ReactNode;
      details: React.ReactNode;
      // TODO: add other fields
    };
  };
  projectInformationProps: {
    header: string;
  };
  navigate: (to: string) => void;
  backButtonLabel: string;
  calculateButtonLabel: string;
};

const InputView = ({
  inputContent,
  productDescription,
  handleSubmit,
  decisionTreeProps,
  defaultValues,
  typeTree,
  treeFieldsDisplay,
  measurementsProps,
  projectInformationProps,
  navigate,
  backButtonLabel,
  calculateButtonLabel
}: Props) => (
  <>
    <Section data-testid="flat-roof-calculator-input-view-section">
      <Typography variant="h1" hasUnderline className="header">
        {inputContent.header}
      </Typography>
      <Typography>{productDescription}</Typography>
    </Section>
    <Form onSubmit={handleSubmit}>
      <DecisionTreeSection
        {...{ ...decisionTreeProps, defaultValues }}
        treeProps={{
          tree: typeTree,
          fieldsDisplay: treeFieldsDisplay,
          defaultValues
        }}
      />
      <MeasurementsSection {...{ ...measurementsProps, defaultValues }} />
      <ProjectInformationSection
        {...{ ...projectInformationProps, defaultValues }}
      />
      <Section data-testid="flat-roof-calculator-help-descriptio-section">
        <Typography variant="h5" className="helpHeader">
          {inputContent.helpHeader}
        </Typography>
        <Typography variant="body1">{inputContent.helpDescription}</Typography>
      </Section>
      <Divider className="divider" />
      <div className="spaceBetween">
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate("/" + window.location.search)}
          className="item"
        >
          {backButtonLabel}
        </Button>
        <Form.SubmitButton endIcon={<ArrowForwardIcon />} className="item">
          {calculateButtonLabel}
        </Form.SubmitButton>
      </div>
    </Form>
  </>
);

export default InputView;
