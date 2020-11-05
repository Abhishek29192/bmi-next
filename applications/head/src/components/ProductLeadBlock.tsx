import React from "react";
import Button from "@bmi/button";
import LeadBlock from "@bmi/lead-block";
import Icon from "@bmi/icon";
import IconList from "@bmi/icon-list";
import Tabs from "@bmi/tabs";
import Table from "@bmi/table";
import Typography from "@bmi/typography";
import CheckIcon from "@material-ui/icons/Check";
import RichText from "./RichText";
import { Document } from "@contentful/rich-text-types";
import styles from "./styles/ProductLeadBlock.module.scss";

const BlueCheckIcon = <Icon source={CheckIcon} style={{ color: "#009fe3" }} />;

type Props = {
  description?: string;
  keyFeatures?: readonly string[];
  technicalSpecifications?: {
    name: string;
    value: string;
  }[];
  sidebarItems?: {
    title: React.ReactNode;
    content: {
      json: Document;
    };
  }[];
};

const ProductLeadBlock = ({
  description,
  keyFeatures,
  technicalSpecifications,
  sidebarItems
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
              {sidebarItems?.length && (
                <LeadBlock.Card.Section>
                  <LeadBlock.Card.Heading variant="h5">
                    {sidebarItems[0].title}
                  </LeadBlock.Card.Heading>
                  <LeadBlock.Card.Content>
                    <RichText
                      document={sidebarItems[0].content.json}
                      theme="secondary"
                      backgroundTheme="dark"
                    />
                  </LeadBlock.Card.Content>
                </LeadBlock.Card.Section>
              )}
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
            {sidebarItems && sidebarItems.length > 1 && (
              <LeadBlock.Card theme="blue-900">
                {sidebarItems.slice(1).map(({ title, content }, index) => {
                  return (
                    <LeadBlock.Card.Section key={`sidebar-item-${index}`}>
                      <LeadBlock.Card.Heading>{title}</LeadBlock.Card.Heading>
                      <LeadBlock.Card.Content>
                        <RichText
                          document={content.json}
                          theme="secondary"
                          backgroundTheme="dark"
                        />
                      </LeadBlock.Card.Content>
                    </LeadBlock.Card.Section>
                  );
                })}
              </LeadBlock.Card>
            )}
          </LeadBlock>
        </Tabs.TabPanel>
      </Tabs>
    </div>
  );
};

export default ProductLeadBlock;
