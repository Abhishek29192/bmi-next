import React from "react";
import CardRadioGroup from "@bmi/card-radio-group";
import FieldContainer from "./subcomponents/_FieldContainer";
import roofs from "./calculation/roofs";
import { Roof } from "./types/roof";

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
            title={roof.name}
            illustratedImage={roof.illustration}
            onClick={() => select(roof)}
          />
        ))}
      </CardRadioGroup>
    </FieldContainer>
  );
};

type RoofCategory = {
  name: string;
  type: string;
};

const categories: RoofCategory[] = [
  {
    name: "Gable roofs",
    type: "gable"
  },
  {
    name: "Hipped roofs",
    type: "hipped"
  },
  {
    name: "Sloped roofs",
    type: "sloped"
  }
];

type RoofSelecionProps = Pick<RoofSelectionRowProps, "select" | "selected">;

const RoofSelection = ({ select, selected }: RoofSelecionProps) => (
  <div>
    {categories.map(({ name, type }) => (
      <RoofSelectionRow
        key={type}
        title={name}
        options={roofs.filter((roof) => roof.type === type)}
        {...{ select, selected }}
      />
    ))}
  </div>
);

export default RoofSelection;
