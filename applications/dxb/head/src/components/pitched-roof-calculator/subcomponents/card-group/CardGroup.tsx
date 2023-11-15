import CheckBoxGroup, {
  CardCheckboxGroupProps
} from "@bmi-digital/components/card-checkbox-group";
import RadioGroup, {
  CardRadioGroupProps
} from "@bmi-digital/components/card-radio-group";
import { WithFormControlProps } from "@bmi-digital/components/form";
import classnames from "classnames";
import React from "react";
import {
  classes,
  StyledCardCheckboxGroup,
  StyledCardRadioGroup
} from "./CardGroup.styles";

type RadioGroupProps = CardRadioGroupProps & WithFormControlProps<string>;
type CheckboxGroupProps = CardCheckboxGroupProps &
  WithFormControlProps<string[]>;

const CardRadioGroup = (props: RadioGroupProps) => {
  return (
    <StyledCardRadioGroup
      {...props}
      gridContainerClassName={classes.gridContainer}
    />
  );
};

CardRadioGroup.Item = RadioGroup.Item;

const CardCheckboxGroup = ({
  className,
  gridContainerClassName,
  ...rest
}: CheckboxGroupProps) => {
  return (
    <StyledCardCheckboxGroup
      {...rest}
      className={className}
      gridContainerClassName={classnames(
        classes.gridContainer,
        gridContainerClassName
      )}
    />
  );
};

CardCheckboxGroup.Item = CheckBoxGroup.Item;

export { CardCheckboxGroup, CardRadioGroup };
