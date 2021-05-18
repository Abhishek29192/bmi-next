Pitched Roof Calculator, part of WebTools.

## Variants

### English

```jsx
import MicroCopy from "@bmi/micro-copy";
import en from "./src/samples/copy/en.json";

<MicroCopy.Provider values={en}>
  <PitchedRoofCalculator
    isDebugging
    onAnalyticsEvent={(event) => console.log("Analytics Event:", event)}
  />
</MicroCopy.Provider>;
```

### Norwegian

```jsx
import MicroCopy from "@bmi/micro-copy";
import no from "./src/samples/copy/no.json";

<MicroCopy.Provider values={no}>
  <PitchedRoofCalculator
    isDebugging
    onAnalyticsEvent={(event) => console.log("Analytics Event:", event)}
  />
</MicroCopy.Provider>;
```
