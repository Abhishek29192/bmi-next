import React, { useContext } from "react";
import { CardRadioGroup } from "@bmi-digital/components";
import { getMicroCopy, MicroCopyContext } from "./helpers/microCopy";
import FieldContainer from "./subcomponents/_FieldContainer";
import roofs from "./calculation/roofs";
import { Roof, RoofType } from "./types/roof";
import { AnalyticsContext } from "./helpers/analytics";

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
  const copy = useContext(MicroCopyContext);
  const pushEvent = useContext(AnalyticsContext);

  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer title={title}>
      <CardRadioGroup name="roof" defaultValue={(selected || {}).name}>
        {options.map((roof) => {
          const label = getMicroCopy(copy, "roofSelection.roof", {
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

export type RoofSelecionProps = Pick<
  RoofSelectionRowProps,
  "select" | "selected"
>;

const RoofSelection = ({ select, selected }: RoofSelecionProps) => {
  const copy = useContext(MicroCopyContext);
  return (
    <div>
      {categories.map((type) => (
        <RoofSelectionRow
          key={type}
          title={getMicroCopy(copy, `roofSelection.${type}`)}
          options={roofs.filter((roof) => roof.type === type)}
          {...{ select, selected }}
        />
      ))}
    </div>
  );
};

export default RoofSelection;
