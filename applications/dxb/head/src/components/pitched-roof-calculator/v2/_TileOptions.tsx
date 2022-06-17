import { CardCheckboxGroup, CardRadioGroup } from "@bmi/components";
import React, { useContext } from "react";
import { useSiteContext } from "../../Site";
import { AnalyticsContext } from "../helpers/analytics";
import {
  Accessory,
  LengthBasedProduct,
  MainTileVariant,
  VergeOption
} from "../types";
import { microCopy } from "./constants/microCopy";
import FieldContainer from "./subcomponents/_FieldContainer";

type VergeOptionsProps = {
  selected?: string;
  options: ReadonlyArray<VergeOption>;
};

const VergeOptions = ({ selected, options }: VergeOptionsProps) => {
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useContext(AnalyticsContext);

  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer
      title={getMicroCopy(microCopy.TILE_OPTIONS_VERGE_TITLE)}
      help={getMicroCopy(microCopy.TILE_OPTIONS_VERGE_HELP)}
    >
      <CardRadioGroup
        name="verge"
        defaultValue={selected}
        isRequired
        fieldIsRequiredError={getMicroCopy(
          microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
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
          title={getMicroCopy(microCopy.TILE_OPTIONS_VERGE_NONE_LABEL)}
          onClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-options-accessories",
              label: getMicroCopy(microCopy.TILE_OPTIONS_VERGE_NONE_LABEL),
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
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useContext(AnalyticsContext);

  if (options.length < 2) {
    return null;
  }

  return (
    <FieldContainer
      title={getMicroCopy(microCopy.TILE_OPTIONS_RIDGE_TITLE)}
      help={getMicroCopy(microCopy.TILE_OPTIONS_RIDGE_HELP)}
    >
      <CardRadioGroup
        name="ridge"
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
                id: "rc-options-accessories",
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

type VentilationHoodOptionsProps = {
  selected?: string[];
  options: ReadonlyArray<Accessory>;
};

const VentilationHoodOptions = ({
  selected,
  options
}: VentilationHoodOptionsProps) => {
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useContext(AnalyticsContext);

  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer
      title={getMicroCopy(microCopy.TILE_OPTIONS_VENTILATION_HOOD_TITLE)}
    >
      <CardCheckboxGroup
        name="ventilation"
        defaultValue={selected}
        isRequired
        fieldIsRequiredError={getMicroCopy(
          microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
        )}
        noneLabel={getMicroCopy(
          microCopy.TILE_OPTIONS_VENTILATION_HOOD_NONE_LABEL
        )}
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
                label: `${name} - ${getMicroCopy(
                  microCopy.CALCULATOR_NOBB_LABEL
                )}: ${externalProductCode}`,
                action: "selected"
              });
            }}
          >
            <CardCheckboxGroup.Item.Paragraph>
              {getMicroCopy(microCopy.CALCULATOR_NOBB_LABEL)}:{" "}
              <strong>{externalProductCode}</strong>
            </CardCheckboxGroup.Item.Paragraph>
          </CardCheckboxGroup.Item>
        ))}
      </CardCheckboxGroup>
    </FieldContainer>
  );
};

export type TileOptionsSelections = {
  verge?: string;
  ridge?: string;
  ventilation?: string[];
};

export type TileOptionsProps = {
  variant: MainTileVariant;
  selections?: TileOptionsSelections;
};

const TileOptions = ({ variant, selections }: TileOptionsProps) => {
  return (
    <div>
      <VergeOptions
        selected={selections?.verge}
        options={variant.vergeOptions}
      />
      <RidgeOptions
        selected={selections?.ridge}
        options={variant.ridgeOptions}
      />
      <VentilationHoodOptions
        selected={selections?.ventilation}
        options={variant.ventilationHoodOptions || []}
      />
    </div>
  );
};

export default TileOptions;
