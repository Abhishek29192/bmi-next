import { Icon, withFormControl } from "@bmi-digital/components";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import classnames from "classnames";
import React, { useState } from "react";
import RawTextField from "../raw-text-field/RawTextField";
import {
  StyledComponentWithButtons,
  StyledDownButton,
  StyledUpButton
} from "./styles";

type Props = {
  name: string;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  defaultValue?: number;
  buttonPlacement?: "sides" | "right";
  lockBreakpoint?: "xs" | "sm" | "md" | "lg" | false;
};

const getValidValue = (value: number, min: number, max: number) => {
  return Math.min(Math.max(min, value), max);
};

const UpDownSimpleNumericInput = ({
  name,
  onChange,
  step = 1,
  defaultValue = 0,
  min = -Infinity,
  max = Infinity,
  buttonPlacement = "sides",
  lockBreakpoint = "xs"
}: Props) => {
  const [count, setCount] = useState(() =>
    getValidValue(defaultValue, min, max)
  );

  const handleChange = (value: number) => {
    const validatedValue = getValidValue(value, min, max);
    if (validatedValue !== count) {
      setCount(validatedValue);
      onChange(validatedValue);
    }
  };

  const handleIncrement = () => handleChange(count + step);
  const handleDecrement = () => handleChange(count - step);

  const handleInputChange = (value: string) => {
    const newValue = parseFloat(value);
    if (!isNaN(newValue)) handleChange(newValue);
  };

  const UpButton = (
    <StyledUpButton
      isIconButton
      className="button"
      onClick={handleIncrement}
      accessibilityLabel={"Up"}
    >
      <Icon source={AddIcon} />
    </StyledUpButton>
  );

  const DownButton = (
    <StyledDownButton
      isIconButton
      className={`button-${buttonPlacement}`}
      onClick={handleDecrement}
      accessibilityLabel={"Down"}
    >
      <Icon source={RemoveIcon} />
    </StyledDownButton>
  );

  const InputComponent = (
    <RawTextField
      name={name}
      variant="hybrid"
      className={classnames(
        "input",
        buttonPlacement === "sides" && "in-middle"
      )}
      value={count.toString()}
      onChange={handleInputChange}
    />
  );

  const ComponentWithButtonsOnEitherSide = (
    <StyledComponentWithButtons>
      {DownButton}
      {InputComponent}
      {UpButton}
    </StyledComponentWithButtons>
  );

  const ComponentWithButtonsOnTheRight = (
    <StyledComponentWithButtons
      className={classnames(lockBreakpoint && `locked-${lockBreakpoint}`)}
    >
      {InputComponent}
      {DownButton}
      {UpButton}
    </StyledComponentWithButtons>
  );

  const CounterComponent =
    buttonPlacement == "right"
      ? ComponentWithButtonsOnTheRight
      : ComponentWithButtonsOnEitherSide;
  return CounterComponent;
};

export default withFormControl<Props, number>(UpDownSimpleNumericInput);
