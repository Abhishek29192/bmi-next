An integration component that sits at the end of the Roofing Calculator journey that visualises the selected products the user will/can purchase.

## Variants

### Default

```jsx
import tileBrown from "./images/tile-brown.jpg";
import React, { useState } from "react";
import Button from "@bmi/button";
import CalculatorModal from "@bmi/calculator-modal";

const rowsTemplate = [
  {
    image: tileBrown,
    description: "Lorem ipsum dolor sit amet memento mori",
    externalProductCode: "123456789",
    packSize: "22 x 42",
    quantity: 43
  },
  {
    image: tileBrown,
    description: "Lorem ipsum dolor sit amet memento mori",
    externalProductCode: "123456789",
    packSize: "22 x 42",
    quantity: 43
  },
  {
    image: tileBrown,
    description: "Lorem ipsum dolor sit amet memento mori",
    externalProductCode: "123456789",
    packSize: "22 x 42",
    quantity: 43
  },
  {
    image: tileBrown,
    description: "Lorem ipsum dolor sit amet memento mori",
    externalProductCode: "123456789",
    packSize: "22 x 42",
    quantity: 43
  },
  {
    image: tileBrown,
    description: "Lorem ipsum dolor sit amet memento mori",
    externalProductCode: "123456789",
    packSize: "22 x 42",
    quantity: 43
  }
];

const [rows, setRows] = useState(rowsTemplate);
const onDelete = (nobbNumber) => {
  setRows(
    rows.filter(
      (row, iterator) =>
        iterator !== rows.findIndex((element) => element.nobb === nobbNumber)
    )
  );
};
const [open, setOpen] = React.useState(false);

<>
  <Button onClick={() => setOpen(true)}>Open Quantity Table</Button>
  <CalculatorModal
    open={open}
    onCloseClick={() => setOpen(false)}
    headerCenter="Some rather lengthy, extremely verbose, Central Content in the header"
    backdropProps={{
      className: "test-backdrop"
    }}
  >
    <QuantityTable
      onDelete={(value) => onDelete(value)}
      onChangeQuantity={(nobb, value) => console.log("enter ", nobb, value)}
      rows={rows}
      {...{
        title: "Product",
        packSize: "Pack size",
        externalProductCode: "Nobb no",
        quantity: "Quantity",
        remove: "Remove"
      }}
    />
  </CalculatorModal>
</>;
```
