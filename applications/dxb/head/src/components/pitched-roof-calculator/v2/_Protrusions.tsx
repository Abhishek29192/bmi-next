import {
  Button,
  CardInput,
  FormContext,
  Grid,
  InputValue,
  RawTextField
} from "@bmi/components";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { microCopy } from "../../../constants/microCopies";
import { useSiteContext } from "../../Site";
import { AnalyticsContext } from "./../helpers/analytics";
import { getFieldTypes, Type } from "./../helpers/fieldTypes";
import protrusionTypes from "./calculation/protrusions";
import FieldContainer from "./subcomponents/_FieldContainer";
import inputStyles from "./subcomponents/_InputTextField.module.scss";
import styles from "./_Protrusions.module.scss";

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

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSelected(newValue);
    updateField(newValue, undefined);
  };

  useEffect(() => {
    updateField(selected, !selected ? "This field is required" : undefined);
  }, []);

  return (
    <FieldContainer className={styles["protrusionsList"]}>
      <Grid container justifyContent="center">
        {Object.entries(protrusionTypes).map(([type, { illustration }]) => (
          <Grid key={type} item xs={6} lg={2}>
            <CardInput
              name={`select-protrusion-${id}`}
              value={type}
              illustratedImage={illustration}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
  const { getMicroCopy } = useSiteContext();
  // eslint-disable-next-line security/detect-object-injection
  const { helperText, unit, validator } = getFieldTypes((path, placeholders) =>
    getMicroCopy(`validation.errors.${path}`, placeholders)
  )[type];

  const [error, setError] = useState(() => validator(defaultValue));
  const [isBlurred, setIsBlurred] = useState(false);

  const handleOnBlur = () => setIsBlurred(true);

  const handleOnChange = (newValue: string) => {
    const newError = validator(newValue);
    setError(newError);
    updateField(newValue, newError);
  };

  const showError = isBlurred || shouldShowErrors ? !!error : false;

  useEffect(() => {
    updateField(defaultValue, error);
  }, []);

  return (
    <RawTextField
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
  onAddAnother?: () => void;
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
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useContext(AnalyticsContext);

  const { fields, dimensionsIllustration: DimensionsIllustration } =
    // eslint-disable-next-line security/detect-object-injection
    protrusionTypes[protrusionType];

  return (
    <FieldContainer
      title={getMicroCopy(microCopy.ROOF_DIMENSIONS_PROTRUSIONS_PROMPT)}
    >
      <Grid container className={styles["dimensions"]}>
        <Grid item xs={12} lg={4}>
          <DimensionsIllustration />
        </Grid>
        <Grid item md={1} className={styles["showOnLarge"]}></Grid>
        <Grid item xs={12} lg={4}>
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
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {onAddAnother ? (
          <Button
            variant="text"
            onClick={() => {
              pushEvent({
                event: "dxb.button_click",
                id: "rc-dimensions-protrusions",
                label: getMicroCopy(
                  microCopy.ROOF_DIMENSIONS_PROTRUSIONS_ADD_ANOTHER
                ),
                action: "selected"
              });
              onAddAnother();
            }}
          >
            {getMicroCopy(microCopy.ROOF_DIMENSIONS_PROTRUSIONS_ADD_ANOTHER)}
          </Button>
        ) : null}
        <Button
          variant="text"
          onClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-dimensions-protrusions",
              label: getMicroCopy(microCopy.ROOF_DIMENSIONS_PROTRUSIONS_REMOVE),
              action: "removed"
            });
            onRemove();
          }}
        >
          {getMicroCopy(microCopy.ROOF_DIMENSIONS_PROTRUSIONS_REMOVE)}
        </Button>
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
  onAddAnother?: () => void;
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
  const { getMicroCopy } = useSiteContext();
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
    <div className={styles["protrusion"]}>
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
              label: getMicroCopy(microCopy.ROOF_DIMENSIONS_PROTRUSIONS_REMOVE),
              action: "removed"
            });
            onRemove();
          }}
        >
          {getMicroCopy(microCopy.ROOF_DIMENSIONS_PROTRUSIONS_REMOVE)}
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
  const pushEvent = useContext(AnalyticsContext);

  const [protrusions, setProtrusions] = useState(
    defaultValue.map((values) => ({
      id: getNextId(),
      values: { ...values },
      errors: {}
    }))
  );
  const { updateFormState } = useContext(FormContext);
  const { getMicroCopy } = useSiteContext();

  const addProtrusion = () =>
    setProtrusions((protrusions) => [
      ...protrusions,
      { id: getNextId(), values: {}, errors: {} }
    ]);

  const updateProtrusion = (
    id: string,
    getChange: (item: ProtrusionItem) => Partial<ProtrusionItem>
  ) =>
    setProtrusions((protrusions) =>
      protrusions.map((p) => (p.id === id ? { ...p, ...getChange(p) } : p))
    );

  const removeProtrusion = (id: string) =>
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
    const list: ProtrusionItem["values"][] = [];

    for (const { values, errors } of protrusions) {
      list.push(values);
      if (!error && Object.values(errors).some(Boolean)) {
        error = true;
      }
    }

    // InputValue needs to be forced to not pollute this hack out of here
    updateFormState(
      { protrusions: list as InputValue },
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
        title={getMicroCopy(microCopy.ROOF_DIMENSIONS_PROTRUSIONS_TITLE)}
      >
        <Button
          variant="outlined"
          disabled={!!protrusions.length}
          accessibilityLabel={"Add protrusions"}
          onClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-dimensions-protrusions",
              label: getMicroCopy(microCopy.ROOF_DIMENSIONS_PROTRUSIONS_ADD),
              action: "selected"
            });
            addProtrusion();
          }}
        >
          {getMicroCopy(microCopy.ROOF_DIMENSIONS_PROTRUSIONS_ADD)}
        </Button>
      </FieldContainer>
      {protrusionsElements}
    </div>
  );
};

export default Protrusions;
