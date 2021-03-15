import React, { useMemo, useState } from "react";
import CardInput, { Props as CardInputProps } from "@bmi/card-input";
import { withFormControl } from "@bmi/form";
import classnames from "classnames";
import Grid from "@bmi/grid";
import styles from "./CardRadioGroup.module.scss";

export type Props = {
  name: string;
  className?: string;
  children: React.ReactNode;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

const isRadioItemElement = (
  element: React.ReactNode
): element is React.ReactElement<CardInputProps, typeof CardInput> =>
  React.isValidElement(element) && element.type === CardInput;

const CardRadioGroup = ({
  name,
  className,
  defaultValue,
  onChange,
  children
}: Props) => {
  const [selected, setSelected] = useState(defaultValue);
  const items = useMemo(
    () =>
      React.Children.map(children, (child) => {
        let result = child;

        if (isRadioItemElement(child)) {
          const { value, className } = child.props;

          const handleOnChange = () => {
            setSelected(value);

            if (onChange) {
              onChange(value);
            }
          };

          result = React.cloneElement(child, {
            name,
            checked: value === selected,
            onChange: handleOnChange,
            className: classnames(styles["item"], className)
          });
        }

        return (
          <Grid item xs={6} md={4} lg={2}>
            {result}
          </Grid>
        );
      }),
    [children, name, selected, onChange]
  );

  return (
    <div className={classnames(styles["CardRadioGroup"], className)}>
      <Grid container spacing={2}>
        {items}
      </Grid>
    </div>
  );
};

const CardRadioGroupFormControl = Object.defineProperty(
  withFormControl<Props>(CardRadioGroup),
  "Item",
  {
    value: CardInput,
    writable: false
  }
);

export default CardRadioGroupFormControl;
