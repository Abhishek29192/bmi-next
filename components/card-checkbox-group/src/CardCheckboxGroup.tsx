import React, { useMemo, useState } from "react";
import CardInput, { Props as CardInputProps } from "@bmi/card-input";
import { withFormControl } from "@bmi/form";
import classnames from "classnames";
import Grid from "@bmi/grid";
import styles from "./CardCheckboxGroup.module.scss";

export type Props = {
  name: string;
  className?: string;
  children: React.ReactNode;
  defaultValue?: string[];
  onChange?: (value: string[] | null) => void;
  noneLabel?: string;
};

const CardCheckboxInput = (props: CardInputProps) => (
  <CardInput type={"checkbox"} {...props} />
);

CardCheckboxInput.Paragraph = CardInput.Paragraph;

const isRadioItemElement = (
  element: React.ReactNode
): element is React.ReactElement<CardInputProps, typeof CardCheckboxInput> =>
  React.isValidElement(element) && element.type === CardCheckboxInput;

const toBooleanObject = (values: string[]): Record<string, boolean> =>
  values.reduce((acc: { [value: string]: boolean }, v: string) => {
    acc[v] = true;
    return acc;
  }, {});

const CardCheckboxGroup = ({
  name,
  className,
  defaultValue,
  onChange,
  children,
  noneLabel
}: Props) => {
  const [selected, setSelected] = useState<Record<string, boolean> | null>(() =>
    defaultValue ? toBooleanObject(defaultValue) : null
  );

  const selectedMap = selected || {}; // Ensure we are always setting an object

  const options = useMemo(
    () => [
      ...(React.Children.toArray(children).reduce((acc: Set<string>, child) => {
        if (isRadioItemElement(child)) {
          const { value } = child.props;
          acc.add(value);
        }

        return acc;
      }, new Set<string>()) as Set<string>)
    ],
    [children]
  );

  const items = useMemo(
    () =>
      React.Children.map(children, (child) => {
        let result = child;

        if (isRadioItemElement(child)) {
          const { value, className } = child.props;

          const handleOnChange = () => {
            const newSelected = options.filter((option) =>
              value === option ? !selectedMap[option] : selectedMap[option]
            );

            const newValue = newSelected.length ? newSelected : null;

            setSelected(newValue ? toBooleanObject(newValue) : null);

            if (onChange) {
              onChange(newValue);
            }
          };

          result = React.cloneElement(child, {
            name,
            checked: selectedMap[value],
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
    [children, name, selectedMap, onChange]
  );

  return (
    <div className={classnames(styles["CardCheckboxGroup"], className)}>
      <Grid container spacing={2}>
        {items}
        {noneLabel ? (
          <Grid item xs={6} md={4} lg={2}>
            <CardCheckboxInput
              value="none"
              title={noneLabel}
              checked={!!selected && !Object.keys(selected).length}
              onClick={() => {
                setSelected({});

                if (onChange) {
                  onChange([]);
                }
              }}
            />
          </Grid>
        ) : null}
      </Grid>
    </div>
  );
};

const CardCheckboxGroupFormControl = Object.defineProperty(
  withFormControl<Props, string[]>(CardCheckboxGroup),
  "Item",
  {
    value: CardCheckboxInput,
    writable: false
  }
);

export default CardCheckboxGroupFormControl;
