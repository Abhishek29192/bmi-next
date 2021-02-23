import React, { useState } from "react";
import Button from "@bmi/button";
import CalculatorModal from "@bmi/calculator-modal";
import CalculatorStepper from "@bmi/calculator-stepper";
import RoofDimensions from "./_RoofDimensions";

const PitchedRoofCalculator = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<
    "enter-dimensions" | "your-solution-contains"
  >("enter-dimensions");
  const [dimensions, setDimensions] = useState({});

  const calculate = (e, values) => {
    e.preventDefault();
    setDimensions(values);
    setSelected("your-solution-contains");
  };
  return (
    <>
      <Button
        onClick={() => {
          setSelected("enter-dimensions");
          setDimensions({});
          setOpen(true);
        }}
      >
        Open modal
      </Button>
      <CalculatorModal
        pearl={selected !== "your-solution-contains"}
        open={open}
        onCloseClick={() => setOpen(false)}
      >
        <CalculatorStepper selected={selected}>
          <CalculatorStepper.Step
            key="enter-dimensions"
            title="Enter dimensions"
            subtitle="Enter these measurements, to help us find the total area of the roof"
            nextLabel="Calculate products"
            nextButtonOnClick={calculate}
          >
            <RoofDimensions dimensions={dimensions} />
          </CalculatorStepper.Step>
          <CalculatorStepper.Step
            key="your-solution-contains"
            title="Your solution contains"
            subtitle="Disclaimer: We strive to be within 5-10% accurate. We've also added a wastage contingency of: X% into this material calculation"
            paragraph="For the total measured area for your roof: 5000m2."
            backLabel="Go back"
            backButtonOnClick={() => setSelected("enter-dimensions")}
          >
            <span>Placeholder for the basket component</span>
          </CalculatorStepper.Step>
        </CalculatorStepper>
      </CalculatorModal>
    </>
  );
};

export default PitchedRoofCalculator;
