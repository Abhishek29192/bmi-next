import React, { useContext } from "react";
import Typography from "@bmi/typography";
import CardRadioGroup from "@bmi/card-radio-group";
import { getMicroCopy, MicroCopyContext } from "./helpers/microCopy";
import FieldContainer from "./subcomponents/_FieldContainer";
import getPitchValues from "./helpers/getPitchValues";
import underlays from "./samples/underlays";
import { DimensionsValues } from "./types/roof";

type UnderlaySelectionRowProps = {
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
  selected
}: UnderlaySelectionRowProps) => {
  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer>
      <CardRadioGroup
        name="underlay"
        defaultValue={selected}
        isRequired
        fieldIsRequiredError /* just needs to be truthy since it's not displayed anywhere */
      >
        {options.map((underlay) => (
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

type UnderlaySelectionProps = Pick<UnderlaySelectionRowProps, "selected"> & {
  dimensions: DimensionsValues;
};

const UnderlaySelection = ({
  dimensions,
  selected
}: UnderlaySelectionProps) => {
  const copy = useContext(MicroCopyContext);

  const pitchValues = getPitchValues(dimensions);

  const filteredOptions = underlays
    .filter((underlay) =>
      validateUnderlayForPitchValues(underlay.minSupportedPitch, pitchValues)
    )
    .sort(({ name: firstUnderlay }, { name: secondUnderlay }) =>
      firstUnderlay.localeCompare(secondUnderlay)
    );

  return (
    <div>
      {filteredOptions.length ? (
        <UnderlaySelectionRow options={filteredOptions} {...{ selected }} />
      ) : (
        <Typography variant="h4">
          {getMicroCopy(copy, "underlaySelection.empty")}
        </Typography>
      )}
    </div>
  );
};

export default UnderlaySelection;
