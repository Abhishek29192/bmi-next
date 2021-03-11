import React from "react";
import CardRadioGroup from "@bmi/card-radio-group";
import FieldContainer from "./subcomponents/_FieldContainer";
import getPitchValues from "./helpers/getPitchValues";
import underlays from "./samples/underlays";

type UnderlaySelectionRowProps = {
  dimensions: Record<string, string>;
  // TODO: Type when importing from Contentful
  selected?: any;
  options: ReadonlyArray<any>;
};

const validateUnderlayForPitchValues = (
  minSupportedPitch: number,
  pitchValues: number[]
): boolean => pitchValues.every((pitch) => pitch >= minSupportedPitch);

const UnderlaySelectionRow = ({
  options,
  selected,
  dimensions
}: UnderlaySelectionRowProps) => {
  const pitchValues = getPitchValues(dimensions);

  const filteredOptions = options
    .filter((underlay) =>
      validateUnderlayForPitchValues(underlay.minSupportedPitch, pitchValues)
    )
    .sort(({ name: firstTile }, { name: secondTile }) =>
      firstTile.localeCompare(secondTile)
    );

  if (!filteredOptions.length) {
    return null;
  }

  return (
    <FieldContainer>
      <CardRadioGroup name="underlay" defaultValue={selected} isRequired>
        {filteredOptions.map((underlay) => (
          <CardRadioGroup.Item
            key={underlay.externalProductCode}
            value={underlay.externalProductCode}
            title={underlay.name}
            imageSource={underlay.image}
          >
            <CardRadioGroup.Item.Paragraph>
              {underlay.description}
            </CardRadioGroup.Item.Paragraph>
            <CardRadioGroup.Item.Paragraph>
              Nobb: {underlay.externalProductCode}
            </CardRadioGroup.Item.Paragraph>
          </CardRadioGroup.Item>
        ))}
      </CardRadioGroup>
    </FieldContainer>
  );
};

type UnderlaySelectionProps = Pick<
  UnderlaySelectionRowProps,
  "dimensions" | "selected"
>;

const UnderlaySelection = ({
  dimensions,
  selected
}: UnderlaySelectionProps) => (
  <div>
    <UnderlaySelectionRow options={underlays} {...{ selected, dimensions }} />
  </div>
);

export default UnderlaySelection;
