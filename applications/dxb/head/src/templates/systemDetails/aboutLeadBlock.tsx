import {
  AnchorLink,
  AnchorLinkProps,
  Button,
  ButtonProps,
  Icon,
  IconList,
  LeadBlock,
  transformHyphens,
  Typography
} from "@bmi/components";
import { Launch } from "@material-ui/icons";
import CheckIcon from "@material-ui/icons/Check";
import React from "react";
import {
  getClickableActionFromUrl,
  isExternalUrl
} from "../../components/Link";
import RichText from "../../components/RichText";
import { useSiteContext } from "../../components/Site";
import { Data as ContentfulTitleWithContent } from "../../components/TitleWithContent";
import { microCopy } from "../../constants/microCopies";
import { System } from "../../types/pim";
import withGTM from "../../utils/google-tag-manager";
import styles from "./styles/aboutLeadBlock.module.scss";

const GTMButton = withGTM<ButtonProps>(Button);

type Props = {
  system: System;
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
  contents: readonly string[];
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

const AboutLeadBlock = ({ system, sidebarItem }: Props) => {
  const { getMicroCopy, countryCode } = useSiteContext();
  const GTMAnchorLink = withGTM<AnchorLinkProps>(AnchorLink);
  const isImageAsset = (asset) => {
    return (
      asset.realFileName?.indexOf(".jpg") > -1 ||
      asset.realFileName?.indexOf(".png") > -1
    );
  };

  const guaranteesAndWarrantiesLinks =
    system.guaranteesAndWarrantiesLinks?.filter(
      (item) => !item.realFileName && item.url
    );
  const guaranteesImages = system.guaranteesAndWarrantiesImages?.filter(
    (item) => isImageAsset(item)
  );

  return (
    <LeadBlock className={styles["aboutLeadBlock"]}>
      <LeadBlock.Content>
        <LeadBlock.Content.Section>
          <Typography
            component="div"
            dangerouslySetInnerHTML={{
              __html: transformHyphens(system.description)
            }}
          />
        </LeadBlock.Content.Section>
        {((system.guaranteesAndWarrantiesImages &&
          system.guaranteesAndWarrantiesImages.length > 0) ||
          (system.guaranteesAndWarrantiesLinks &&
            system.guaranteesAndWarrantiesLinks.length > 0)) && (
          <LeadBlock.Content.Section
            className={styles["guaranteesAndAwardsAsset"]}
          >
            <LeadBlock.Content.Heading variant="h6">
              {getMicroCopy(microCopy.PDP_LEAD_BLOCK_GUARANTEES_WARRANTIES)}
            </LeadBlock.Content.Heading>
            {guaranteesImages?.map((item, i) => (
              <img
                key={`guarentee-img-${i}`}
                src={item.url}
                alt={item.name}
                className={styles["image"]}
              />
            ))}
            {guaranteesAndWarrantiesLinks?.map((item, i) => (
              <div key={`link-${i}`}>
                <GTMAnchorLink
                  action={getClickableActionFromUrl(
                    undefined,
                    item.url,
                    countryCode,
                    undefined,
                    item.name
                  )}
                  gtm={{
                    id: "cta-click1",
                    label: item.name,
                    action: item.url
                  }}
                  iconEnd
                  {...(isExternalUrl(item.url) ? { isExternal: true } : {})}
                  className={styles["inline-link"]}
                >
                  {item.name}
                </GTMAnchorLink>
              </div>
            ))}
          </LeadBlock.Content.Section>
        )}
        {system.awardsAndCertificateImages &&
          system.awardsAndCertificateImages.length > 0 && (
            <LeadBlock.Content.Section
              className={styles["guaranteesAndAwardsAsset"]}
            >
              <LeadBlock.Content.Heading variant="h6">
                {getMicroCopy(microCopy.PDP_LEAD_BLOCK_AWARDS_CERTIFICATES)}
              </LeadBlock.Content.Heading>
              {system.awardsAndCertificateImages.map((item, i) => (
                <img
                  key={i}
                  src={item.url}
                  alt={item.name}
                  className={styles["image"]}
                />
              ))}
            </LeadBlock.Content.Section>
          )}
        {system.specification && (
          <LeadBlock.Content.Section>
            <LeadBlock.Content.Heading variant="h6">
              {getMicroCopy(microCopy.SDP_LEAD_BLOCK_SPECIFICATION)}
            </LeadBlock.Content.Heading>

            <GTMButton
              variant="outlined"
              action={{
                model: "htmlLink",
                href: system.specification.url,
                target: "_blank",
                rel: "noopener noreferrer"
              }}
              endIcon={<Launch />}
              gtm={{
                id: "cta-click1",
                label: system.specification.name,
                action: system.specification.url
              }}
            >
              {system.specification.name}
            </GTMButton>
          </LeadBlock.Content.Section>
        )}
      </LeadBlock.Content>
      {(system.keyFeatures || system.systemBenefits || sidebarItem) && (
        <LeadBlock.Card theme="pearl" data-testid="sidebar">
          {system.keyFeatures && (
            <LeadBlockCardContent
              title={system.keyFeatures.name}
              contents={system.keyFeatures.values}
            />
          )}
          {system.systemBenefits && (
            <LeadBlockCardContent
              title={getMicroCopy(microCopy.SDP_LEAD_BLOCK_SYSTEM_BENEFITS)}
              contents={system.systemBenefits}
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
                  gtmLabel={sidebarItem.title}
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
