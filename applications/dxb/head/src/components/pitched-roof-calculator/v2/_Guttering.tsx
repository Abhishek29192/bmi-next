import { FormContext, Grid } from "@bmi-digital/components";
import React, { useContext } from "react";
import { microCopy } from "../../../constants/microCopies";
import { useSiteContext } from "../../Site";
import { GroupedGutters, GutterHook, GutterVariant } from "../types/v2";
import { AnalyticsContext } from "./../helpers/analytics";
import { CardRadioGroup } from "./subcomponents/card-group/CardGroup";
import NumericInput from "./subcomponents/up-down-simple-numeric-input/UpDownSimpleNumericInput";
import FieldContainer from "./subcomponents/_FieldContainer";

type GutteringSelectionProps = {
  // TODO: Type when importing from Contentful
  selected?: string;
  gutters: GroupedGutters;
};

const GutteringSelection = ({ selected, gutters }: GutteringSelectionProps) => {
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useContext(AnalyticsContext);

  // eslint-disable-next-line security/detect-object-injection
  const options = Object.keys(gutters).map((code) => gutters[code][0]);

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
        {options.map(({ name, mainImage, baseProduct }) => (
          <CardRadioGroup.Item
            key={baseProduct.code}
            value={baseProduct.code}
            title={baseProduct.name}
            imageSource={mainImage}
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
  options: ReadonlyArray<GutterVariant>;
};

const GutteringVariantSelection = ({
  selected,
  options
}: GutteringVariantSelectionProps) => {
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useContext(AnalyticsContext);

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
        {options.map(({ name, mainImage, externalProductCode }) => (
          <CardRadioGroup.Item
            key={externalProductCode}
            value={externalProductCode}
            title={name}
            imageSource={mainImage}
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
  options: ReadonlyArray<GutterHook>;
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
        {options.map(({ name, mainImage, externalProductCode }) => (
          <CardRadioGroup.Item
            key={externalProductCode}
            value={externalProductCode}
            title={name}
            imageSource={mainImage}
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
  variant: GutterVariant;
};

const DownPipeSelection = ({
  downPipes,
  downPipeConnectors,
  variant
}: DownPipeSelectionProps) => {
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useContext(AnalyticsContext);
  const hasDownPipe = variant.productReferences?.find(
    (productReference) => productReference.type === "DOWN_PIPE"
  );
  const hasDownPipeConnectors = variant.productReferences?.find(
    (productReference) => productReference.type === "DOWN_PIPE_CONNECTOR"
  );

  return (
    <>
      {hasDownPipe && (
        <FieldContainer
          title={getMicroCopy(microCopy.GUTTERING_DOWN_PIPE_TITLE)}
        >
          <Grid container justifyContent="center">
            <Grid xs={12} md={3}>
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
      )}
      {hasDownPipeConnectors && (
        <FieldContainer
          title={getMicroCopy(microCopy.GUTTERING_DOWN_PIPE_CONNECTORS_TITLE)}
        >
          <Grid container justifyContent="center">
            <Grid xs={12} md={3}>
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
      )}
    </>
  );
};

export type GutteringSelections = {
  guttering?: string;
  gutteringVariant?: GutterVariant;
  gutteringHook?: GutterHook;
  downPipes?: number;
  downPipeConnectors?: number;
};

export type GutteringProps = {
  selections?: GutteringSelections;
  gutters: GroupedGutters;
  gutterHooks: GutterHook[];
};

const Guttering = ({ selections, gutters, gutterHooks }: GutteringProps) => {
  const { values } = useContext(FormContext);
  const variants = gutters[values.guttering as string];
  const variant = variants?.find(
    (variant) => variant.externalProductCode === values["gutteringVariant"]
  );

  return (
    <div>
      <GutteringSelection selected={selections?.guttering} gutters={gutters} />
      {values["guttering"] ? (
        <GutteringVariantSelection
          selected={selections?.gutteringVariant?.externalProductCode}
          options={variants}
        />
      ) : null}
      {variant ? (
        <>
          <GutteringHookSelection
            selected={selections?.gutteringHook?.externalProductCode}
            options={gutterHooks}
          />
          <DownPipeSelection
            downPipes={selections?.downPipes}
            downPipeConnectors={selections?.downPipeConnectors}
            variant={variant}
          />
        </>
      ) : null}
    </div>
  );
};

export default Guttering;
