import Typography from "@bmi-digital/components/typography";
import { microCopy } from "@bmi/microcopies";
import React from "react";
import { useSiteContext } from "../Site";
import { StyledCardRadioItemParagraph } from "./_UnderlaySelection.styles";
import { useAnalyticsContext } from "./helpers/analytics";
import FieldContainer from "./subcomponents/_FieldContainer";
import { CardRadioGroup } from "./subcomponents/card-group/CardGroup";
import { Underlay } from "./types";

type UnderlaySelectionRowProps = {
  // TODO: Type when importing from Contentful
  selected?: Underlay;
  options: Underlay[];
};

const UnderlaySelectionRow = ({
  options,
  selected
}: UnderlaySelectionRowProps) => {
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useAnalyticsContext();

  const constructGTMLabel = (underlay: Underlay) => {
    if (underlay.shortDescription) {
      return `${underlay.name} - ${underlay.shortDescription} - ${getMicroCopy(
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
            imageSource={underlay.mainImage}
            onClick={() =>
              pushEvent({
                event: "dxb.button_click",
                id: "rc-select-underlay",
                label: constructGTMLabel(underlay),
                action: "selected"
              })
            }
          >
            {underlay.shortDescription ? (
              <StyledCardRadioItemParagraph>
                {underlay.shortDescription}
              </StyledCardRadioItemParagraph>
            ) : null}
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
>;

const UnderlaySelection = ({ options, selected }: UnderlaySelectionProps) => {
  const { getMicroCopy } = useSiteContext();

  const sortedOptions = options.sort(
    ({ name: firstUnderlay }, { name: secondUnderlay }) =>
      firstUnderlay.localeCompare(secondUnderlay)
  );

  return (
    <div>
      {sortedOptions.length ? (
        <UnderlaySelectionRow options={sortedOptions} {...{ selected }} />
      ) : (
        <Typography variant="h4" align="center">
          {getMicroCopy(microCopy.UNDERLAY_SELECTION_EMPTY)}
        </Typography>
      )}
    </div>
  );
};

export default UnderlaySelection;
