Link Cards are used like rows in a table.
See the Service Locator for usage contex

## Variants

```jsx
import { useState } from "react";

const [selectStatus, setSelectStatus] = useState("");
const resetRadio = () => setSelectStatus("");

<>
  <LinkCard
    onClick={() => setSelectStatus("one")}
    onCloseClick={resetRadio}
    isOpen={selectStatus === "one"}
    title="Consolvo AS"
    subtitle="Ringveien 6, 3409 Tranby, Norge"
  >
    full company information full company information full company information
  </LinkCard>
  <LinkCard
    onClick={() => setSelectStatus("two")}
    onCloseClick={resetRadio}
    isOpen={selectStatus === "two"}
    title="Eidsvoll tak & Håndverkstjenester AS"
    subtitle="Industrivegen 74, 2072 DAL, Norge"
  >
    full company information full company information full company information
  </LinkCard>
  <LinkCard
    onClick={() => setSelectStatus("three")}
    onCloseClick={resetRadio}
    isOpen={selectStatus === "three"}
    title="Consolvo AS"
    subtitle="Ringveien 6, 3409 Tranby, Norge"
  >
    full company information full company information full company information
  </LinkCard>
  <LinkCard
    onClick={() => setSelectStatus("four")}
    onCloseClick={resetRadio}
    isOpen={selectStatus === "four"}
    title="Eidsvoll tak & Håndverkstjenester AS"
    subtitle="Industrivegen 74, 2072 DAL, Norge"
  >
    full company information full company information full company information
  </LinkCard>
</>;
```
