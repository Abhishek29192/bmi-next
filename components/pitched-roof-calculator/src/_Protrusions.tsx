import React, { useContext, useEffect, useMemo, useState } from "react";
import Grid from "@bmi/grid";
import Button from "@bmi/button";
import { TextField } from "@bmi/text-field";
import { FormContext } from "@bmi/form";
import CardInput from "@bmi/card-input";
import { getMicroCopy, MicroCopyContext } from "./helpers/microCopy";
import FieldContainer from "./subcomponents/_FieldContainer";
import { getFieldTypes, Type } from "./helpers/fieldTypes";
import styles from "./_Protrusions.module.scss";
import inputStyles from "./subcomponents/_InputTextField.module.scss";
import protrusionTypes from "./calculation/protrusions";
import { AnalyticsContext } from "./helpers/analytics";

type SelectProtrusionProps = {
  id: string;
  updateField: (value: string | undefined, error: string | undefined) => void;
  defaultValue?: string;
};

const SelectProtrusion = ({
  id,
  updateField,
  defaultValue
}: SelectProtrusionProps) => {
  const pushEvent = useContext(AnalyticsContext);

  const [selected, setSelected] = useState(defaultValue);

  const handleOnChange = (e) => {
    const newValue = e.target.value;
    setSelected(newValue);
    updateField(newValue, undefined);
  };

  useEffect(() => {
    updateField(selected, !selected ? "This field is required" : undefined);
  }, []);

  return (
    <FieldContainer>
      <Grid container>
        {Object.entries(protrusionTypes).map(([type, { illustration }]) => (
          <Grid key={type} item xs={6} lg={2}>
            <CardInput
              name={`select-protrusion-${id}`}
              value={type}
              illustratedImage={illustration}
              onChange={(e) => {
                pushEvent({
                  event: "dxb.button_click",
                  id: "rc-dimensions-protrusions-type",
                  label: type,
                  action: "selected"
                });
                handleOnChange(e);
              }}
              checked={selected === type}
            />
          </Grid>
        ))}
      </Grid>
    </FieldContainer>
  );
};

type InputProps = {
  type: Type;
  shouldShowErrors?: boolean;
  updateField: (value: string | undefined, error: string | undefined) => void;
  defaultValue?: string;
  label?: string;
};

const Input = ({
  type,
  shouldShowErrors,
  updateField,
  defaultValue = "",
  ...rest
}: InputProps) => {
  const copy = useContext(MicroCopyContext);
  // eslint-disable-next-line security/detect-object-injection
  const { helperText, unit, validator } = getFieldTypes((path, placeholders) =>
    getMicroCopy(copy, "validation.errors." + path, placeholders)
  )[type];

  const [error, setError] = useState(() => validator(defaultValue));
  const [isBlurred, setIsBlurred] = useState(false);

  const handleOnBlur = () => setIsBlurred(true);

  const handleOnChange = (newValue) => {
    const newError = validator(newValue);
    setError(newError);
    updateField(newValue, newError);
  };

  const showError = isBlurred || shouldShowErrors ? !!error : false;

  useEffect(() => {
    updateField(defaultValue, error);
  }, []);

  return (
    <TextField
      type="number"
      variant="outlined"
      helperText={helperText}
      rightAdornment={unit}
      fullWidth
      className={inputStyles["InputTextField"]}
      InputProps={{
        className: inputStyles["textField"]
      }}
      inputProps={{
        className: inputStyles["numberInput"],
        step: "any"
      }}
      errorText={error}
      error={showError}
      onBlur={handleOnBlur}
      onChange={handleOnChange}
      defaultValue={defaultValue}
      {...rest}
    />
  );
};

type ProtrusionDimensionsProps = {
  id: string;
  onAddAnother: () => void;
  createUpdateField: (name: string) => (value?: string, error?: string) => any;
  onRemove: () => void;
  type: Type;
  values: Record<string, any>;
};

const ProtrusionDimensions = ({
  id,
  onAddAnother,
  createUpdateField,
  onRemove,
  type: protrusionType,
  values
}: ProtrusionDimensionsProps) => {
  const copy = useContext(MicroCopyContext);
  const pushEvent = useContext(AnalyticsContext);

  const { fields, dimensionsIllustration: DimensionsIllustration } =
    // eslint-disable-next-line security/detect-object-injection
    protrusionTypes[protrusionType];

  return (
    <FieldContainer
      title={getMicroCopy(copy, "roofDimensions.protrusions.prompt")}
    >
      <Grid container className={styles["dimensions"]}>
        <Grid item xs={12} lg={3}>
          <DimensionsIllustration />
        </Grid>
        <Grid item md={1} className={styles["showOnLarge"]}></Grid>
        <Grid item xs={12} lg={3}>
          <Grid container>
            {fields.map(({ name, type }: { name: string; type: Type }) => (
              <Grid key={`protrusion-${id}-${name}`} item xs={12}>
                <Input
                  key={`${protrusionType}-${name}`} // make sure to reset the state everytime the protrusionType changes
                  label={name}
                  type={type}
                  // eslint-disable-next-line security/detect-object-injection
                  defaultValue={values[name]}
                  updateField={createUpdateField(name)}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              {onAddAnother ? (
                <Button
                  variant="text"
                  onClick={() => {
                    pushEvent({
                      event: "dxb.button_click",
                      id: "rc-dimensions-protrusions",
                      label: getMicroCopy(
                        copy,
                        "roofDimensions.protrusions.addAnother"
                      ),
                      action: "selected"
                    });
                    onAddAnother();
                  }}
                >
                  {getMicroCopy(copy, "roofDimensions.protrusions.addAnother")}
                </Button>
              ) : null}
              <Button
                variant="text"
                onClick={() => {
                  pushEvent({
                    event: "dxb.button_click",
                    id: "rc-dimensions-protrusions",
                    label: getMicroCopy(
                      copy,
                      "roofDimensions.protrusions.remove"
                    ),
                    action: "removed"
                  });
                  onRemove();
                }}
              >
                {getMicroCopy(copy, "roofDimensions.protrusions.remove")}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </FieldContainer>
  );
};

type ProtrusionItem = {
  id: string;
  values: Record<string, any>;
  errors: Record<string, any>;
};

type ProtrusionProps = {
  id: string;
  onAddAnother: () => void;
  onUpdate: (
    getChange: (item: ProtrusionItem) => Partial<ProtrusionItem>
  ) => void;
  onRemove: () => void;
  values: Record<string, any>;
};

const Protrusion = ({
  id,
  onAddAnother,
  onUpdate,
  onRemove,
  values
}: ProtrusionProps) => {
  const copy = useContext(MicroCopyContext);
  const pushEvent = useContext(AnalyticsContext);

  const updateSelection = (value?: string, error?: string) =>
    onUpdate(() => ({
      values: { type: value }, // Note that we are resetting other fields
      errors: { type: error }
    }));

  const createUpdateField =
    (name: string) => (value?: string, error?: string) =>
      onUpdate(({ values, errors }) => ({
        values: { ...values, [name]: value },
        errors: { ...errors, [name]: error }
      }));

  const { type } = values;

  return (
    <div>
      <SelectProtrusion
        id={id}
        defaultValue={type}
        updateField={updateSelection}
      />
      {type ? (
        <ProtrusionDimensions
          {...{
            id,
            onAddAnother,
            createUpdateField,
            onRemove,
            values,
            type
          }}
        />
      ) : (
        <Button
          variant="text"
          onClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-dimensions-protrusions",
              label: getMicroCopy(copy, "roofDimensions.protrusions.remove"),
              action: "removed"
            });
            onRemove();
          }}
        >
          {getMicroCopy(copy, "roofDimensions.protrusions.remove")}
        </Button>
      )}
    </div>
  );
};

let globalIndex = 0;
const getNextId = () => globalIndex++ + "";

const Protrusions = ({
  defaultValue = []
}: {
  defaultValue?: ReadonlyArray<ProtrusionItem["values"]>;
}) => {
  const copy = useContext(MicroCopyContext);
  const pushEvent = useContext(AnalyticsContext);

  const [protrusions, setProtrusions] = useState(
    defaultValue.map((values) => ({
      id: getNextId(),
      values: { ...values },
      errors: {}
    }))
  );
  const { updateFormState } = useContext(FormContext);

  const addProtrusion = () =>
    setProtrusions((protrusions) => [
      ...protrusions,
      { id: getNextId(), values: {}, errors: {} }
    ]);

  const updateProtrusion = (id, getChange) =>
    setProtrusions((protrusions) =>
      protrusions.map((p) => (p.id === id ? { ...p, ...getChange(p) } : p))
    );

  const removeProtrusion = (id) =>
    setProtrusions((protrusions) => protrusions.filter((p) => p.id !== id));

  const protrusionsElements = useMemo(
    () =>
      protrusions.map(({ id, values }, i) => (
        <Protrusion
          key={id}
          id={id}
          onAddAnother={
            i + 1 === protrusions.length && i < 8 ? addProtrusion : undefined
          }
          onUpdate={(change) => updateProtrusion(id, change)}
          onRemove={() => removeProtrusion(id)}
          values={values}
        />
      )),
    [protrusions]
  );

  useEffect(() => {
    let error = false;
    const list = [];

    for (const { values, errors } of protrusions) {
      list.push(values);
      if (!error && Object.values(errors).some(Boolean)) {
        error = true;
      }
    }

    updateFormState(
      { protrusions: list },
      {
        protrusions: error
          ? "There is an error" /* Random string to make it truthy */
          : undefined
      }
    );
  }, [protrusions]);

  return (
    <div className={styles["Protrusions"]}>
      <FieldContainer
        title={getMicroCopy(copy, "roofDimensions.protrusions.title")}
      >
        <Button
          variant="outlined"
          disabled={!!protrusions.length}
          accessibilityLabel={"Add protrusions"}
          onClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-dimensions-protrusions",
              label: getMicroCopy(copy, "roofDimensions.protrusions.add"),
              action: "selected"
            });
            addProtrusion();
          }}
        >
          {getMicroCopy(copy, "roofDimensions.protrusions.add")}
        </Button>
      </FieldContainer>
      {protrusionsElements}
    </div>
  );
};

export default Protrusions;
