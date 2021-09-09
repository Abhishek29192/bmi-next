import React from "react";
import LeadBlock from "@bmi/lead-block";
import Typography from "@bmi/typography";
import IconList from "@bmi/icon-list";
import Icon from "@bmi/icon";
import CheckIcon from "@material-ui/icons/Check";
import Button from "@bmi/button";
import { Launch } from "@material-ui/icons";
import { useSiteContext } from "../../components/Site";
import { Data as ContentfulTitleWithContent } from "../../components/TitleWithContent";
import RichText from "../../components/RichText";
import { Assets, Feature, SystemBenefits } from "./types";
import styles from "./styles/aboutLeadBlock.module.scss";

type Props = {
  longDescription: string;
  guaranteesAndWarranties?: Assets[];
  awardsAndCertificates?: Assets[];
  keyFeatures?: Feature;
  systemBenefits?: SystemBenefits;
  specification?: Assets;
  sidebarItem?: ContentfulTitleWithContent;
};

const BlueCheckIcon = (
  <Icon source={CheckIcon} className={styles["blueCheckIcon"]} />
);

const LeadBlockCardContent = ({
  title,
  contents
}: {
  title: string;
  contents: string[];
}) => (
  <LeadBlock.Card.Section>
    <LeadBlock.Card.Heading hasUnderline>{title}</LeadBlock.Card.Heading>
    <LeadBlock.Card.Content>
      <IconList>
        {contents.map((value, index) => (
          <IconList.Item
            key={index}
            icon={BlueCheckIcon}
            title={value}
            isCompact
          />
        ))}
      </IconList>
    </LeadBlock.Card.Content>
  </LeadBlock.Card.Section>
);

const AboutLeadBlock = ({
  longDescription,
  guaranteesAndWarranties,
  awardsAndCertificates,
  keyFeatures,
  systemBenefits,
  specification,
  sidebarItem
}: Props) => {
  const { getMicroCopy } = useSiteContext();

  return (
    <LeadBlock className={styles["aboutLeadBlock"]}>
      <LeadBlock.Content>
        <LeadBlock.Content.Section>
          <Typography
            component="div"
            dangerouslySetInnerHTML={{ __html: longDescription }}
          />
        </LeadBlock.Content.Section>
        {guaranteesAndWarranties && guaranteesAndWarranties.length > 0 && (
          <LeadBlock.Content.Section
            className={styles["guaranteesAndAwardsAsset"]}
          >
            <LeadBlock.Content.Heading>
              {getMicroCopy("pdp.leadBlock.guaranteesWarranties")}
            </LeadBlock.Content.Heading>
            {guaranteesAndWarranties.map((item, i) => (
              <img
                key={i}
                src={item.url}
                alt={item.name}
                className={styles["image"]}
              />
            ))}
          </LeadBlock.Content.Section>
        )}
        {awardsAndCertificates && awardsAndCertificates.length > 0 && (
          <LeadBlock.Content.Section
            className={styles["guaranteesAndAwardsAsset"]}
          >
            <LeadBlock.Content.Heading>
              {getMicroCopy("pdp.leadBlock.awardsCertificates")}
            </LeadBlock.Content.Heading>
            {awardsAndCertificates.map((item, i) => (
              <img
                key={i}
                src={item.url}
                alt={item.name}
                className={styles["image"]}
              />
            ))}
          </LeadBlock.Content.Section>
        )}
        {specification && (
          <LeadBlock.Content.Section>
            <LeadBlock.Content.Heading>
              {getMicroCopy("sdp.leadBlock.specification")}
            </LeadBlock.Content.Heading>

            <Button
              variant="outlined"
              action={{
                model: "htmlLink",
                href: specification.url,
                target: "_blank",
                rel: "noopener noreferrer"
              }}
              endIcon={<Launch />}
            >
              {specification.name}
            </Button>
          </LeadBlock.Content.Section>
        )}
      </LeadBlock.Content>
      {(keyFeatures || systemBenefits || sidebarItem) && (
        <LeadBlock.Card theme="pearl" data-testid="sidebar">
          {keyFeatures && (
            <LeadBlockCardContent
              title={keyFeatures.name}
              contents={keyFeatures.featureValues.map(({ value }) => value)}
            />
          )}
          {systemBenefits && (
            <LeadBlockCardContent
              title={getMicroCopy("sdp.leadBlock.systemBenefits")}
              contents={systemBenefits}
            />
          )}
          {sidebarItem && (
            <LeadBlock.Card.Section>
              <LeadBlock.Card.Heading hasUnderline>
                {sidebarItem.title}
              </LeadBlock.Card.Heading>
              <LeadBlock.Card.Content>
                <RichText
                  document={sidebarItem.content}
                  hyperlinkColor="default"
                />
              </LeadBlock.Card.Content>
            </LeadBlock.Card.Section>
          )}
        </LeadBlock.Card>
      )}
    </LeadBlock>
  );
};

export default AboutLeadBlock;
