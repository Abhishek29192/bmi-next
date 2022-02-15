A Card with multiple sections and each section contains a title, content and call to action block.

## Variants

### Default

```jsx
import { Typography } from "@bmi-digital/components";
import { Button } from "@bmi-digital/components";
import { AnchorLink } from "@bmi-digital/components";

<PostItCard>
  <PostItCard.Section>
    <PostItCard.Heading hasUnderline>Heading 1</PostItCard.Heading>
    <PostItCard.Content>
      <Typography>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ut
        egestas risus. Fusce elementum nisi elementum dui vehicula, vitae
        fermentum velit egestas.
      </Typography>
    </PostItCard.Content>
    <PostItCard.Action>
      <Button>Caption</Button>
    </PostItCard.Action>
  </PostItCard.Section>
  <PostItCard.Section>
    <PostItCard.Heading hasUnderline>Heading 2</PostItCard.Heading>
    <PostItCard.Content>
      <Typography>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ut
        egestas risus. Fusce elementum nisi elementum dui vehicula, vitae
        fermentum velit egestas.
      </Typography>
    </PostItCard.Content>
    <PostItCard.Action>
      <Typography>
        <AnchorLink action={{ model: "htmlLink", href: "/" }}>
          Call to action link
        </AnchorLink>
      </Typography>
    </PostItCard.Action>
  </PostItCard.Section>
</PostItCard>;
```

### Custom ColorPair

```jsx
import { Typography } from "@bmi-digital/components";
import { Button } from "@bmi-digital/components";
import { IconList } from "@bmi-digital/components";
import CheckIcon from "@material-ui/icons/Check";

<PostItCard theme="blue-900">
  <PostItCard.Section>
    <PostItCard.Heading>Heading 1</PostItCard.Heading>
    <PostItCard.Content>
      <IconList>
        <IconList.Item
          icon={<CheckIcon />}
          title="Lorem ipsum dolor sit amet"
        ></IconList.Item>
        <IconList.Item
          icon={<CheckIcon />}
          title="Lorem ipsum dolor sit amet"
        ></IconList.Item>
      </IconList>
    </PostItCard.Content>
  </PostItCard.Section>
  <PostItCard.Section>
    <PostItCard.Heading variant="h5">Heading 2</PostItCard.Heading>
    <PostItCard.Content>
      <Typography>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Typography>
    </PostItCard.Content>
    <PostItCard.Action>
      <Button hasDarkBackground variant="outlined">
        Caption
      </Button>
    </PostItCard.Action>
  </PostItCard.Section>
</PostItCard>;
```
