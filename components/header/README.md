Main header for the site. Note that links are wrapped with `ClickableAction`.

The header must be placed in the DOM at the top of the `body`. For the demo, click the button to seat the header at the correct place in the DOM.

## Example

```jsx
import { useRef } from "react";
import Button from "@bmi/button";
import Icon from "@bmi/icon";
import { languages } from "@bmi/language-selection";
import AeroDek from "@bmi/logo/svgs/AeroDek.svg";
import Icopal from "@bmi/logo/svgs/Icopal.svg";
import Monarplan from "@bmi/logo/svgs/Monarplan.svg";
import Monier from "@bmi/logo/svgs/Monier.svg";
import Zanda from "@bmi/logo/svgs/Zanda.svg";
import { Fullscreen } from "@material-ui/icons";
import systemsImage from "./images/systems.jpg";
import Arrow from "./svgs/Arrow.svg";

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
              { label: "Metal tiles", icon: <Icon source={AeroDek} /> },
              { label: "Clay tiles", icon: <Icon source={Monier} /> },
              { label: "Concrete tiles", icon: <Icon source={Zanda} /> },
              { label: "Singles", icon: <Icon source={Icopal} /> }
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
      {
        label: [<Icon source={Arrow} />, "View all our products"],
        hasSeparator: true
      },
      { label: "Products by brand", isHeading: true },
      {
        label: <Icon source={Icopal} />,
        menu: [
          { label: <Icon source={Icopal} />, isHeading: true },
          {
            label: "Insulation",
            menu: [
              { label: "Insulation", isHeading: true },
              {
                label: "Thermazone",
                menu: [
                  { label: "Thermazone", isHeading: true },
                  { label: "Thermazone touch-on" }
                ]
              }
            ]
          }
        ]
      },
      { label: <Icon source={Zanda} />, menu: [] },
      { label: <Icon source={Monier} />, menu: [] },
      { label: <Icon source={Monarplan} />, menu: [] },
      { label: <Icon source={AeroDek} />, menu: [] }
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
      { image: systemsImage },
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

const demoArea = useRef();

const seatHeader = () => {
  document.querySelector("body").prepend(demoArea.current.firstChild);
};

<>
  <Button onClick={seatHeader} endIcon={<Fullscreen />}>
    Seat header
  </Button>
  <div
    ref={demoArea}
    style={{
      backgroundColor: "gainsboro",
      border: "2px dashed grey",
      marginTop: "1rem",
      minHeight: "1rem",
      overflow: "hidden"
    }}
  >
    <Header
      languages={languages}
      navigation={navigation}
      utilities={utilities}
    />
  </div>
</>;
```
