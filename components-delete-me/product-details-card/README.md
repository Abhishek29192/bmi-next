A simple card component to display details of a product. Only the action prop is optional.

## Variants

### Default

```jsx
import demoProduct from "./images/demo-product.png";
import { AeroDek as brandLogo } from "@bmi-digital/components/logo";

<ProductDetailsCard
  media={<img src={demoProduct} alt="Lorem ipsum" />}
  brandLogo={brandLogo}
  title="Sed ut perspiciatis"
  nnob="09174907099"
  linkLabel="Sit voluptatem"
/>;
```

### Deprecated `imageSource`

This is going to be deprecated in `0.2.0`. Please use one of the examples above instead.

```jsx
import demoProduct from "./images/demo-product.png";
import { AeroDek as brandLogo } from "@bmi-digital/components/logo";

<ProductDetailsCard
  imageSource={demoProduct}
  brandLogo={brandLogo}
  title="Sed ut perspiciatis"
  nnob="09174907099"
  linkLabel="Sit voluptatem"
/>;
```
