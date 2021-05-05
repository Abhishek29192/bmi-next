import React, { useContext } from "react";
import CardRadioGroup from "@bmi/card-radio-group";
import CardCheckboxGroup from "@bmi/card-checkbox-group";
import { getMicroCopy, MicroCopyContext } from "./helpers/microCopy";
import FieldContainer from "./subcomponents/_FieldContainer";

type VergeOptionsProps = {
  // TODO: Type when importing from Contentful
  selected?: string;
  options: ReadonlyArray<any>;
};

const VergeOptions = ({ selected, options }: VergeOptionsProps) => {
  const copy = useContext(MicroCopyContext);

  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer
      title={getMicroCopy(copy, "tileOptions.verge.title")}
      help={getMicroCopy(copy, "tileOptions.verge.help")}
    >
      <CardRadioGroup
        name="verge"
        defaultValue={selected}
        isRequired
        fieldIsRequiredError /* just needs to be truthy since it's not displayed anywhere */
      >
        {options.map(({ name, left }) => (
          <CardRadioGroup.Item
            key={name}
            value={name}
            title={name}
            imageSource={left.image}
          />
        ))}
        <CardRadioGroup.Item
          value="none"
          title={getMicroCopy(copy, "tileOptions.verge.noneLabel")}
        />
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
  const copy = useContext(MicroCopyContext);

  if (options.length < 2) {
    return null;
  }

  return (
    <FieldContainer
      title={getMicroCopy(copy, "tileOptions.ridge.title")}
      help={getMicroCopy(copy, "tileOptions.ridge.help")}
    >
      <CardRadioGroup
        name="ridge"
        defaultValue={selected}
        isRequired
        fieldIsRequiredError /* just needs to be truthy since it's not displayed anywhere */
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

type VentilationHoodOptionsProps = {
  // TODO: Type when importing from Contentful
  selected?: string[];
  options: ReadonlyArray<any>;
};

const VentilationHoodOptions = ({
  selected,
  options
}: VentilationHoodOptionsProps) => {
  const copy = useContext(MicroCopyContext);

  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer
      title={getMicroCopy(copy, "tileOptions.ventilationHood.title")}
    >
      <CardCheckboxGroup
        name="ventilation"
        defaultValue={selected}
        isRequired
        fieldIsRequiredError /* just needs to be truthy since it's not displayed anywhere */
        noneLabel={getMicroCopy(copy, "tileOptions.ventilationHood.noneLabel")}
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
