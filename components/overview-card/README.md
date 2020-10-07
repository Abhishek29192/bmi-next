A card component displaying an overview of a product. The card is not clickable but items inside the card and the footer can optionally be. Title can be `h4` (optionally underlined) or `h6` variations, the brand logo and header image are also optional.

## Variants

### Default

```jsx
import Button from "@bmi/button";
import demoHouseImage from "./images/demo-tiles.jpg";
import brandLogo from "@bmi/logo/svgs/AeroDek.svg";

<OverviewCard
  title="Unde Mmnis Iste"
  imageSource={demoHouseImage}
  brandImageSource={brandLogo}
  hasTitleUnderline
  footer={<Button variant="outlined">Go to this</Button>}
>
  <p>
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
  </p>
</OverviewCard>;
```

### No Image

```jsx
import Button from "@bmi/button";
import brandLogo from "@bmi/logo/svgs/AeroDek.svg";

<OverviewCard
  title="Unde Mmnis Iste"
  brandImageSource={brandLogo}
  hasTitleUnderline
  footer={<Button variant="outlined">Go to this</Button>}
>
  <p>
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
  </p>
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
  <p>
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
  </p>
</OverviewCard>;
```

### No Footer

```jsx
import demoHouseImage from "./images/demo-tiles.jpg";
import brandLogo from "@bmi/logo/svgs/AeroDek.svg";

<OverviewCard
  title="Unde Mmnis Iste"
  titleVariant="h4"
  imageSource={demoHouseImage}
  brandImageSource={brandLogo}
  hasTitleUnderline
>
  <p>
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
  </p>
</OverviewCard>;
```

### Small Title

```jsx
import Button from "@bmi/button";
import demoHouseImage from "./images/demo-tiles.jpg";
import brandLogo from "@bmi/logo/svgs/AeroDek.svg";

<OverviewCard
  title="Unde Mmnis Iste"
  titleVariant="h6"
  imageSource={demoHouseImage}
  brandImageSource={brandLogo}
  footer={<Button variant="outlined">Go to this</Button>}
>
  <p>
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
  </p>
</OverviewCard>;
```

### Flattened (news summary card)

```jsx
import Button from "@bmi/button";
import demoHouseImage from "./images/demo-tiles.jpg";
import brandLogo from "@bmi/logo/svgs/AeroDek.svg";

<OverviewCard
  title="Unde Mmnis Iste"
  imageSource={demoHouseImage}
  footer={<Button variant="outlined">Go to this</Button>}
  isFlat
>
  <p>
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
  </p>
</OverviewCard>;
```
