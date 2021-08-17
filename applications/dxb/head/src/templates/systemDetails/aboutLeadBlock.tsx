import React from "react";
import LeadBlock from "@bmi/lead-block";
import Typography from "@bmi/typography";
import IconList from "@bmi/icon-list";
import Icon from "@bmi/icon";
import CheckIcon from "@material-ui/icons/Check";
import { useSiteContext } from "../../components/Site";
import { Assets, Feature, SystemBenefits } from "./types";
import styles from "./styles/aboutLeadBlock.module.scss";

type Props = {
  longDescription: string;
  guaranteesAndWarranties: Assets[];
  awardsAndCertificates: Assets[];
  keyFeatures?: Feature;
  systemBenefits?: SystemBenefits;
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
    <LeadBlock.Card.Heading>
      <Typography hasUnderline variant="h4">
        {title}
      </Typography>
    </LeadBlock.Card.Heading>
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
  systemBenefits
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
        {guaranteesAndWarranties.length > 0 && (
          <LeadBlock.Content.Section
            className={styles["guaranteesAndAwardsAsset"]}
          >
            <LeadBlock.Content.Heading>
              {getMicroCopy("sdp.leadBlock.guaranteesWarranties")}
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
        {awardsAndCertificates.length > 0 && (
          <LeadBlock.Content.Section
            className={styles["guaranteesAndAwardsAsset"]}
          >
            <LeadBlock.Content.Heading>
              {getMicroCopy("sdp.leadBlock.awardsCertificates")}
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
      </LeadBlock.Content>
      {(keyFeatures || systemBenefits) && (
        <LeadBlock.Card theme="pearl">
          {keyFeatures && (
            <LeadBlockCardContent
              title={keyFeatures.name}
              contents={keyFeatures.featureValues.map(
                ({ value }) => value as string
              )}
            />
          )}
          {systemBenefits && (
            <LeadBlockCardContent
              title={getMicroCopy("sdp.leadBlock.systemBenefits")}
              contents={systemBenefits}
            />
          )}
        </LeadBlock.Card>
      )}
    </LeadBlock>
  );
};

export default AboutLeadBlock;
