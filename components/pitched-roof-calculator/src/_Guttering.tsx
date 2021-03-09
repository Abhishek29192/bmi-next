import React, { useContext } from "react";
import CardRadioGroup from "@bmi/card-radio-group";
import Grid from "@bmi/grid";
import { FormContext } from "@bmi/form";
import NumericInput from "@bmi/up-down-simple-numeric-input";
import FieldContainer from "./subcomponents/_FieldContainer";
import { guttering, hooks } from "./samples/guttering";

type GutteringSelectionProps = {
  // TODO: Type when importing from Contentful
  selected?: string;
  options: ReadonlyArray<any>;
};

const GutteringSelection = ({ selected, options }: GutteringSelectionProps) => {
  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer title={"Choose a gutter material"}>
      <CardRadioGroup name="guttering" defaultValue={selected} isRequired>
        {options.map(({ name, image }) => (
          <CardRadioGroup.Item
            key={name}
            value={name}
            title={name}
            imageSource={image}
          />
        ))}
      </CardRadioGroup>
    </FieldContainer>
  );
};

type GutteringVariantSelectionProps = {
  // TODO: Type when importing from Contentful
  selected?: string;
  options: ReadonlyArray<any>;
};

const GutteringVariantSelection = ({
  selected,
  options
}: GutteringVariantSelectionProps) => {
  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer title={"Select the colour"}>
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
  options: ReadonlyArray<any>;
};

const GutteringHookSelection = ({
  selected,
  options
}: GutteringHookSelectionProps) => {
  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer title={"Select a gutter hook type"}>
      <CardRadioGroup name="gutteringHook" defaultValue={selected} isRequired>
        {options.map(({ name, image, externalProductCode }) => (
          <CardRadioGroup.Item
            key={externalProductCode}
            value={externalProductCode}
            title={name}
            imageSource={image}
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
}: DownPipeSelectionProps) => (
  <>
    <FieldContainer title={"Add down pipe (3m lengths)"}>
      <Grid container>
        <Grid item xs={12} md={3}>
          <NumericInput name="downPipes" defaultValue={downPipes} />
        </Grid>
      </Grid>
    </FieldContainer>
    <FieldContainer title={"How many downpipes connectors?"}>
      <Grid container>
        <Grid item xs={12} md={3}>
          <NumericInput
            name="downPipeConnectors"
            defaultValue={downPipeConnectors}
          />
        </Grid>
      </Grid>
    </FieldContainer>
  </>
);

type GutteringProps = {
  selections: {
    guttering?: string;
    gutteringVariant?: string;
    gutteringHook?: string;
    downPipes?: number;
    downPipeConnectors?: number;
  };
};

const Guttering = ({ selections }: GutteringProps) => {
  const { values } = useContext(FormContext);
  const variants = (
    guttering.find(({ name }) => values["guttering"] === name) || {
      variants: []
    }
  ).variants;
  return (
    <div>
      <GutteringSelection selected={selections.guttering} options={guttering} />
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
            options={hooks}
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
