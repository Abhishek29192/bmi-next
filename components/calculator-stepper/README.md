A simple component for configuring the various steps in a Calculator.

## Variants

### Default

```jsx
import TextField from "@bmi/text-field";

const [selected, setSelected] = React.useState("enter-dimensions");

const EnterDimensions = () => {
  return (
    <div>
      <TextField name="enter dimensions" variant="outlined" />
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
  setSelected("your-solution-contains");
};

<CalculatorStepper selected={selected}>
  <CalculatorStepper.Step
    key="enter-dimensions"
    title="Enter dimensions"
    subtitle="Enter these measurements, to help us find the total area of the roof"
    backLabel="back"
    linkLabel="skip"
    nextLabel="next"
    nextButtonOnClick={onSubmit}
  >
    <EnterDimensions />
  </CalculatorStepper.Step>
  <CalculatorStepper.Step
    key="your-solution-contains"
    title="Your solution contains"
    subtitle="Disclaimer: We strive to be within 5-10% accurate. We've also added a wastage contingency of: X% into this material calculation"
    paragraph="For the total measured area for your roof: 5000m2."
    backLabel="Go back"
    backButtonOnClick={() => setSelected("enter-dimensions")}
  >
    <YourSolutionContains />
  </CalculatorStepper.Step>
</CalculatorStepper>;
```
