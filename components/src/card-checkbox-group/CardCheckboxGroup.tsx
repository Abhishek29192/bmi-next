import classnames from "classnames";
import React, { useMemo, useState } from "react";
import CardInput, { Props as CardInputProps } from "../card-input/CardInput";
import withFormControl from "../form/withFormControl";
import Grid from "../grid/Grid";
import styles from "./CardCheckboxGroup.module.scss";

export type Props = {
  name: string;
  className?: string;
  children: React.ReactNode;
  defaultValue?: string[];
  onChange?: (value: string[] | null) => void;
  noneLabel?: string;
  gridContainerClassName?: string;
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
    // eslint-disable-next-line security/detect-object-injection
    acc[v] = true;
    return acc;
  }, {});

const CardCheckboxGroup = ({
  name,
  className,
  defaultValue,
  onChange,
  children,
  noneLabel,
  gridContainerClassName
}: Props) => {
  const [selected, setSelected] = useState<Record<string, boolean>>(() =>
    defaultValue ? toBooleanObject(defaultValue) : {}
  );

  const options = useMemo(
    () =>
      Array.from<string>(
        React.Children.toArray(children).reduce((acc: Set<string>, child) => {
          if (isRadioItemElement(child)) {
            const { value } = child.props;
            acc.add(value);
          }

          return acc;
        }, new Set<string>()) as Set<string>
      ),
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
              // eslint-disable-next-line security/detect-object-injection
              value === option ? !selected[option] : selected[option]
            );
            const newValue = newSelected.length ? newSelected : null;

            setSelected(newValue ? toBooleanObject(newValue) : {});
            onChange && onChange(newValue);
          };

          result = React.cloneElement(child, {
            name,
            // eslint-disable-next-line security/detect-object-injection
            checked: Boolean(selected[value]),
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
    <div className={classnames(styles["CardCheckboxGroup"], className)}>
      <Grid container spacing={2} className={gridContainerClassName}>
        {items}
        {noneLabel ? (
          <Grid item xs={6} md={4} lg={2}>
            <CardCheckboxInput
              value="none"
              title={noneLabel}
              checked={Boolean(selected.none)}
              onChange={(e) => {
                setSelected({ none: e.target.checked });

                const newValue = e.target.checked ? ["none"] : null;
                onChange && onChange(newValue);
              }}
            />
          </Grid>
        ) : null}
      </Grid>
    </div>
  );
};

const controlledCardCheckboxGroup = withFormControl<Props, string[]>(
  CardCheckboxGroup
);
const CardCheckboxGroupFormControl = Object.defineProperty(
  controlledCardCheckboxGroup,
  "Item",
  {
    value: CardCheckboxInput,
    writable: false
  }
) as typeof controlledCardCheckboxGroup & { Item: typeof CardCheckboxInput };

export default CardCheckboxGroupFormControl;
