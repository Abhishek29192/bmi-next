import React from "react";
import Button from "@bmi/button";
import LeadBlock from "@bmi/lead-block";
import Icon from "@bmi/icon";
import IconList from "@bmi/icon-list";
import Tabs from "@bmi/tabs";
import Table from "@bmi/table";
import Typography from "@bmi/typography";
import CheckIcon from "@material-ui/icons/Check";
import styles from "./styles/ProductLeadBlock.module.scss";

const BlueCheckIcon = <Icon source={CheckIcon} style={{ color: "#009fe3" }} />;

const ProductLeadBlock = () => {
  return (
    <div className={styles["ProductLeadBlock"]}>
      <Tabs initialValue="one">
        <Tabs.TabPanel heading="About" index="one">
          <LeadBlock>
            <LeadBlock.Content>
              <LeadBlock.Content.Section>
                <Typography>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut labore et dolore magna
                  aliquyam erat, sed diam voluptua. At vero eos et accusam et
                  justo duo dolores et ea rebum. Stet clita kasd gubergren.
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut labore et dolore.
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
                    >
                      Lorem ipsum
                    </IconList.Item>
                    <IconList.Item
                      icon={BlueCheckIcon}
                      title="Lorem ipsum dolor sit amet"
                    >
                      Lorem ipsum
                    </IconList.Item>
                  </IconList>
                </LeadBlock.Card.Content>
              </LeadBlock.Card.Section>
              <LeadBlock.Card.Section>
                <LeadBlock.Card.Heading variant="h5">
                  Heading 2
                </LeadBlock.Card.Heading>
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
          </LeadBlock>
        </Tabs.TabPanel>
        <Tabs.TabPanel heading="Technical specifications" index="two">
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
            <LeadBlock.Card theme="blue-900">
              <LeadBlock.Card.Section>
                <LeadBlock.Card.Heading hasUnderline>
                  Heading 1
                </LeadBlock.Card.Heading>
                <LeadBlock.Card.Content>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Phasellus ut egestas risus. Fusce elementum nisi elementum
                    dui vehicula, vitae fermentum velit egestas.
                  </Typography>
                </LeadBlock.Card.Content>
                <LeadBlock.Card.Action>
                  <Button hasDarkBackground variant="outlined">
                    Caption
                  </Button>
                </LeadBlock.Card.Action>
              </LeadBlock.Card.Section>
              <LeadBlock.Card.Section>
                <LeadBlock.Card.Heading hasUnderline>
                  Heading 2
                </LeadBlock.Card.Heading>
                <LeadBlock.Card.Content>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Phasellus ut egestas risus. Fusce elementum nisi elementum
                    dui vehicula, vitae fermentum velit egestas.
                  </Typography>
                </LeadBlock.Card.Content>
                <LeadBlock.Card.Action>
                  <Typography>
                    <Button hasDarkBackground variant="outlined">
                      Caption
                    </Button>
                  </Typography>
                </LeadBlock.Card.Action>
              </LeadBlock.Card.Section>
            </LeadBlock.Card>
          </LeadBlock>
        </Tabs.TabPanel>
      </Tabs>
    </div>
  );
};

export default ProductLeadBlock;
