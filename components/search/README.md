A search widget.

## Variants

### Default

```jsx
<Search />
```

### Custom labels

```jsx
<Search label="Find" placeholder="Find something..." />
```

### Pre-filled default value

```jsx
<Search defaultValue="Clay tiles" />
```

### Controlled component

```jsx
import { useState } from "react";

const [value, setValue] = useState("");

const handleChange = (value) => {
  console.log("Change", { value });
  setValue(value);
};

<Search value={value} onChange={handleChange} />;
```
