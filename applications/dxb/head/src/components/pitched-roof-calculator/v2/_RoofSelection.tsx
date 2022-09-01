import React, { useMemo } from "react";
import { microCopy } from "../../../constants/microCopies";
import { useSiteContext } from "../../Site";
import { useAnalyticsContext } from "../helpers/analytics";
import { RoofType, RoofV2 as Roof } from "../types/roof";
import roofs from "./calculation/roofs";
import { CardRadioGroup } from "./subcomponents/card-group/CardGroup";
import FieldContainer from "./subcomponents/_FieldContainer";

type RoofSelectionRowProps = {
  title: string;
  selected?: Roof;
  options: ReadonlyArray<Roof>;
};

const RoofSelectionRow = ({
  title,
  options,
  selected
}: RoofSelectionRowProps) => {
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useAnalyticsContext();

  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer title={title}>
      <CardRadioGroup
        name="roof"
        defaultValue={(selected || {}).name}
        isRequired
        fieldIsRequiredError={getMicroCopy(
          microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
        )}
      >
        {options.map((roof) => {
          const label = getMicroCopy(microCopy.ROOF_SELECTION_ROOF, {
            name: roof.name
          });

          return (
            <CardRadioGroup.Item
              key={roof.name}
              value={roof.name}
              title={label}
              illustratedImage={roof.illustration}
              onClick={() => {
                pushEvent({
                  event: "dxb.button_click",
                  id: "rc-roof-type",
                  label,
                  action: "selected"
                });
              }}
            />
          );
        })}
      </CardRadioGroup>
    </FieldContainer>
  );
};

const categories: RoofType[] = ["gable", "hipped", "sloped"];

export type RoofSelectionProps = Pick<RoofSelectionRowProps, "selected"> & {
  requiredRoofShapes?: { roofShapeId: string }[];
};

const RoofSelection = ({
  selected,
  requiredRoofShapes
}: RoofSelectionProps) => {
  const { getMicroCopy } = useSiteContext();
  const filteredRoofs = useMemo(() => {
    if (!requiredRoofShapes || requiredRoofShapes.length === 0) {
      return [];
    }

    const roofsToUse = requiredRoofShapes.map((roof) => roof.roofShapeId);

    return roofs.filter((roof) => roofsToUse.includes(roof.id));
  }, [requiredRoofShapes]);
  return (
    <div>
      {categories.map((type) => (
        <RoofSelectionRow
          key={type}
          title={getMicroCopy(`roofSelection.${type}`)}
          options={filteredRoofs.filter((roof) => roof.type === type)}
          selected={selected}
        />
      ))}
    </div>
  );
};

export default RoofSelection;
