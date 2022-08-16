import { CardRadioGroup, FormContext, Grid } from "@bmi/components";
import React, { useContext } from "react";
import { microCopy } from "../../../constants/microCopies";
import { useSiteContext } from "../../Site";
import { AnalyticsContext } from "./../helpers/analytics";
import {
  Guttering as GutteringType,
  GutteringVariant,
  LengthBasedProduct
} from "./../types";
import NumericInput from "./subcomponents/up-down-simple-numeric-input/UpDownSimpleNumericInput";
import FieldContainer from "./subcomponents/_FieldContainer";

type GutteringSelectionProps = {
  // TODO: Type when importing from Contentful
  selected?: string;
  options: ReadonlyArray<GutteringType>;
};

const GutteringSelection = ({ selected, options }: GutteringSelectionProps) => {
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useContext(AnalyticsContext);

  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer title={getMicroCopy(microCopy.GUTTERING_GUTTER_TITLE)}>
      <CardRadioGroup
        name="guttering"
        defaultValue={selected}
        isRequired
        fieldIsRequiredError={getMicroCopy(
          microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
        )}
      >
        {options.map(({ name, image }) => (
          <CardRadioGroup.Item
            key={name}
            value={name}
            title={name}
            imageSource={image}
            onClick={() => {
              pushEvent({
                event: "dxb.button_click",
                id: "rc-select-guttering",
                label: name,
                action: "selected"
              });
            }}
          />
        ))}
      </CardRadioGroup>
    </FieldContainer>
  );
};

type GutteringVariantSelectionProps = {
  // TODO: Type when importing from Contentful
  selected?: string;
  options: ReadonlyArray<GutteringVariant>;
};

const GutteringVariantSelection = ({
  selected,
  options
}: GutteringVariantSelectionProps) => {
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useContext(AnalyticsContext);

  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer
      title={getMicroCopy(microCopy.GUTTERING_GUTTER_VARIANT_TITLE)}
    >
      <CardRadioGroup
        name="gutteringVariant"
        defaultValue={selected}
        isRequired
        fieldIsRequiredError={getMicroCopy(
          microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
        )}
      >
        {options.map(({ name, image, externalProductCode }) => (
          <CardRadioGroup.Item
            key={externalProductCode}
            value={externalProductCode}
            title={name}
            imageSource={image}
            onClick={() => {
              pushEvent({
                event: "dxb.button_click",
                id: "rc-select-guttering",
                label: `${name} - ${getMicroCopy(
                  microCopy.CALCULATOR_NOBB_LABEL
                )}: ${externalProductCode}`,
                action: "selected"
              });
            }}
          >
            <CardRadioGroup.Item.Paragraph>
              {getMicroCopy(microCopy.CALCULATOR_NOBB_LABEL)}:{" "}
              <strong>{externalProductCode}</strong>
            </CardRadioGroup.Item.Paragraph>
          </CardRadioGroup.Item>
        ))}
      </CardRadioGroup>
    </FieldContainer>
  );
};

type GutteringHookSelectionProps = {
  // TODO: Type when importing from Contentful
  selected?: string;
  options: ReadonlyArray<LengthBasedProduct>;
};

const GutteringHookSelection = ({
  selected,
  options
}: GutteringHookSelectionProps) => {
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useContext(AnalyticsContext);

  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer title={getMicroCopy(microCopy.GUTTERING_GUTTER_HOOK_TITLE)}>
      <CardRadioGroup
        name="gutteringHook"
        defaultValue={selected}
        isRequired
        fieldIsRequiredError={getMicroCopy(
          microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
        )}
      >
        {options.map(({ name, image, externalProductCode }) => (
          <CardRadioGroup.Item
            key={externalProductCode}
            value={externalProductCode}
            title={name}
            imageSource={image}
            onClick={() => {
              pushEvent({
                event: "dxb.button_click",
                id: "rc-select-guttering",
                label: `${name} - ${getMicroCopy(
                  microCopy.CALCULATOR_NOBB_LABEL
                )}: ${externalProductCode}`,
                action: "selected"
              });
            }}
          >
            <CardRadioGroup.Item.Paragraph>
              {getMicroCopy(microCopy.CALCULATOR_NOBB_LABEL)}:{" "}
              <strong>{externalProductCode}</strong>
            </CardRadioGroup.Item.Paragraph>
          </CardRadioGroup.Item>
        ))}
      </CardRadioGroup>
    </FieldContainer>
  );
};

type DownPipeSelectionProps = {
  downPipes?: number;
  downPipeConnectors?: number;
};

const DownPipeSelection = ({
  downPipes,
  downPipeConnectors
}: DownPipeSelectionProps) => {
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useContext(AnalyticsContext);

  return (
    <>
      <FieldContainer title={getMicroCopy(microCopy.GUTTERING_DOWN_PIPE_TITLE)}>
        <Grid container>
          <Grid item xs={12} md={3}>
            <NumericInput
              name="downPipes"
              defaultValue={downPipes}
              min={0}
              onChange={(value) => {
                pushEvent({
                  event: "dxb.button_click",
                  id: "rc-select-guttering",
                  label: getMicroCopy(microCopy.GUTTERING_DOWN_PIPE_TITLE),
                  action: value + ""
                });
              }}
            />
          </Grid>
        </Grid>
      </FieldContainer>
      <FieldContainer
        title={getMicroCopy(microCopy.GUTTERING_DOWN_PIPE_CONNECTORS_TITLE)}
      >
        <Grid container>
          <Grid item xs={12} md={3}>
            <NumericInput
              name="downPipeConnectors"
              defaultValue={downPipeConnectors}
              min={0}
              onChange={(value) => {
                pushEvent({
                  event: "dxb.button_click",
                  id: "rc-select-guttering",
                  label: getMicroCopy(
                    microCopy.GUTTERING_DOWN_PIPE_CONNECTORS_TITLE
                  ),
                  action: value + ""
                });
              }}
            />
          </Grid>
        </Grid>
      </FieldContainer>
    </>
  );
};

export type GutteringSelections = {
  guttering?: string;
  gutteringVariant?: string;
  gutteringHook?: string;
  downPipes?: number;
  downPipeConnectors?: number;
};

export type GutteringProps = {
  selections?: GutteringSelections;
  gutters: GutteringType[];
  gutterHooks: LengthBasedProduct[];
};

const Guttering = ({ selections, gutters, gutterHooks }: GutteringProps) => {
  const { values } = useContext(FormContext);
  const variants = (
    gutters.find(({ name }) => values["guttering"] === name) || {
      variants: []
    }
  ).variants;
  return (
    <div>
      <GutteringSelection selected={selections?.guttering} options={gutters} />
      {values["guttering"] ? (
        <GutteringVariantSelection
          selected={selections?.gutteringVariant}
          options={variants}
        />
      ) : null}
      {values["gutteringVariant"] ? (
        <>
          <GutteringHookSelection
            selected={selections?.gutteringHook}
            options={gutterHooks}
          />
          <DownPipeSelection
            downPipes={selections?.downPipes}
            downPipeConnectors={selections?.downPipeConnectors}
          />
        </>
      ) : null}
    </div>
  );
};

export default Guttering;
