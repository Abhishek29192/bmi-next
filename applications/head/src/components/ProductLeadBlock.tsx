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

type Props = {
  description?: string;
  keyFeatures?: readonly string[];
  technicalSpecifications?: {
    name: string;
    value: string;
  }[];
};

const ProductLeadBlock = ({
  description,
  keyFeatures,
  technicalSpecifications
}: Props) => {
  return (
    <div className={styles["ProductLeadBlock"]}>
      <Tabs initialValue="one">
        <Tabs.TabPanel heading="About" index="one">
          <LeadBlock>
            <LeadBlock.Content>
              <LeadBlock.Content.Section>
                <Typography
                  component="div"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </LeadBlock.Content.Section>
              <LeadBlock.Content.Section>
                <LeadBlock.Content.Heading>
                  Guarantees and warranties
                </LeadBlock.Content.Heading>
                <Typography>-</Typography>
              </LeadBlock.Content.Section>
              <LeadBlock.Content.Section>
                <LeadBlock.Content.Heading>
                  Awards and certificates
                </LeadBlock.Content.Heading>
                <Typography>-</Typography>
              </LeadBlock.Content.Section>
            </LeadBlock.Content>
            <LeadBlock.Card theme="blue-900">
              {keyFeatures ? (
                <LeadBlock.Card.Section>
                  <LeadBlock.Card.Heading>Key features</LeadBlock.Card.Heading>
                  <LeadBlock.Card.Content>
                    <IconList>
                      {keyFeatures.map((feature, index) => (
                        <IconList.Item
                          key={index}
                          icon={BlueCheckIcon}
                          title={feature}
                        />
                      ))}
                    </IconList>
                  </LeadBlock.Card.Content>
                </LeadBlock.Card.Section>
              ) : null}
              <LeadBlock.Card.Section>
                <LeadBlock.Card.Heading variant="h5">
                  Ordering
                </LeadBlock.Card.Heading>
                <LeadBlock.Card.Content>
                  <Typography>
                    Ready to buy? Have a question about this product?
                  </Typography>
                </LeadBlock.Card.Content>
                <LeadBlock.Card.Action>
                  <Button hasDarkBackground variant="outlined">
                    Find a stockist
                  </Button>
                </LeadBlock.Card.Action>
              </LeadBlock.Card.Section>
            </LeadBlock.Card>
          </LeadBlock>
        </Tabs.TabPanel>
        <Tabs.TabPanel heading="Technical specifications" index="two">
          <LeadBlock>
            <LeadBlock.Content>
              {technicalSpecifications && technicalSpecifications.length ? (
                <Table hasNoBorder>
                  <Table.Body>
                    {technicalSpecifications.map(({ name, value }, index) => (
                      <Table.Row key={`technical-specification-${index}`}>
                        <Table.Cell>{name}</Table.Cell>
                        <Table.Cell>{value}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              ) : (
                "No technical specifications found for this product."
              )}
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
