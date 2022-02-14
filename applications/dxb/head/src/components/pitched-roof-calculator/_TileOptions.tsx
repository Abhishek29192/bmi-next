import React, { useContext } from "react";
import CardRadioGroup from "@bmi-digital/components/card-radio-group";
import CardCheckboxGroup from "@bmi-digital/components/card-checkbox-group";
import { getMicroCopy, MicroCopyContext } from "./helpers/microCopy";
import FieldContainer from "./subcomponents/_FieldContainer";
import { AnalyticsContext } from "./helpers/analytics";
import {
  Accessory,
  LengthBasedProduct,
  MainTileVariant,
  VergeOption
} from "./types";

type VergeOptionsProps = {
  selected?: string;
  options: ReadonlyArray<VergeOption>;
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
        fieldIsRequiredError={getMicroCopy(
          copy,
          "validation.errors.fieldRequired"
        )}
      >
        {options.map(({ name, left }) => (
          <CardRadioGroup.Item
            key={name}
            value={name}
            title={name}
            imageSource={left.image}
            onClick={() => {
              pushEvent({
                event: "dxb.button_click",
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
              event: "dxb.button_click",
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
  selected?: string;
  options: ReadonlyArray<LengthBasedProduct>;
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
        fieldIsRequiredError={getMicroCopy(
          copy,
          "validation.errors.fieldRequired"
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
                id: "rc-options-accessories",
                label: `${name} - Nobb: ${externalProductCode}`,
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
        fieldIsRequiredError={getMicroCopy(
          copy,
          "validation.errors.fieldRequired"
        )}
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
                event: "dxb.button_click",
                id: "rc-options-accessories",
                label: `${name} - Nobb: ${externalProductCode}`,
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

export type TileOptionsSeletions = {
  verge?: string;
  ridge?: string;
  ventilation?: string[];
};

export type TileOptionsProps = {
  variant: MainTileVariant;
  selections: TileOptionsSeletions;
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
