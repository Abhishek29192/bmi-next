import React, { useEffect, useContext } from "react";
import { useTranslation } from "next-i18next";
import { Technology } from "@bmi/intouch-api-types";
import { FormContext } from "@bmi/form";
import Grid from "@bmi/grid";
import RadioGroup from "@bmi/radio-group";
import Typography from "@bmi/typography";
import Icon, { FlatRoof, PitchedRoof } from "@bmi/icon";
import { Props as TextFieldProps } from "@bmi/text-field";
import { getFieldValueLabel } from "./Form";
// TODO: move/split styles?
import styles from "./CreateProject/styles.module.scss";

const FlatIconWrapper: React.FunctionComponent<React.SVGProps<SVGSVGElement>> =
  (props) => <FlatRoof viewBox="0 7 48 48" {...props} />;

// TODO: Use this once "OTHER" is removed from it
const technologyIcons: Record<
  Exclude<Technology, "OTHER">,
  React.SFC<React.SVGProps<SVGSVGElement>>
> = {
  FLAT: FlatIconWrapper,
  PITCHED: PitchedRoof
};

type TechnologyInputProps = Pick<
  TextFieldProps,
  | "className"
  | "name"
  | "label"
  | "fullWidth"
  // | "fieldIsRequiredError" // TODO: I don't get why it doesn't like these
  // | "defaultValue"
  | "disabled"
> & {
  defaultValue?: any;
};

// This is to manage the Radio group not updating form state when items are not direct children
const TechnologyInput = ({ defaultValue, disabled }: TechnologyInputProps) => {
  const { t } = useTranslation("project-page");
  const { updateFormState, values } = useContext(FormContext);

  useEffect(() => {
    updateFormState(
      {
        technology: defaultValue
      },
      {}
    );
  }, []);

  const handleTechnologyChange = (event) => {
    updateFormState(
      {
        technology: event.target.value
      },
      // No errors
      {}
    );
  };

  return (
    <RadioGroup name="technology" isRequired value={values["technology"]}>
      <Grid container className={styles.technologyGrid}>
        {["PITCHED", "FLAT"].map((value) => (
          <Grid item md={6} key={value}>
            <RadioGroup.Item
              name="technology"
              value={value}
              onChange={handleTechnologyChange}
              checked={values["technology"] === value}
              disabled={disabled}
            >
              <Icon
                source={technologyIcons[value]}
                className={styles.technologyIcon}
              />
              {getFieldValueLabel(t, "technology", value)}
            </RadioGroup.Item>
            <Typography
              variant="caption"
              component="div"
              className={styles.technologyCaption}
            >
              {t(
                `project-page:addProject.dialog.form.hints.technology.${value}`
              )}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </RadioGroup>
  );
};

export default TechnologyInput;
