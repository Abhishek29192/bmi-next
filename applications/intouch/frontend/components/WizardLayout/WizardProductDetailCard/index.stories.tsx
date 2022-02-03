import React from "react";
import { WizardProductDetailCard, WizardProductDetailCardProp } from ".";

export default {
  title: "Wizard Product Detail",
  component: WizardProductDetailCard,
  argTypes: {
    name: { control: "text" },
    description: { control: "text" },
    brand: { control: "text" },
    family: { control: "text" }
  }
};

export const Basic = ({
  name,
  description,
  brand,
  family
}: WizardProductDetailCardProp) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh"
    }}
  >
    <div style={{ width: "560px" }}>
      <WizardProductDetailCard
        name={name}
        description={description}
        brand={brand}
        family={family}
        onDeleteClick={() => {
          // no-op
        }}
      />
    </div>
  </div>
);

Basic.args = {
  name: "Thermazone Roof Insulation Boards",
  description:
    "BMI Icopal’s range of thermal insulation boards have been specifically designed to complement the range of Icopal roof waterproofing systems offering high quality and environmentally friendly solutions to all insulation requirements.",
  brand: "Roof Insulation Boards",
  family: "Icopal"
};
