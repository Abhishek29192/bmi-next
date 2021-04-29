import React from "react";
import CardRadioGroup from "@bmi/card-radio-group";
import CardCheckboxGroup from "@bmi/card-checkbox-group";
import FieldContainer from "./subcomponents/_FieldContainer";

type VergeOptionsProps = {
  // TODO: Type when importing from Contentful
  selected?: string;
  options: ReadonlyArray<any>;
};

const VergeOptions = ({ selected, options }: VergeOptionsProps) => {
  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer
      title={"Select verge detail"}
      help={
        "These are the available tile options for your tile product selection."
      }
    >
      <CardRadioGroup name="verge" defaultValue={selected} isRequired>
        {options.map(({ name, left }) => (
          <CardRadioGroup.Item
            key={name}
            value={name}
            title={name}
            imageSource={left.image}
          />
        ))}
        <CardRadioGroup.Item value="none" title="None" />
      </CardRadioGroup>
    </FieldContainer>
  );
};

type RidgeOptionsProps = {
  // TODO: Type when importing from Contentful
  selected?: string;
  options: ReadonlyArray<any>;
};

const RidgeOptions = ({ selected, options }: RidgeOptionsProps) => {
  if (options.length < 2) {
    return null;
  }

  return (
    <FieldContainer title={"Select ridge detail"}>
      <CardRadioGroup name="ridge" defaultValue={selected} isRequired>
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

type VentilationHoodOptionsProps = {
  // TODO: Type when importing from Contentful
  selected?: string[];
  options: ReadonlyArray<any>;
};

const VentilationHoodOptions = ({
  selected,
  options
}: VentilationHoodOptionsProps) => {
  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer title={"Select ventilation hood items"}>
      <CardCheckboxGroup
        name="ventilation"
        defaultValue={selected}
        isRequired
        noneLabel="None"
      >
        {options.map(({ description, image, externalProductCode }) => (
          <CardCheckboxGroup.Item
            key={externalProductCode}
            value={externalProductCode}
            title={description}
            imageSource={image}
          >
            <CardCheckboxGroup.Item.Paragraph>
              Nobb: <strong>{externalProductCode}</strong>
            </CardCheckboxGroup.Item.Paragraph>
          </CardCheckboxGroup.Item>
        ))}
      </CardCheckboxGroup>
    </FieldContainer>
  );
};

type TileOptionsProps = {
  variant: any;
  selections: {
    verge?: string;
    ridge?: string;
    ventilation?: string[];
  };
};

const TileOptions = ({ variant, selections }: TileOptionsProps) => {
  return (
    <div>
      <VergeOptions
        selected={selections.verge}
        options={variant.vergeOptions}
      />
      <RidgeOptions
        selected={selections.ridge}
        options={variant.ridgeOptions}
      />
      <VentilationHoodOptions
        selected={selections.ventilation}
        options={variant.ventilationHoodOptions || []}
      />
    </div>
  );
};

export default TileOptions;
