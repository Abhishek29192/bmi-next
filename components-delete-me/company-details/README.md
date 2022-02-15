Used for displaying information about a Company, such as their website, distance, RoofPro level, etc.

Primarily intended to be the contents of a Card component. As such it doesn't contain padding around it.

Notes:

- BMI RoofPro level icons are included
- `type: content` accepts `ReactNode` for content that doesn't fit other types.

## Variants

### Default

```jsx
import { Card } from "@bmi-digital/components";

const details = [
  {
    type: "address",
    text: "full address",
    label: "Address"
  },
  {
    type: "distance",
    text: "12.56km",
    label: "Distance"
  },
  {
    type: "cta",
    text: "Get directions",
    action: { model: "htmlLink", href: "https://google.com" },
    label: "Get directions"
  },
  {
    type: "phone",
    text: "67 97 90 99",
    action: { model: "htmlLink", href: "tel:000000000000" },
    label: "Telephone"
  },
  {
    type: "email",
    text: "hello@roofingcompany.com",
    action: { model: "htmlLink", href: "mailto:hello@roofingcompany.com" },
    label: "Email"
  },
  {
    type: "website",
    text: "Visit website",
    action: { model: "htmlLink", href: "https://roofingcompany.com" },
    label: "Website"
  },
  {
    type: "content",
    label: "Type of roof",
    text: <b>Flat</b>
  },
  {
    type: "roofProLevel",
    label: "BMI RoofPro Level",
    level: "expert"
  },
  {
    type: "roofProLevel",
    label: "BMI RoofPro Level",
    level: "elite"
  },
  {
    type: "roofProLevel",
    label: "BMI RoofPro Level",
    level: "partner"
  }
];

const cardStyling = {
  padding: "20px",
  maxHeight: "100%"
};

<Card style={cardStyling}>
  <CompanyDetails name="Name of the company" details={details}>
    <p>
      Brief summary of company here in a single paragraph. Lorem ipsum dolor sit
      amet, consectetur adipiscing elit. Sed ipsum felis, viverra vel nunc
      vitae, fermentum auctor velit. Suspendisse tempor, arcu eu fermentum
      bibendum, dolor sem consectetur lacus, vitae fermentum augue.
    </p>
  </CompanyDetails>
</Card>;
```

## Scrollable content

The component's height is dynamic dependent on the content. However, if it is placed in an element which restricts its height, the content (anything below the title) becomes scrollable.

```jsx
const details = [
  {
    type: "address",
    text: "full address",
    label: "Address"
  },
  {
    type: "distance",
    text: "12.56km",
    label: "Distance"
  },
  {
    type: "cta",
    text: "Get directions",
    action: { model: "htmlLink", href: "https://google.com" },
    label: "Get directions"
  },
  {
    type: "phone",
    text: "67 97 90 99",
    action: { model: "htmlLink", href: "tel:000000000000" },
    label: "Telephone"
  },
  {
    type: "content",
    label: "Type of roof",
    text: <b>Flat</b>
  },
  {
    type: "roofProLevel",
    label: "BMI RoofPro Level",
    level: "expert"
  }
];

<div style={{ height: 300 }}>
  <CompanyDetails name="Name of the company" details={details}>
    <p>
      Brief summary of company here in a single paragraph. Lorem ipsum dolor sit
      amet, consectetur adipiscing elit. Sed ipsum felis, viverra vel nunc
      vitae, fermentum auctor velit. Suspendisse tempor, arcu eu fermentum
      bibendum, dolor sem consectetur lacus, vitae fermentum augue.
    </p>
  </CompanyDetails>
</div>;
```
