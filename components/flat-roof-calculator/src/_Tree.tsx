import React, { useContext, useMemo } from "react";
import RadioGroup from "@bmi/radio-group";
import { FormContext } from "@bmi/form";
import Field from "./_Field";
import { FieldsDisplay } from "./types/FieldsDisplay";

const getEventHandler = (fieldName, mappedOptions) => (value) => {
  const label = (mappedOptions.find((option) => value === option.value) || {})
    .label;
  if (label && typeof window !== "undefined" && window["gtag"]) {
    window["gtag"]("event", "Input", {
      event_category: `${fieldName} selection`,
      event_label: label
    });
  }
};

const Decision = ({
  name,
  options,
  defaultValues,
  fieldsDisplay
}: {
  name: string;
  options: string[];
  defaultValues: { [key: string]: any };
  fieldsDisplay: FieldsDisplay;
}) => {
  // eslint-disable-next-line security/detect-object-injection
  const displayProps = fieldsDisplay[name];

  if (!displayProps) {
    throw new Error(`Couldn't find display props for ${name}`);
  }

  const { label, description, helpContent, options: optionsMap } = displayProps;

  const mappedOptions = useMemo(
    () =>
      options.map((value) => {
        // eslint-disable-next-line security/detect-object-injection
        const mappedOption = optionsMap[value];

        if (!mappedOption) {
          throw new Error(`Couldn't find option mapping for ${name}.${value}`);
        }

        const { label, before } = mappedOption;

        return {
          value,
          label,
          before
        };
      }),
    [options, optionsMap]
  );

  const defaultValue =
    // eslint-disable-next-line security/detect-object-injection
    mappedOptions.length === 1 ? mappedOptions[0].value : defaultValues[name];

  return (
    <Field extraMargin {...{ label, description, helpContent }}>
      <RadioGroup
        key={defaultValue} // Reset the state everytime the defaultValue changes in case we ended up with one option to force-select it
        {...{ name, defaultValue }}
        isRequired
        onChange={getEventHandler(label, mappedOptions)}
      >
        {mappedOptions.map(({ label, before, value }) => (
          <RadioGroup.Item key={value} before={before} value={value}>
            {label}
          </RadioGroup.Item>
        ))}
      </RadioGroup>
    </Field>
  );
};

const populateFieldOptions = (
  values,
  tree,
  fields = new Map<string, string[]>()
) => {
  let currentLevel = [tree];
  let nextLevel: Array<{ option: string; target: object }> = [];

  let current;
  while ((current = currentLevel.pop())) {
    let options = fields.get(current.field);

    if (!options) {
      options = [];
      fields.set(current.field, options);
    }

    for (const { option, target } of current.paths as Array<{
      option: string;
      target: string | object;
    }>) {
      options.push(option);
      // Ignore leafs as we are focusing on visible options
      if (typeof target !== "string") {
        nextLevel.push({ option, target });
      }
    }

    if (currentLevel.length === 0) {
      // Register the options
      options = [...new Set([...options])]; // Ensure there are no duplicates
      fields.set(current.field, options);

      // We have all the options for this field from the branches that we can reach,
      // therefore, we can decide whether the value we have is valid or not.
      const selectedValue = values[current.field];
      if (typeof selectedValue !== "undefined") {
        const selectedFromNextLevel = nextLevel.filter(
          ({ option }) => option === selectedValue
        );
        if (selectedFromNextLevel.length) {
          // The selection is valid, therefore, we need to only explore the children of selected paths.
          nextLevel = selectedFromNextLevel;
        }
      }

      // Switch to next level
      currentLevel = nextLevel.map(({ target }) => target);
      nextLevel = [];
    }
  }

  return fields;
};

const Tree = ({
  tree,
  fieldsDisplay,
  defaultValues
}: {
  tree: object;
  fieldsDisplay: FieldsDisplay;
  defaultValues: { [key: string]: any };
}) => {
  const { values } = useContext(FormContext);

  const fields = useMemo(() => {
    const fields = populateFieldOptions(values, tree);

    return [...fields.entries()];
  }, [tree, values]);

  return (
    <div>
      {fields.map(([name, options]) => (
        <Decision
          key={name}
          {...{ name, options, fieldsDisplay, defaultValues }}
        />
      ))}
    </div>
  );
};

export default Tree;
