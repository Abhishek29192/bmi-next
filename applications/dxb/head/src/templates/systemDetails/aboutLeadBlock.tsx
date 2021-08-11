import React, { useContext } from "react";
import LeadBlock from "@bmi/lead-block";
import Typography from "@bmi/typography";
import { SiteContext } from "../../components/Site";
import { Assets } from "./types";
import styles from "./styles/aboutLeadBlock.module.scss";

type Props = {
  longDescription: string;
  guaranteesAndWarranties: Assets[];
  awardsAndCertificates: Assets[];
};

const AboutLeadBlock = ({
  longDescription,
  guaranteesAndWarranties,
  awardsAndCertificates
}: Props) => {
  const { getMicroCopy } = useContext(SiteContext);

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
            className={styles["GuaranteesAndAwardsAsset"]}
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
            className={styles["GuaranteesAndAwardsAsset"]}
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
    </LeadBlock>
  );
};

export default AboutLeadBlock;
