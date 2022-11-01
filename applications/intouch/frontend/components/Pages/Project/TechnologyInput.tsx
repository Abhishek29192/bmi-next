import {
  FlatRoof,
  FormContext,
  Grid,
  Icon,
  PitchedRoof,
  RadioGroup,
  TextFieldProps,
  Typography,
  ValidationResult
} from "@bmi-digital/components";
import { Technology } from "@bmi/intouch-api-types";
import { useTranslation } from "next-i18next";
import React, { useContext, useEffect } from "react";
// TODO: move/split styles?
import styles from "./CreateProject/styles.module.scss";
import { getFieldValueLabel } from "./Form";

const FlatIconWrapper: React.FunctionComponent<
  React.SVGProps<SVGSVGElement>
> = (props) => <FlatRoof viewBox="0 7 48 48" {...props} />;

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
  "className" | "name" | "label" | "fullWidth" | "isRequired" | "disabled"
> & {
  defaultValue?: any;
  fieldIsRequiredError?: string;
};

// This is to manage the Radio group not updating form state when items are not direct children
const TechnologyInput = (props: TechnologyInputProps) => {
  const {
    name = "technology",
    defaultValue,
    disabled,
    isRequired,
    fieldIsRequiredError
  } = props;
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

  // NOTE: partly copied from `withFormControl`
  const getError = (val?: any): ValidationResult => {
    if (isRequired && !val) {
      return fieldIsRequiredError || null;
    }

    return null;
  };

  const handleTechnologyChange = (event) => {
    const { value } = event.target;
    const error = getError(value);

    updateFormState(
      {
        [name]: value
      },
      {
        [name]: error
      }
    );
  };

  return (
    // TODO: types still don't align on `name`.
    <RadioGroup {...props} name={name}>
      <Grid nonce={undefined} container className={styles.technologyGrid}>
        {["PITCHED", "FLAT"].map((value) => (
          <Grid nonce={undefined} item md={6} key={value}>
            <RadioGroup.Item
              name={name}
              value={value}
              onChange={handleTechnologyChange}
              checked={values["technology"] === value}
              disabled={disabled}
            >
              <Icon
                // eslint-disable-next-line security/detect-object-injection
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
