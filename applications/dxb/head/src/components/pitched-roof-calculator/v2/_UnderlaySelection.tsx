import { Typography } from "@bmi/components";
import React from "react";
import { microCopy } from "../../../constants/microCopies";
import { useSiteContext } from "../../Site";
import { useAnalyticsContext } from "../helpers/analytics";
import getPitchValues from "../helpers/getPitchValues";
import { Underlay } from "../types";
import { DimensionsValues } from "../types/roof";
import { CardRadioGroup } from "./subcomponents/card-group/CardGroup";
import FieldContainer from "./subcomponents/_FieldContainer";

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
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useAnalyticsContext();

  const constructGTMLabel = (underlay: Underlay) => {
    if (underlay.description) {
      return `${underlay.name} - ${underlay.description} - ${getMicroCopy(
        microCopy.CALCULATOR_NOBB_LABEL
      )}: ${underlay.externalProductCode}`;
    }

    return `${underlay.name} - ${getMicroCopy(
      microCopy.CALCULATOR_NOBB_LABEL
    )}: ${underlay.externalProductCode}`;
  };

  return (
    <FieldContainer>
      <CardRadioGroup
        name="underlay"
        defaultValue={selected?.externalProductCode}
        isRequired
        fieldIsRequiredError={getMicroCopy(
          microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
        )}
      >
        {options.map((underlay: Underlay) => (
          <CardRadioGroup.Item
            key={underlay.externalProductCode}
            value={underlay.externalProductCode}
            title={underlay.name}
            imageSource={underlay.image}
            onClick={() =>
              pushEvent({
                event: "dxb.button_click",
                id: "rc-select-underlay",
                label: constructGTMLabel(underlay),
                action: "selected"
              })
            }
          >
            <CardRadioGroup.Item.Paragraph>
              {underlay.description}
            </CardRadioGroup.Item.Paragraph>
            <CardRadioGroup.Item.Paragraph>
              {getMicroCopy(microCopy.CALCULATOR_NOBB_LABEL)}:{" "}
              {underlay.externalProductCode}
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
  const { getMicroCopy } = useSiteContext();

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
          {getMicroCopy(microCopy.UNDERLAY_SELECTION_EMPTY)}
        </Typography>
      )}
    </div>
  );
};

export default UnderlaySelection;
