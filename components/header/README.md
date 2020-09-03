Main header for the site.
Note that links are wrapped with `ClickableAction`.

## Example

```jsx
import AeroDek from "@bmi/logo/svgs/AeroDek.svg";
import Arrow from "./svgs/Arrow.svg";
import Icopal from "@bmi/logo/svgs/Icopal.svg";
import Monier from "@bmi/logo/svgs/Monier.svg";
import Monarplan from "@bmi/logo/svgs/Monarplan.svg";
import Zanda from "@bmi/logo/svgs/Zanda.svg";
import systemsImageSource from "./images/systems.jpg";

const utilities = [
  {
    label: "Find a stockist"
  },
  {
    label: "Find a roofer"
  },
  {
    label: "Partner portals"
  },
  {
    label: "News"
  },
  {
    label: "Contact us"
  }
];

const navigation = [
  {
    label: "Products",
    menu: [
      { label: "Products by type", isHeading: true },
      {
        label: "Roof",
        menu: [
          { label: "Roof", isHeading: true },
          {
            label: "Tiles",
            menu: [
              { label: "Tiles", isHeading: true },
              { label: "Tiles overview" },
              { label: "Metal tiles", icon: <AeroDek /> },
              { label: "Clay tiles", icon: <Monier /> },
              { label: "Concrete tiles", icon: <Zanda /> },
              { label: "Singles", icon: <Icopal /> }
            ]
          },
          {
            label: "Membranes",
            menu: [
              { label: "Membranes", isHeading: true },
              { label: "Bitumen Membranes" },
              { label: "PVC Membranes" }
            ]
          },
          {
            label: "Fall Safety",
            menu: [
              { label: "Fall Safety", isHeading: true },
              { label: "Safety Product 1" },
              { label: "Safety Product 2" },
              { label: "Safety Product 3" }
            ]
          },
          {
            label: "Underlays",
            menu: [
              { label: "Underlays", isHeading: true },
              { label: "Diffusion Light" },
              { label: "Diffusion Open" }
            ]
          },
          { label: "Turf Roofs" },
          { label: "Wind Barriers" },
          { label: "Vapour Barriers" },
          { label: "Guttering" },
          { label: "Fittings (Beslag)" },
          { label: "Roof Safety" },
          { label: "Tape" },
          { label: "Tightening Products" }
        ]
      },
      { label: "Wall" },
      { label: "Floor" },
      { label: "Foundation" },
      { label: "Outdoor" },
      { label: "Scaffolding" },
      { label: "Civil Engineering", hasSeparator: true },
      { label: [<Arrow />, "View all our products"], hasSeparator: true },
      { label: "Products by brand", isHeading: true },
      { label: <Icopal />, menu: [] },
      { label: <Zanda />, menu: [] },
      { label: <Monier />, menu: [] },
      { label: <Monarplan />, menu: [] },
      { label: <AeroDek />, menu: [] }
    ],
    footer: [{ label: "For Homeowners", isHeading: true }]
  },
  {
    label: "Systems",
    menu: [
      { label: "Systems by Type", isHeading: true },
      { label: "Pitched Roof Systems" },
      { label: "Flat Roof Systems" },
      { label: "Tightning Systems" }
    ],
    footer: [
      { image: systemsImageSource },
      { label: "Design your own System", isHeading: true },
      {
        label:
          "Creating your own system is easier than ever using BMI's expertise and know-how of residential, commercial and industrial roofing systems.",
        isParagraph: true
      }
    ]
  },
  {
    label: "Our Brands",
    menu: [{ label: "Our Systems" }]
  },
  {
    label: "Tips and Advice"
  },
  {
    label: "Support"
  },
  {
    label: "Documentation"
  },
  {
    label: "Sustainability"
  }
];

<Header utilities={utilities} navigation={navigation} />;
```
