import React from "react";
import { Product } from "@bmi/intouch-api-types";
import { WizardSystemDetailCard, WizardSystemDetailCardProp } from ".";

const products = [
  { id: 1, name: "name", family: "family", brand: "brand" },
  { id: 2, name: "name", family: "family", brand: "brand" },
  { id: 3, name: "name", family: "family", brand: "brand" },
  { id: 4, name: "name", family: "family", brand: "brand" }
] as Product[];

export default {
  title: "Wizard Product Detail",
  component: WizardSystemDetailCard,
  argTypes: {
    name: { control: "text" },
    description: { control: "text" }
  }
};

export const Basic = ({ name, description }: WizardSystemDetailCardProp) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh"
    }}
  >
    <div style={{ width: "750px" }}>
      <WizardSystemDetailCard
        name={name}
        description={description}
        products={products}
        onDeleteClick={() => {
          // no-op
        }}
      />
    </div>
  </div>
);

Basic.args = {
  name: "BMI EverGuard System",
  description:
    "Room for a brief description of the system that has been chosen. Most likely to span across 1-2 lines maximum."
};
