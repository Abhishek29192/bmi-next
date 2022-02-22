This component consists of a list of items with an icon, a title and some content.

## Variants

### Default

```jsx
<IconList>
  <IconList.Item title="BMI Group sells to dealers, as well as professional customers.">
    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est esse itaque
    consequatur laboriosam nisi perspiciatis, excepturi eaque delectus rerum
    maxime vitae minus error ipsam suscipit totam ab voluptates accusamus quia.
  </IconList.Item>
  <IconList.Item title="BMI Group sells to dealers, as well as professional customers.">
    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
  </IconList.Item>
  <IconList.Item title="BMI Group sells to dealers, as well as professional customers.">
    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est esse itaque
    consequatur laboriosam nisi perspiciatis, excepturi eaque delectus rerum
    maxime vitae minus error ipsam suscipit totam ab voluptates accusamus quia.
  </IconList.Item>
  <IconList.Item title="BMI Group sells to dealers, as well as professional customers.">
    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
  </IconList.Item>
</IconList>
```

### Other Icon

```jsx
import UserIcon from "@material-ui/icons/Person";

<IconList>
  <IconList.Item
    icon={<UserIcon />}
    title="BMI Group sells to dealers, as well as professional customers."
  >
    Individuals are asked to contact their local retailer for sales and
    advertising inquiries.
  </IconList.Item>
</IconList>;
```

### Compact list items

```jsx
import CheckIcon from "@material-ui/icons/Check";
const BlueCheckIcon = <CheckIcon style={{ color: "#009fe3" }} />;

<IconList>
  <IconList.Item
    isCompact
    icon={BlueCheckIcon}
    title="Lorem, ipsum dolor sit amet consectetur adipisicing elit"
  />
  <IconList.Item
    isCompact
    icon={BlueCheckIcon}
    title="Minoritetsladningsbærerdiffusjonskoeffisientmålingsapparatur"
  />
  <IconList.Item
    isCompact
    icon={BlueCheckIcon}
    title="Excepturi eaque delectus rerum maxime vitae minus error ipsam suscipit totam ab voluptates accusamus quia"
  />
</IconList>;
```
