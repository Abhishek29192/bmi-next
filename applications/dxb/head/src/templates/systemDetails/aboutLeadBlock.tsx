import React from "react";
import { LeadBlock } from "@bmi-digital/components";
import { Typography } from "@bmi-digital/components";
import { IconList } from "@bmi-digital/components";
import { Icon } from "@bmi-digital/components";
import { Button, ButtonProps } from "@bmi-digital/components";
import CheckIcon from "@material-ui/icons/Check";
import { Launch } from "@material-ui/icons";
import { microCopy } from "../../constants/microCopies";
import { useSiteContext } from "../../components/Site";
import { Data as ContentfulTitleWithContent } from "../../components/TitleWithContent";
import RichText from "../../components/RichText";
import { Asset, Feature } from "../../components/types/pim";
import withGTM from "../../utils/google-tag-manager";
import styles from "./styles/aboutLeadBlock.module.scss";

const GTMButton = withGTM<ButtonProps>(Button);

type Props = {
  longDescription: string;
  guaranteesAndWarranties?: Asset[];
  awardsAndCertificates?: Asset[];
  keyFeatures?: Feature;
  systemBenefits?: string[];
  specification?: Asset;
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
            <LeadBlock.Content.Heading variant="h6">
              {getMicroCopy(microCopy.PDP_LEAD_BLOCK_GUARANTEES_WARRANTIES)}
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
            <LeadBlock.Content.Heading variant="h6">
              {getMicroCopy(microCopy.PDP_LEAD_BLOCK_AWARDS_CERTIFICATES)}
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
            <LeadBlock.Content.Heading variant="h6">
              {getMicroCopy(microCopy.SDP_LEAD_BLOCK_SPECIFICATION)}
            </LeadBlock.Content.Heading>

            <GTMButton
              variant="outlined"
              action={{
                model: "htmlLink",
                href: specification.url,
                target: "_blank",
                rel: "noopener noreferrer"
              }}
              endIcon={<Launch />}
              gtm={{
                id: "cta-click1",
                label: specification.name,
                action: specification.url
              }}
            >
              {specification.name}
            </GTMButton>
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
              title={getMicroCopy(microCopy.SDP_LEAD_BLOCK_SYSTEM_BENEFITS)}
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
