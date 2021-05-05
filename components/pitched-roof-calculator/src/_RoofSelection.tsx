import React, { useContext } from "react";
import CardRadioGroup from "@bmi/card-radio-group";
import { getMicroCopy, MicroCopyContext } from "./helpers/microCopy";
import FieldContainer from "./subcomponents/_FieldContainer";
import roofs from "./calculation/roofs";
import { Roof, RoofType } from "./types/roof";

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

  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer title={title}>
      <CardRadioGroup name="roof" defaultValue={(selected || {}).name}>
        {options.map((roof) => (
          <CardRadioGroup.Item
            key={roof.name}
            value={roof.name}
            title={getMicroCopy(copy, "roofSelection.roof", {
              name: roof.name
            })}
            illustratedImage={roof.illustration}
            onClick={() => select(roof)}
          />
        ))}
      </CardRadioGroup>
    </FieldContainer>
  );
};

const categories: RoofType[] = ["gable", "hipped", "sloped"];

type RoofSelecionProps = Pick<RoofSelectionRowProps, "select" | "selected">;

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
