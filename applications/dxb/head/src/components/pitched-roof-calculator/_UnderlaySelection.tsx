import React, { useContext } from "react";
import { Typography } from "@bmi/components";
import { CardRadioGroup } from "@bmi/components";
import { getMicroCopy, MicroCopyContext } from "./helpers/microCopy";
import FieldContainer from "./subcomponents/_FieldContainer";
import getPitchValues from "./helpers/getPitchValues";
import { DimensionsValues } from "./types/roof";
import { AnalyticsContext } from "./helpers/analytics";
import { Underlay } from "./types";

type UnderlaySelectionRowProps = {
  // TODO: Type when importing from Contentful
  selected?: Underlay;
  options: ReadonlyArray<Underlay>;
};

const validateUnderlayForPitchValues = (
  minSupportedPitch: number,
  pitchValues: number[]
): boolean => pitchValues.every((pitch) => pitch >= minSupportedPitch);

const UnderlaySelectionRow = ({
  options,
  selected
}: UnderlaySelectionRowProps) => {
  const copy = useContext(MicroCopyContext);
  const pushEvent = useContext(AnalyticsContext);

  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer>
      <CardRadioGroup
        name="underlay"
        defaultValue={selected?.externalProductCode}
        isRequired
        fieldIsRequiredError={getMicroCopy(
          copy,
          "validation.errors.fieldRequired"
        )}
      >
        {options.map((underlay: Underlay) => (
          <CardRadioGroup.Item
            key={underlay.externalProductCode}
            value={underlay.externalProductCode}
            title={underlay.name}
            imageSource={underlay.image}
            onClick={() => {
              pushEvent({
                event: "dxb.button_click",
                id: "rc-select-underlay",
                label: `${underlay.name} - ${underlay.description} - ${underlay.externalProductCode}`,
                action: "selected"
              });
            }}
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

export type UnderlaySelectionProps = Pick<
  UnderlaySelectionRowProps,
  "selected" | "options"
> & {
  dimensions: DimensionsValues;
};

const UnderlaySelection = ({
  options,
  dimensions,
  selected
}: UnderlaySelectionProps) => {
  const copy = useContext(MicroCopyContext);

  const pitchValues = getPitchValues(dimensions);

  const filteredOptions = options
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
