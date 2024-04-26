import AnchorLink from "@bmi-digital/components/anchor-link";
import Button from "@bmi-digital/components/button";
import { useIsClient } from "@bmi-digital/components/hooks";
import IconList from "@bmi-digital/components/icon-list";
import CheckIcon from "@bmi-digital/components/icon/Check";
import Launch from "@bmi-digital/components/icon/ExternalLink";
import LeadBlock from "@bmi-digital/components/lead-block";
import Typography from "@bmi-digital/components/typography";
import { replaceSpaces, transformHyphens } from "@bmi-digital/components/utils";
import { microCopy } from "@bmi/microcopies";
import { Asset } from "@bmi/pim-types";
import React from "react";
import { StyledBlueCheckIconInter } from "../../components/CommonIcons";
import RichText from "../../components/RichText";
import { useSiteContext } from "../../components/Site";
import { isExternalUrl } from "../../components/link/utils";
import { StyledLeadBlock, classes } from "./styles/aboutLeadBlockStyles";
import type { Data as ContentfulTitleWithContent } from "../../components/TitleWithContent";
import type { System } from "../../types/pim";

type Props = {
  system: System;
  sidebarItem?: ContentfulTitleWithContent;
};

const BlueCheckIcon = () => {
  return <StyledBlueCheckIconInter source={CheckIcon} />;
};

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
            icon={BlueCheckIcon()}
            title={value}
            isCompact
          />
        ))}
      </IconList>
    </LeadBlock.Card.Content>
  </LeadBlock.Card.Section>
);

const AboutLeadBlock = ({ system, sidebarItem }: Props) => {
  const { isClient } = useIsClient();
  const { getMicroCopy } = useSiteContext();
  const isImageAsset = (asset: Asset) => {
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
    <StyledLeadBlock>
      <LeadBlock.Content>
        <LeadBlock.Content.Section>
          {isClient && (
            <Typography
              component="div"
              className={classes.description}
              dangerouslySetInnerHTML={{
                __html: transformHyphens(system.description) as string
              }}
            />
          )}
        </LeadBlock.Content.Section>
        {((system.guaranteesAndWarrantiesImages &&
          system.guaranteesAndWarrantiesImages.length > 0) ||
          (system.guaranteesAndWarrantiesLinks &&
            system.guaranteesAndWarrantiesLinks.length > 0)) && (
          <LeadBlock.Content.Section>
            <LeadBlock.Content.Heading
              variant="h6"
              data-testid="guarentees-section"
            >
              {getMicroCopy(microCopy.PDP_LEAD_BLOCK_GUARANTEES_WARRANTIES)}
            </LeadBlock.Content.Heading>
            {guaranteesImages?.map((item, i) => (
              <img
                key={`guarantee-img-${i}`}
                src={item.url}
                alt={item.name}
                className={classes.image}
                data-testid={`guarantee-image${
                  item.name ? `-${replaceSpaces(item.name)}` : ""
                }`}
              />
            ))}
            {guaranteesAndWarrantiesLinks?.map((item, i) => (
              <div key={`link-${i}`}>
                <AnchorLink
                  href={item.url}
                  gtm={{
                    id: "cta-click1",
                    label: item.name,
                    action: item.url
                  }}
                  iconPosition="end"
                  {...(isExternalUrl(item.url) ? { isExternal: true } : {})}
                  className={classes.inlineLink}
                  data-testid={`guarantee-inline-link${
                    item.name ? `-${replaceSpaces(item.name)}` : ""
                  }`}
                >
                  {item.name}
                </AnchorLink>
              </div>
            ))}
          </LeadBlock.Content.Section>
        )}
        {system.awardsAndCertificateImages &&
          system.awardsAndCertificateImages.length > 0 && (
            <LeadBlock.Content.Section>
              <LeadBlock.Content.Heading
                variant="h6"
                data-testid="awards-section"
              >
                {getMicroCopy(microCopy.PDP_LEAD_BLOCK_AWARDS_CERTIFICATES)}
              </LeadBlock.Content.Heading>
              {system.awardsAndCertificateImages.map((item, i) => (
                <img
                  key={i}
                  src={item.url}
                  alt={item.name}
                  className={classes.image}
                />
              ))}
            </LeadBlock.Content.Section>
          )}
        {system.specification && (
          <LeadBlock.Content.Section>
            <LeadBlock.Content.Heading
              variant="h6"
              data-testid="specification-section"
            >
              {getMicroCopy(microCopy.SDP_LEAD_BLOCK_SPECIFICATION)}
            </LeadBlock.Content.Heading>

            <Button
              variant="outlined"
              href={system.specification.url}
              external
              endIcon={<Launch />}
              gtm={{
                id: "cta-click1",
                label: system.specification.name,
                action: system.specification.url
              }}
              data-testid="specification-button"
            >
              {system.specification.name}
            </Button>
          </LeadBlock.Content.Section>
        )}
      </LeadBlock.Content>
      {(system.keyFeatures || system.systemBenefits || sidebarItem) && (
        <LeadBlock.Card color="pearl" data-testid="sidebar">
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
    </StyledLeadBlock>
  );
};

export default AboutLeadBlock;
