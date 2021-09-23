import React, { useEffect, useContext } from "react";
import { useTranslation } from "next-i18next";
import { Technology } from "@bmi/intouch-api-types";
import { FormContext } from "@bmi/form";
import Grid from "@bmi/grid";
import RadioGroup from "@bmi/radio-group";
import Typography from "@bmi/typography";
import Icon, { FlatRoof, PitchedRoof } from "@bmi/icon";
import { getFieldValueLabel } from "./Form";
// TODO: move/split styles?
import styles from "./CreateProject/styles.module.scss";

const technologyIcons = {
  FLAT: FlatRoof,
  PITCHED: PitchedRoof
};

type TechnologyInputProps = {
  defaultValue?: Technology;
};

// This is to manage the Radio group not updating form state when items are not direct children
const TechnologyInput = ({ defaultValue }: TechnologyInputProps) => {
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
            >
              <Icon
                source={technologyIcons[value]}
                className={styles.technologyIcon}
              />
              {getFieldValueLabel(t, "technology", value)}
            </RadioGroup.Item>
            <Typography variant="caption" component="div">
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
