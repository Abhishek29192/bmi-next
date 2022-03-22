Location cards are not tappable, but (optionally) contain flat link buttons which are.

These cards have 30px visible padding on all sides which is reduced to 20px for tablets and mobile where real estate is reduced. Furthermore, icons are included to assist quick scanning of the cards, but these are removed on tablet and mobile layouts to save space in the cards.

## Variants

### Default

```jsx
const details = [
  {
    type: "address",
    text: "37°14′0″N 115°48′30″W",
    label: "Address"
  },
  {
    type: "phone",
    text: "000000000000",
    action: { model: "htmlLink", href: "tel:000000000000" },
    label: "Telephone"
  },
  {
    type: "email",
    text: "area@51.space",
    action: { model: "htmlLink", href: "email:area@51.space" },
    label: "Email"
  }
];

<LocationCard
  title="Area 51"
  details={details}
  footNote="Monday - Friday, 9:00 - 17:00"
/>;
```
