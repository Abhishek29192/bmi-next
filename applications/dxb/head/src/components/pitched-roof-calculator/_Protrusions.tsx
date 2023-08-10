import {
  Button,
  CardInput,
  FormContext,
  Grid,
  InputValue,
  RawTextField
} from "@bmi-digital/components";
import React, { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { microCopy } from "@bmi/microcopies";
import { useSiteContext } from "../Site";
import protrusionTypes from "./calculation/protrusions";
import { AnalyticsContext } from "./helpers/analytics";
import { getFieldTypes, Type } from "./helpers/fieldTypes";
import {
  AddAnotherButton,
  DimensionsContainer,
  Root,
  StyledTitle,
  StyledFieldContainer,
  ProtrusionWrapper,
  classes
} from "./_Protrusions.styles";

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

  const handleOnChange = (newValue: string) => {
    setSelected(newValue);
    updateField(newValue, undefined);
  };

  return (
    <StyledFieldContainer>
      <Grid container justifyContent="center">
        {Object.entries(protrusionTypes).map(([type, { illustration }]) => (
          <Grid key={type} xs={6} lg={2}>
            <CardInput
              name={`select-protrusion-${id}`}
              value={type}
              illustratedImage={illustration}
              onChange={() => {
                pushEvent({
                  event: "dxb.button_click",
                  id: "rc-dimensions-protrusions-type",
                  label: type,
                  action: "selected"
                });
                handleOnChange(type);
              }}
              checked={selected === type}
            />
          </Grid>
        ))}
      </Grid>
    </StyledFieldContainer>
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
      InputProps={{
        className: classes.textField
      }}
      inputProps={{
        className: classes.numericInput,
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

  const isAddAnotherBtnDisabled = fields.some((field) => !values[field.name]);

  return (
    <DimensionsContainer>
      <DimensionsIllustration className={classes.dimensionsIllustration} />
      <Grid container justifyContent="center" mb={{ xs: "12px", sm: "36px" }}>
        {fields.map(({ name, type }: { name: string; type: Type }) => (
          <Grid key={`protrusion-${id}-${name}`} xs={12} lg={3}>
            <Input
              key={`${protrusionType}-${name}`}
              label={name}
              type={type}
              defaultValue={values[name as string]}
              updateField={createUpdateField(name)}
            />
          </Grid>
        ))}
      </Grid>
      <Grid xs={12}>
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
        {onAddAnother ? (
          <AddAnotherButton
            variant="outlined"
            disabled={isAddAnotherBtnDisabled}
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
          </AddAnotherButton>
        ) : null}
      </Grid>
    </DimensionsContainer>
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
  showRemoveButton: boolean;
};

const Protrusion = ({
  id,
  onAddAnother,
  onUpdate,
  onRemove,
  values,
  showRemoveButton
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
    <ProtrusionWrapper>
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
      ) : null}
      {showRemoveButton ? (
        <Box mt={{ sm: 2 }}>
          <Button
            variant="text"
            onClick={() => {
              pushEvent({
                event: "dxb.button_click",
                id: "rc-dimensions-protrusions",
                label: getMicroCopy(
                  microCopy.ROOF_DIMENSIONS_PROTRUSIONS_REMOVE
                ),
                action: "removed"
              });
              onRemove();
            }}
          >
            {getMicroCopy(microCopy.ROOF_DIMENSIONS_PROTRUSIONS_REMOVE)}
          </Button>
        </Box>
      ) : null}
    </ProtrusionWrapper>
  );
};

let globalIndex = 0;
const getNextId = () => globalIndex++ + "";

const Protrusions = ({
  defaultValue
}: {
  defaultValue?: ReadonlyArray<ProtrusionItem["values"]>;
}) => {
  const defaultProtrusions = defaultValue
    ? defaultValue.map((values) => ({
        id: getNextId(),
        values: { ...values },
        errors: {}
      }))
    : [{ id: getNextId(), values: {}, errors: {} }];

  const [protrusions, setProtrusions] = useState(defaultProtrusions);
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

  const removeProtrusion = (id: string) => {
    if (protrusions.length === 1) {
      setProtrusions([{ id: getNextId(), values: {}, errors: {} }]);
      return;
    }

    setProtrusions((protrusions) => protrusions.filter((p) => p.id !== id));
  };

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
    <Root>
      <StyledTitle variant="h6">
        {getMicroCopy(microCopy.ROOF_DIMENSIONS_PROTRUSIONS_TITLE)}
      </StyledTitle>
      {protrusions.map(({ id, values }, i) => (
        <Protrusion
          key={id}
          id={id}
          onAddAnother={
            i + 1 === protrusions.length && i < 8 ? addProtrusion : undefined
          }
          onUpdate={(change) => updateProtrusion(id, change)}
          onRemove={() => removeProtrusion(id)}
          values={values}
          showRemoveButton={!values.type && protrusions.length > 1}
        />
      ))}
    </Root>
  );
};

export default Protrusions;
