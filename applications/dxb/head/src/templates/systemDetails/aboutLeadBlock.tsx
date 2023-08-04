import {
  AnchorLink,
  AnchorLinkProps,
  Button,
  ButtonProps,
  IconList,
  LeadBlock,
  replaceSpaces,
  transformHyphens,
  Typography,
  useIsClient
} from "@bmi-digital/components";
import { Check as CheckIcon, Launch } from "@mui/icons-material";
import React from "react";
import { Asset } from "@bmi/pim-types";
import { microCopy } from "@bmi/microcopies";
import { StyledBlueCheckIconInter } from "../../components/CommonIcons";
import {
  getClickableActionFromUrl,
  isExternalUrl
} from "../../components/Link";
import RichText from "../../components/RichText";
import { useSiteContext } from "../../components/Site";
import { Data as ContentfulTitleWithContent } from "../../components/TitleWithContent";
import { System } from "../../types/pim";
import withGTM from "../../utils/google-tag-manager";
import { classes, StyledLeadBlock } from "./styles/aboutLeadBlockStyles";

const GTMButton = withGTM<ButtonProps>(Button);

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
  const { getMicroCopy, countryCode } = useSiteContext();
  const GTMAnchorLink = withGTM<AnchorLinkProps>(AnchorLink);
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
                  className={classes.inlineLink}
                  data-testid={`guarantee-inline-link${
                    item.name ? `-${replaceSpaces(item.name)}` : ""
                  }`}
                >
                  {item.name}
                </GTMAnchorLink>
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
              data-testid="specification-button"
            >
              {system.specification.name}
            </GTMButton>
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
