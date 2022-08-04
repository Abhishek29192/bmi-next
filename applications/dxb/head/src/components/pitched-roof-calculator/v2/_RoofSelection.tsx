import { CardRadioGroup } from "@bmi/components";
import React, { useContext, useMemo } from "react";
import { microCopy } from "../../../constants/microCopies";
import { useSiteContext } from "../../Site";
import { AnalyticsContext } from "../helpers/analytics";
import { RoofType, RoofV2 as Roof } from "../types/roof";
import roofs from "./calculation/roofs";
import FieldContainer from "./subcomponents/_FieldContainer";

type RoofSelectionRowProps = {
  title: string;
  select: (roof: Roof) => void;
  selected?: Roof;
  options: ReadonlyArray<Roof>;
};

const RoofSelectionRow = ({
  title,
  options,
  select,
  selected
}: RoofSelectionRowProps) => {
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useContext(AnalyticsContext);

  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer title={title}>
      <CardRadioGroup name="roof" defaultValue={(selected || {}).name}>
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
                select(roof);
              }}
            />
          );
        })}
      </CardRadioGroup>
    </FieldContainer>
  );
};

const categories: RoofType[] = ["gable", "hipped", "sloped"];

export type RoofSelectionProps = Pick<
  RoofSelectionRowProps,
  "select" | "selected"
> & {
  requiredRoofShapes?: Array<{ name: string; id: string }>;
};

const RoofSelection = ({
  select,
  selected,
  requiredRoofShapes
}: RoofSelectionProps) => {
  const { getMicroCopy } = useSiteContext();
  const filteredRoofs = useMemo(() => {
    if (!requiredRoofShapes || requiredRoofShapes.length === 0) {
      return [];
    }

    const roofsToUse = requiredRoofShapes.map((roof) => roof.id);

    return roofs.filter((roof) => roofsToUse.includes(roof.id));
  }, [requiredRoofShapes]);
  return (
    <div>
      {categories.map((type) => (
        <RoofSelectionRow
          key={type}
          title={getMicroCopy(`roofSelection.${type}`)}
          options={filteredRoofs.filter((roof) => roof.type === type)}
          {...{ select, selected }}
        />
      ))}
    </div>
  );
};

export default RoofSelection;
