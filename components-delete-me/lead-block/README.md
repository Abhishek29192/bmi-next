The Lead Block generally appears at the top of the page, below the header and hero. It includes a copy area on the left which can contain a range of elements, and a Post-it Card on the right-hand side or at the bottom when stacked. [BMI Stylegudie](https://xd.adobe.com/view/3b7e667d-5f7e-4894-9754-dab28ef3dd4d-6e2d/screen/d0bbb339-d1c0-4b20-99ae-5b209751400a/specs/)

## Variants

### Default

```jsx
import { Button } from "@bmi-digital/components";
import { IconList } from "@bmi-digital/components";
import CheckIcon from "@material-ui/icons/Check";
import { Typography } from "@bmi-digital/components";
import { Icon } from "@bmi-digital/components";

const BlueCheckIcon = <Icon source={CheckIcon} style={{ color: "#009fe3" }} />;

<LeadBlock>
  <LeadBlock.Content>
    <LeadBlock.Content.Section>
      <Typography>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren. Lorem ipsum dolor sit amet, consetetur sadipscing
        elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.
      </Typography>
    </LeadBlock.Content.Section>
    <LeadBlock.Content.Section>
      <LeadBlock.Content.Heading>
        Guarantees and warranties
      </LeadBlock.Content.Heading>
      <Typography>Ipsum</Typography>
    </LeadBlock.Content.Section>
    <LeadBlock.Content.Section>
      <LeadBlock.Content.Heading>
        Awards and certificates
      </LeadBlock.Content.Heading>
      <Typography>Ipsum</Typography>
    </LeadBlock.Content.Section>
  </LeadBlock.Content>
  <LeadBlock.Card theme="blue-900">
    <LeadBlock.Card.Section>
      <LeadBlock.Card.Heading>Heading 1</LeadBlock.Card.Heading>
      <LeadBlock.Card.Content>
        <IconList>
          <IconList.Item
            icon={BlueCheckIcon}
            title="Lorem ipsum dolor sit amet"
          ></IconList.Item>
          <IconList.Item
            icon={BlueCheckIcon}
            title="Lorem ipsum dolor sit amet"
          ></IconList.Item>
        </IconList>
      </LeadBlock.Card.Content>
    </LeadBlock.Card.Section>
    <LeadBlock.Card.Section>
      <LeadBlock.Card.Heading variant="h5">Heading 2</LeadBlock.Card.Heading>
      <LeadBlock.Card.Content>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Typography>
      </LeadBlock.Card.Content>
      <LeadBlock.Card.Action>
        <Button hasDarkBackground variant="outlined">
          Caption
        </Button>
      </LeadBlock.Card.Action>
    </LeadBlock.Card.Section>
  </LeadBlock.Card>
</LeadBlock>;
```

### With other component in copy area

```jsx
import { Button } from "@bmi-digital/components";
import { IconList } from "@bmi-digital/components";
import CheckIcon from "@material-ui/icons/Check";
import { Typography } from "@bmi-digital/components";
import { Table } from "@bmi-digital/components";
import { AnchorLink } from "@bmi-digital/components";

<LeadBlock>
  <LeadBlock.Content>
    <Table hasNoBorder>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Lorem</Table.Cell>
          <Table.Cell>ipsum</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Lorem</Table.Cell>
          <Table.Cell>ipsum</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Lorem</Table.Cell>
          <Table.Cell>ipsum</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Lorem</Table.Cell>
          <Table.Cell>ipsum</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Lorem</Table.Cell>
          <Table.Cell>ipsum</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Lorem</Table.Cell>
          <Table.Cell>ipsum</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Lorem</Table.Cell>
          <Table.Cell>ipsum</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </LeadBlock.Content>
  <LeadBlock.Card>
    <LeadBlock.Card.Section>
      <LeadBlock.Card.Heading hasUnderline>Heading 1</LeadBlock.Card.Heading>
      <LeadBlock.Card.Content>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ut
          egestas risus. Fusce elementum nisi elementum dui vehicula, vitae
          fermentum velit egestas.
        </Typography>
      </LeadBlock.Card.Content>
      <LeadBlock.Card.Action>
        <Button>Caption</Button>
      </LeadBlock.Card.Action>
    </LeadBlock.Card.Section>
    <LeadBlock.Card.Section>
      <LeadBlock.Card.Heading hasUnderline>Heading 2</LeadBlock.Card.Heading>
      <LeadBlock.Card.Content>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ut
          egestas risus. Fusce elementum nisi elementum dui vehicula, vitae
          fermentum velit egestas.
        </Typography>
      </LeadBlock.Card.Content>
      <LeadBlock.Card.Action>
        <Typography>
          <AnchorLink action={{ model: "htmlLink", href: "/" }}>
            Call to action link
          </AnchorLink>
        </Typography>
      </LeadBlock.Card.Action>
    </LeadBlock.Card.Section>
  </LeadBlock.Card>
</LeadBlock>;
```
