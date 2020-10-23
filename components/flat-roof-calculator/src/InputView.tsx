import React from "react";
import Typography from "@bmi/typography";
import Form, { FormProps } from "@bmi/form";
import MeasurementsSection from "./MeasurementsSection";
import Section from "./Section";
import Divider from "@material-ui/core/Divider";
import Button from "@bmi/button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import styles from "./FlatRoofCalculator.module.scss";
import { ProjectInformationSection } from "./ProjectInformationSection";
import { FormValues } from "./types/FormValues";
import { TreeType } from "./types/TreeType";
import { FieldsDisplay } from "./types/FieldsDisplay";
import FormSection from "./FormSection";
import Tree from "./Tree";

const DecisionTreeSection = ({
  header,
  description,
  treeProps
}: {
  header: string;
  description: string;
  treeProps: {
    tree: TreeType;
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
  typeTree: TreeType;
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
    <Section>
      <Typography variant="h1" hasUnderline className={styles["header"]}>
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
      <Section>
        <Typography variant="h5" className={styles["helpHeader"]}>
          {inputContent.helpHeader}
        </Typography>
        <Typography variant="body1">{inputContent.helpDescription}</Typography>
      </Section>
      <Divider className={styles["divider"]} />
      <div className={styles["spaceBetween"]}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate("/" + window.location.search)}
          className={styles["item"]}
        >
          {backButtonLabel}
        </Button>
        <Form.SubmitButton
          endIcon={<ArrowForwardIcon />}
          className={styles["item"]}
        >
          {calculateButtonLabel}
        </Form.SubmitButton>
      </div>
    </Form>
  </>
);

export default InputView;
