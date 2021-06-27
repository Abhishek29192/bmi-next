Pitched Roof Calculator, part of WebTools.

## Variants

### English

```jsx
import MicroCopy from "@bmi/micro-copy";
import Button from "@bmi/button";
import data from "./src/samples/data.json";
import en from "./src/samples/copy/en.json";

const [isOpen, setIsOpen] = React.useState(false);

<MicroCopy.Provider values={en}>
  <Button onClick={() => setIsOpen(true)}>
    <MicroCopy path={"roofSelection.title"} />
  </Button>
  <PitchedRoofCalculator
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    isDebugging
    onAnalyticsEvent={(event) => console.log("Analytics Event:", event)}
    getData={() => data}
    sendEmailAddress={async (values) => {
      console.log("Collecting email address:", sendEmailAddress);
    }}
  />
</MicroCopy.Provider>;
```

### Norwegian

```jsx
import MicroCopy from "@bmi/micro-copy";
import Button from "@bmi/button";
import data from "./src/samples/data.json";
import no from "./src/samples/copy/no.json";

const [isOpen, setIsOpen] = React.useState(false);

<MicroCopy.Provider values={no}>
  <Button onClick={() => setIsOpen(true)}>
    <MicroCopy path={"roofSelection.title"} />
  </Button>
  <PitchedRoofCalculator
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    isDebugging
    onAnalyticsEvent={(event) => console.log("Analytics Event:", event)}
    getData={() => data}
    sendEmailAddress={async (values) => {
      console.log("Collecting email address:", sendEmailAddress);
    }}
  />
</MicroCopy.Provider>;
```
