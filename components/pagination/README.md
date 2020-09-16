This component wraps the [Material-UI Pagination component](https://material-ui.com/components/pagination/), with a few changes from the [BMI Styleguide](https://xd.adobe.com/view/bfa83643-3e75-4a60-b8f4-f9f00b5fc8f1-eafb/screen/8fabd66f-8cf1-4ce6-a2b6-4245e9f9689b/).

## Variants

## Normal size

Normal size means there is enough space to put 11 items in a single row, including all the arrow buttons.

### with less than 10 pages

```jsx
import { useState } from "react";

const [page, setPage] = useState(1);

<Pagination
  page={page}
  onChange={(_, page) => {
    setPage(page);
  }}
  count={9}
/>;
```

### with more or equal to than 10 pages

If not all pages can be shown in a single row, then `go to first` and `go to last` double arrow buttons will be shown.

```jsx
import { useState } from "react";

const [page, setPage] = useState(1);

<Pagination
  page={page}
  onChange={(_, page) => {
    setPage(page);
  }}
  count={10}
/>;
```

## Reduced size

### Only have space for 2 items

```jsx
import { useState } from "react";

const [page, setPage] = useState(1);
<div style={{ width: "96px" }}>
  <Pagination
    page={page}
    onChange={(_, page) => {
      setPage(page);
    }}
    count={10}
  />
</div>;
```

### Only have space for 3 to 4 items

```jsx
import { useState } from "react";

const [page, setPage] = useState(4);
<div style={{ width: "144px" }}>
  <Pagination
    page={page}
    onChange={(_, page) => {
      setPage(page);
    }}
    count={10}
  />
</div>;
```

### Only have space for n items while n < 11

```jsx
import { useState } from "react";

const [page, setPage] = useState(4);
<div style={{ width: "336px" }}>
  <Pagination
    page={page}
    onChange={(_, page) => {
      setPage(page);
    }}
    count={10}
  />
</div>;
```

### Only have space for n items while n < 11 and all page numbers can be shown in a single row

```jsx
import { useState } from "react";

const [page, setPage] = useState(1);
<div style={{ width: "336px" }}>
  <Pagination
    page={page}
    onChange={(_, page) => {
      setPage(page);
    }}
    count={5}
  />
</div>;
```
