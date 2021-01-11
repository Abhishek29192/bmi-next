A simple component for configuring the various steps in a Calculator.

## Variants

### Default

```jsx
import TextField from "@bmi/text-field";

const SelectingARoof = () => {
  return (
    <div>
      <p>Placeholder: Selecting a Roof Shape component.</p>
    </div>
  );
};

const EnterDimensions = () => {
  return (
    <div>
      <p>Placeholder: Enter Dimensions component.</p>
    </div>
  );
};

const SelectATile = () => {
  return (
    <div>
      <p>Placeholder: Select a tile component.</p>
    </div>
  );
};

const SelectATileColour = () => {
  return (
    <div>
      <p>Placeholder: Select your tile colour component.</p>
    </div>
  );
};

const TileOptionsAndAccessories = () => {
  return (
    <div>
      <p>Placeholder: Tile options and accessories component.</p>
    </div>
  );
};

const SelectUnderlay = () => {
  return (
    <div>
      <p>Placeholder: Now, select the underlay component.</p>
    </div>
  );
};

const SelectGutteringOptions = () => {
  return (
    <div>
      <p>Placeholder: Now, choose your guttering options component.</p>
    </div>
  );
};

const YourSolutionContains = () => {
  return (
    <div>
      <p>Placeholder: Your Solution Contains component.</p>
    </div>
  );
};

const onSubmit = (event, values) => {
  event.preventDefault();
  console.log("submit event", event, values);
};

<CalculatorStepper selected="enter-dimensions">
  <CalculatorStepper.Step
    value="choose-a-roof-type"
    title="Choose your roof type"
    subtitle="Get started by letting us know the roof shape that most closely resembles your roof"
  >
    <SelectingARoof />
  </CalculatorStepper.Step>
  <CalculatorStepper.Step
    value="enter-dimensions"
    title="Enter dimensions"
    subtitle="Enter these measurements, to help us find the total area of the roof"
    backButtonLabel="Go Back"
    backButtonOnClick={console.log}
    nextLabel="Proceed to tile selection"
    nextButtonOnClick={onSubmit}
  >
    <TextField name="enter dimensions" variant="outlined" />
    <EnterDimensions />
  </CalculatorStepper.Step>
  <CalculatorStepper.Step
    value="select-a-tile"
    title="Select a tile"
    subtitle="You can now choose from different roofing tiles. In the next step you can select the tile colour."
    backButtonLabel="Go Back"
    backButtonOnClick={console.log}
  >
    <SelectATile />
  </CalculatorStepper.Step>
  <CalculatorStepper.Step
    value="select-a-tile-colour"
    title="Select your tile colour"
    subtitle="These are the tile colour options available for the chosen product range."
    backButtonLabel="Go Back"
    backButtonOnClick={console.log}
  >
    <SelectATileColour />
  </CalculatorStepper.Step>
  <CalculatorStepper.Step
    value="tile-accessories"
    title="Tile options and accessories"
    subtitle="Here you can choose more tile options and accessories."
    backButtonLabel="Go Back"
    backButtonOnClick={console.log}
    nextLabel="Proceed to select underlay"
    nextButtonOnClick={console.log}
  >
    <TileOptionsAndAccessories />
  </CalculatorStepper.Step>
  <CalculatorStepper.Step
    value="select-underlay"
    title="Now, select the underlay"
    subtitle="These are the available options for your tile product selection.  You can remove your underlay later, if required."
    backButtonLabel="Go Back"
    backButtonOnClick={console.log}
    nextLabel="Proceed to guttering"
    nextButtonOnClick={console.log}
  >
    <SelectUnderlay />
  </CalculatorStepper.Step>
  <CalculatorStepper.Step
    value="choose-guttering"
    title="Now, choose your guttering options"
    subtitle="Choose the available guttering option. Skip this step if you don't want to add guttering to the estimation."
    backButtonLabel="Go Back"
    backButtonOnClick={console.log}
    linkLabel="Skip guttering and calculate products"
    linkOnClick={console.log}
    nextLabel="Calculate products"
    nextButtonOnClick={console.log}
  >
    <SelectGutteringOptions />
  </CalculatorStepper.Step>
  <CalculatorStepper.Step
    value="your-solution-contains"
    title="Your solution contains"
    subtitle="Disclaimer: We strive to be within 5-10% accurate. We've also added a wastage contingency of: X% into this material calculation"
    displayComputation="For the total measured area for your roof: 5000m2."
    backButtonLabel="Go back"
    backButtonOnClick={console.log}
    nextLabel="Start over"
    nextButtonOnClick={console.log}
  >
    <YourSolutionContains />
  </CalculatorStepper.Step>
</CalculatorStepper>;
```
