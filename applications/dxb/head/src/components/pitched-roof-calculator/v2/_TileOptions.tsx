import { FormContext } from "@bmi/components";
import React, { useContext, useEffect } from "react";
import { microCopy } from "../../../constants/microCopies";
import { useSiteContext } from "../../Site";
import { AnalyticsContext } from "../helpers/analytics";
import {
  RidgeOption,
  Tile,
  TileOptionSelections,
  VentilationHood,
  VergeOption
} from "../types/v2";
import {
  CardCheckboxGroup,
  CardRadioGroup
} from "./subcomponents/card-group/CardGroup";
import FieldContainer from "./subcomponents/_FieldContainer";

type VergeOptionsProps = {
  selected?: string;
  verge: VergeOption;
};

const VergeOptions = ({ selected, verge }: VergeOptionsProps) => {
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useContext(AnalyticsContext);

  if (!verge) {
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
        <CardRadioGroup.Item
          key={verge.left.externalProductCode}
          value={verge.left.externalProductCode}
          title={verge.left.name}
          imageSource={verge.left.mainImage}
          onClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-options-accessories",
              label: verge.left.name,
              action: "selected"
            });
          }}
        />
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
  options: ReadonlyArray<RidgeOption>;
};

const RidgeOptions = ({ selected, options }: RidgeOptionsProps) => {
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useContext(AnalyticsContext);
  const { updateFormState } = useContext(FormContext);

  useEffect(() => {
    if (options.length === 1) {
      updateFormState({ ridge: options[0].externalProductCode });
    }
  }, [options]);

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
        {options.map(({ name, mainImage, externalProductCode }) => (
          <CardRadioGroup.Item
            key={externalProductCode}
            value={externalProductCode}
            title={name}
            imageSource={mainImage}
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
  options: ReadonlyArray<VentilationHood>;
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
      help={getMicroCopy(microCopy.TILE_OPTIONS_VENTILATION_HOOD_HELP)}
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
        {options.map(({ name, mainImage, externalProductCode }) => (
          <CardCheckboxGroup.Item
            key={externalProductCode}
            value={externalProductCode}
            title={name}
            imageSource={mainImage}
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

export type TileOptionsProps = {
  variant: Tile;
  selections?: TileOptionSelections;
};

const TileOptions = ({ variant, selections }: TileOptionsProps) => {
  return (
    <div>
      <VergeOptions
        selected={selections?.verge?.left?.externalProductCode}
        verge={variant.vergeOption}
      />
      <RidgeOptions
        selected={selections?.ridge?.externalProductCode}
        options={variant.ridgeOptions}
      />
      <VentilationHoodOptions
        selected={selections?.ventilationHoods?.map(
          (v) => v.externalProductCode
        )}
        options={variant.ventilationHoodOptions}
      />
    </div>
  );
};

export default TileOptions;
