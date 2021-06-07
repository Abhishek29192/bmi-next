import React, { useContext } from "react";
import CardRadioGroup from "@bmi/card-radio-group";
import CardCheckboxGroup from "@bmi/card-checkbox-group";
import { getMicroCopy, MicroCopyContext } from "./helpers/microCopy";
import FieldContainer from "./subcomponents/_FieldContainer";
import { AnalyticsContext } from "./helpers/analytics";
import { Accessory } from "./types";

type VergeOptionsProps = {
  // TODO: Type when importing from Contentful
  selected?: string;
  options: ReadonlyArray<any>;
};

const VergeOptions = ({ selected, options }: VergeOptionsProps) => {
  const copy = useContext(MicroCopyContext);
  const pushEvent = useContext(AnalyticsContext);

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
            onClick={() => {
              pushEvent({
                id: "rc-options-accessories",
                label: name,
                action: "selected"
              });
            }}
          />
        ))}
        <CardRadioGroup.Item
          value="none"
          title={getMicroCopy(copy, "tileOptions.verge.noneLabel")}
          onClick={() => {
            pushEvent({
              id: "rc-options-accessories",
              label: getMicroCopy(copy, "tileOptions.verge.noneLabel"),
              action: "selected"
            });
          }}
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
  const pushEvent = useContext(AnalyticsContext);

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
            onClick={() => {
              pushEvent({
                id: "rc-options-accessories",
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

type VentilationHoodOptionsProps = {
  // TODO: Type when importing from Contentful
  selected?: string[];
  options: ReadonlyArray<Accessory>;
};

const VentilationHoodOptions = ({
  selected,
  options
}: VentilationHoodOptionsProps) => {
  const copy = useContext(MicroCopyContext);
  const pushEvent = useContext(AnalyticsContext);

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
        {options.map(({ name, image, externalProductCode }) => (
          <CardCheckboxGroup.Item
            key={externalProductCode}
            value={externalProductCode}
            title={name}
            imageSource={image}
            onClick={() => {
              pushEvent({
                id: "rc-options-accessories",
                label: name,
                action: "selected"
              });
            }}
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
