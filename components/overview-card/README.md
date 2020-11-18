A card component displaying an overview of a product. The card is not clickable but items inside the card and the footer can optionally be. Title can be `h4` (optionally underlined) or `h6` variations, the brand logo and header image are also optional.

## Variants

### Default

```jsx
import Button from "@bmi/button";
import demoHouseImage from "./images/demo-tiles.jpg";
import { AeroDek as brandLogo } from "@bmi/logo";

<OverviewCard
  title="Unde Mmnis Iste"
  imageSource={demoHouseImage}
  brandImageSource={brandLogo}
  hasTitleUnderline
  footer={<Button variant="outlined">Go to this</Button>}
>
  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
</OverviewCard>;
```

### No Image

```jsx
import Button from "@bmi/button";
import { AeroDek as brandLogo } from "@bmi/logo";

<OverviewCard
  title="Unde Mmnis Iste"
  brandImageSource={brandLogo}
  hasTitleUnderline
  footer={<Button variant="outlined">Go to this</Button>}
>
  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
</OverviewCard>;
```

### No Brand Logo

```jsx
import Button from "@bmi/button";
import demoHouseImage from "./images/demo-tiles.jpg";

<OverviewCard
  title="Unde Mmnis Iste"
  imageSource={demoHouseImage}
  hasTitleUnderline
  footer={<Button variant="outlined">Go to this</Button>}
>
  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
</OverviewCard>;
```

### No Footer

```jsx
import demoHouseImage from "./images/demo-tiles.jpg";
import { AeroDek as brandLogo } from "@bmi/logo";

<OverviewCard
  title="Unde Mmnis Iste"
  titleVariant="h4"
  imageSource={demoHouseImage}
  brandImageSource={brandLogo}
  hasTitleUnderline
>
  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
</OverviewCard>;
```

### Small Title

```jsx
import Button from "@bmi/button";
import demoHouseImage from "./images/demo-tiles.jpg";
import { AeroDek as brandLogo } from "@bmi/logo";

<OverviewCard
  title="Unde Mmnis Iste"
  titleVariant="h6"
  imageSource={demoHouseImage}
  brandImageSource={brandLogo}
  footer={<Button variant="outlined">Go to this</Button>}
>
  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
</OverviewCard>;
```

### Medium Title (h5) and subtitle (Related Product Card)

```jsx
import AnchorLink from "@bmi/anchor-link";
import demoHouseImage from "./images/demo-tiles.jpg";
import { AeroDek as brandLogo } from "@bmi/logo";

<OverviewCard
  title="Unde Mmnis Iste"
  titleVariant="h5"
  subtitle="Lorem ipsum sit dolor amet"
  subtitleVariant="h6"
  imageSource={demoHouseImage}
  brandImageSource={brandLogo}
  footer={<AnchorLink iconEnd>Go to this</AnchorLink>}
>
  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
</OverviewCard>;
```

### Flattened (News Summary Card)

```jsx
import Button from "@bmi/button";
import demoHouseImage from "./images/demo-tiles.jpg";
import { AeroDek as brandLogo } from "@bmi/logo";

<OverviewCard
  title="Unde Mmnis Iste"
  imageSource={demoHouseImage}
  brandImageSource={brandLogo}
  footer={<Button variant="outlined">Go to this</Button>}
  isFlat
>
  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
</OverviewCard>;
```
