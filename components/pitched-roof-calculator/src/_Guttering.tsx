import React, { useContext } from "react";
import CardRadioGroup from "@bmi/card-radio-group";
import Grid from "@bmi/grid";
import { FormContext } from "@bmi/form";
import NumericInput from "@bmi/up-down-simple-numeric-input";
import { getMicroCopy, MicroCopyContext } from "./helpers/microCopy";
import FieldContainer from "./subcomponents/_FieldContainer";
import { AnalyticsContext } from "./helpers/analytics";
import {
  Guttering as GutteringType,
  GutteringVariant,
  LengthBasedProduct
} from "./types";

type GutteringSelectionProps = {
  // TODO: Type when importing from Contentful
  selected?: string;
  options: ReadonlyArray<GutteringType>;
};

const GutteringSelection = ({ selected, options }: GutteringSelectionProps) => {
  const copy = useContext(MicroCopyContext);
  const pushEvent = useContext(AnalyticsContext);

  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer title={getMicroCopy(copy, "guttering.gutter.title")}>
      <CardRadioGroup name="guttering" defaultValue={selected} isRequired>
        {options.map(({ name, image }) => (
          <CardRadioGroup.Item
            key={name}
            value={name}
            title={name}
            imageSource={image}
            onClick={() => {
              pushEvent({
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
  const copy = useContext(MicroCopyContext);
  const pushEvent = useContext(AnalyticsContext);

  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer title={getMicroCopy(copy, "guttering.gutterVariant.title")}>
      <CardRadioGroup
        name="gutteringVariant"
        defaultValue={selected}
        isRequired
      >
        {options.map(({ name, image, externalProductCode }) => (
          <CardRadioGroup.Item
            key={externalProductCode}
            value={externalProductCode}
            title={name}
            imageSource={image}
            onClick={() => {
              pushEvent({
                id: "rc-select-guttering",
                label: name,
                action: "selected"
              });
            }}
          >
            <CardRadioGroup.Item.Paragraph>
              Nobb: <strong>{externalProductCode}</strong>
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
  const copy = useContext(MicroCopyContext);
  const pushEvent = useContext(AnalyticsContext);

  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer title={getMicroCopy(copy, "guttering.gutterHook.title")}>
      <CardRadioGroup name="gutteringHook" defaultValue={selected} isRequired>
        {options.map(({ name, image, externalProductCode }) => (
          <CardRadioGroup.Item
            key={externalProductCode}
            value={externalProductCode}
            title={name}
            imageSource={image}
            onClick={() => {
              pushEvent({
                id: "rc-select-guttering",
                label: name,
                action: "selected"
              });
            }}
          >
            <CardRadioGroup.Item.Paragraph>
              Nobb: <strong>{externalProductCode}</strong>
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
  const copy = useContext(MicroCopyContext);
  const pushEvent = useContext(AnalyticsContext);

  return (
    <>
      <FieldContainer title={getMicroCopy(copy, "guttering.downPipe.title")}>
        <Grid container>
          <Grid item xs={12} md={3}>
            <NumericInput
              name="downPipes"
              defaultValue={downPipes}
              onChange={(value) => {
                pushEvent({
                  id: "rc-select-guttering",
                  label: getMicroCopy(copy, "guttering.downPipe.title"),
                  action: value + ""
                });
              }}
            />
          </Grid>
        </Grid>
      </FieldContainer>
      <FieldContainer
        title={getMicroCopy(copy, "guttering.downPipeConnectors.title")}
      >
        <Grid container>
          <Grid item xs={12} md={3}>
            <NumericInput
              name="downPipeConnectors"
              defaultValue={downPipeConnectors}
              onChange={(value) => {
                pushEvent({
                  id: "rc-select-guttering",
                  label: getMicroCopy(
                    copy,
                    "guttering.downPipeConnectors.title"
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

type GutteringProps = {
  selections: {
    guttering?: string;
    gutteringVariant?: string;
    gutteringHook?: string;
    downPipes?: number;
    downPipeConnectors?: number;
  };
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
      <GutteringSelection selected={selections.guttering} options={gutters} />
      {values["guttering"] ? (
        <GutteringVariantSelection
          selected={selections.gutteringVariant}
          options={variants}
        />
      ) : null}
      {values["gutteringVariant"] ? (
        <>
          <GutteringHookSelection
            selected={selections.gutteringHook}
            options={gutterHooks}
          />
          <DownPipeSelection
            downPipes={selections.downPipes}
            downPipeConnectors={selections.downPipeConnectors}
          />
        </>
      ) : null}
    </div>
  );
};

export default Guttering;
