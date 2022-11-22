import {
  FormContext,
  Grid,
  withFormControl,
  WithFormControlProps
} from "@bmi/components";
import React, { useContext, useMemo } from "react";
import { microCopy } from "../../../constants/microCopies";
import { useSiteContext } from "../../Site";
import { useAnalyticsContext } from "../helpers/analytics";
import { RoofType, RoofV2 as Roof } from "../types/roof";
import roofs from "./calculation/roofs";
import { CardRadioGroup } from "./subcomponents/card-group/CardGroup";
import FieldContainer from "./subcomponents/_FieldContainer";

type RoofSelectionRowProps = {
  title: string;
  options: ReadonlyArray<Roof>;
  onChange: (value: string) => void;
};

const RoofSelectionRow = ({
  title,
  options,
  onChange
}: RoofSelectionRowProps) => {
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useAnalyticsContext();
  const { values } = useContext(FormContext);

  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer title={title}>
      <Grid container spacing={3} justifyContent="center">
        {options.map((roof) => {
          const label = getMicroCopy(microCopy.ROOF_SELECTION_ROOF, {
            name: roof.name
          });

          return (
            <Grid item xs={6} md={4} lg={2} key={roof.id}>
              <CardRadioGroup.Item
                value={roof.id}
                checked={values.roof === roof.id}
                title={label}
                illustratedImage={roof.illustration}
                onClick={() => {
                  pushEvent({
                    event: "dxb.button_click",
                    id: "rc-roof-type",
                    label,
                    action: "selected"
                  });
                  onChange(roof.id);
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    </FieldContainer>
  );
};

const categories: RoofType[] = ["gable", "hipped", "sloped"];

export type RoofSelectionProps = WithFormControlProps<string> & {
  requiredRoofShapes?: { roofShapeId: string }[];
};

const RoofSelection = ({
  requiredRoofShapes,
  onChange
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
          onChange={onChange}
        />
      ))}
    </div>
  );
};

export default withFormControl<RoofSelectionProps, string>(RoofSelection);
