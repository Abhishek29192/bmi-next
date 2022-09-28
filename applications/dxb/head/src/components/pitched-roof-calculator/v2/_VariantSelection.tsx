import React, { useContext } from "react";
import { microCopy } from "../../../constants/microCopies";
import { useSiteContext } from "../../Site";
import { AnalyticsContext } from "../helpers/analytics";
import { Tile } from "../types/v2";
import { CardRadioGroup } from "./subcomponents/card-group/CardGroup";
import FieldContainer from "./subcomponents/_FieldContainer";

export type VariantSelectionProps = {
  selected?: Tile;
  options: Tile[];
};

const VariantSelection = ({ options, selected }: VariantSelectionProps) => {
  const pushEvent = useContext(AnalyticsContext);
  const { getMicroCopy } = useSiteContext();

  const sortedOptions = options.sort(
    ({ color: firstVariant }, { color: secondVariant }) =>
      firstVariant.localeCompare(secondVariant)
  );

  if (!sortedOptions.length) {
    return null;
  }

  return (
    <FieldContainer title={options[0].baseProduct.name}>
      <CardRadioGroup
        name="variant"
        defaultValue={(selected || {}).externalProductCode}
        isRequired
        fieldIsRequiredError={getMicroCopy(
          microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
        )}
      >
        {sortedOptions.map((tile) => (
          <CardRadioGroup.Item
            key={tile.externalProductCode}
            value={tile.externalProductCode}
            title={tile.color}
            imageSource={tile.mainImage}
            onClick={() => {
              pushEvent({
                event: "dxb.button_click",
                id: "rc-select-tile-colour",
                label: `${tile.color} - ${getMicroCopy(
                  microCopy.CALCULATOR_NOBB_LABEL
                )}: ${tile.externalProductCode}`,
                action: "selected"
              });
            }}
          >
            <CardRadioGroup.Item.Paragraph>
              {getMicroCopy(microCopy.CALCULATOR_NOBB_LABEL)}:{" "}
              {tile.externalProductCode}
            </CardRadioGroup.Item.Paragraph>
          </CardRadioGroup.Item>
        ))}
      </CardRadioGroup>
    </FieldContainer>
  );
};

export default VariantSelection;
