import Button from "@bmi-digital/components/button";
import IconList from "@bmi-digital/components/icon-list";
import ArrowBackIcon from "@bmi-digital/components/icon/ArrowBack";
import ArrowForwardIcon from "@bmi-digital/components/icon/ArrowForward";
import CheckIcon from "@bmi-digital/components/icon/Check";
import LeadBlock from "@bmi-digital/components/lead-block";
import Tag from "@bmi-digital/components/tag";
import { microCopy } from "@bmi/microcopies";
import { GoodBetterBest } from "@bmi/pim-types";
import { useLocation } from "@reach/router";
import React, { useEffect, useState } from "react";
import { StyledBlueCheckIconInter } from "../../components/CommonIcons";
import { useSiteContext } from "../../components/Site";
import ButtonLink from "../../components/link/ButtonLink";
import {
  SYSTEM_CONFIG_QUERY_KEY_PREV_PAGE,
  SYSTEM_CONFIG_QUERY_KEY_REFERER,
  SYSTEM_CONFIG_QUERY_KEY_SELECTED_SYSTEM
} from "../../constants/queryConstants";
import {
  getLevel,
  goodBetterBestLabels
} from "../../utils/getGoodBetterBestLabel";
import {
  Description,
  StyledSystemDetailsLeadBlockSection,
  StyledTitle,
  classes
} from "./styles/leadBlockSection.styles";
import type { Data as LinkData } from "../../components/link/types";

const BlueCheckIcon = () => {
  return <StyledBlueCheckIconInter source={CheckIcon} />;
};

type Props = {
  name: string;
  cta?: LinkData;
  promotionalContent?: string;
  uniqueSellingPropositions?: readonly string[];
  brandLogo?: React.ReactElement;
  goodBetterBest?: GoodBetterBest;
};

const LeadBlockSection = ({
  name,
  cta,
  promotionalContent,
  uniqueSellingPropositions,
  brandLogo,
  goodBetterBest
}: Props) => {
  const { getMicroCopy } = useSiteContext();
  const [selectedSystemId, setSelectedSystemId] = useState("");
  const [prevPagePath, setPrevPagePath] = useState("");
  const [referer, setReferer] = useState("");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const systemId = params.get(SYSTEM_CONFIG_QUERY_KEY_SELECTED_SYSTEM);
    const prevPagePath = params.get(SYSTEM_CONFIG_QUERY_KEY_PREV_PAGE);
    const referer = params.get(SYSTEM_CONFIG_QUERY_KEY_REFERER);

    systemId && setSelectedSystemId(systemId);
    prevPagePath && setPrevPagePath(prevPagePath);
    referer && setReferer(referer);
  }, [location.search]);

  const backToYourSelectionText = getMicroCopy(
    microCopy.SDP_LEAD_BLOCK_BACK_TO_YOUR_SELECTION
  );
  const backToYourSelectionBtnHref = `${prevPagePath}?referer=${referer}`;
  return (
    <StyledSystemDetailsLeadBlockSection
      backgroundColor="white"
      data-testid="system-details-lead-block-section"
    >
      <LeadBlock>
        <LeadBlock.Content>
          {brandLogo && (
            <LeadBlock.Content.Section>
              {React.cloneElement(brandLogo, {
                className: classes.brandLogo,
                "data-testid":
                  brandLogo.props["data-testid"] || "lead-block-brand-logo"
              })}
            </LeadBlock.Content.Section>
          )}

          <LeadBlock.Content.Section>
            <StyledTitle
              variant="h1"
              hasUnderline
              data-testid="system-lead-block-title"
            >
              {name}
            </StyledTitle>
            {goodBetterBest && (
              <Tag
                level={getLevel(goodBetterBest)}
                // eslint-disable-next-line security/detect-object-injection
                label={getMicroCopy(goodBetterBestLabels[goodBetterBest])}
              />
            )}
            {promotionalContent && (
              <Description variant="body2" data-testid="system-lead-block-desc">
                {promotionalContent}
              </Description>
            )}
          </LeadBlock.Content.Section>

          <LeadBlock.Content.Section className={classes.ctaContainer}>
            {selectedSystemId && prevPagePath && (
              <Button
                variant="text"
                size="large"
                className={classes.backToYourSelectionBtn}
                href={backToYourSelectionBtnHref}
                gtm={{
                  id: "cta-click1",
                  label: backToYourSelectionText,
                  action: backToYourSelectionBtnHref
                }}
                startIcon={<ArrowBackIcon />}
                data-testid="system-lead-block-prev-page"
              >
                {backToYourSelectionText}
              </Button>
            )}
            {cta && (
              <ButtonLink
                data={cta}
                className={classes.quotationBtn}
                endIcon={<ArrowForwardIcon />}
                gtm={{
                  id: "cta-click1",
                  label: cta.label,
                  action:
                    cta.type === "Dialog"
                      ? "Form-modal" + cta.dialogContent?.__typename
                      : cta.url ?? undefined
                }}
                data-testid="system-lead-block-cta-action"
              >
                {cta.label}
              </ButtonLink>
            )}
          </LeadBlock.Content.Section>
        </LeadBlock.Content>
        {uniqueSellingPropositions && uniqueSellingPropositions.length > 0 && (
          <LeadBlock.Card
            className={classes.card}
            color="pearl"
            data-testid="system-attributes-card"
          >
            <LeadBlock.Card.Section>
              <div className={classes.iconList}>
                <IconList>
                  {uniqueSellingPropositions.map((value, id) => (
                    <IconList.Item
                      isCompact
                      icon={BlueCheckIcon()}
                      title={value}
                      key={`unique-selling-proposition-${id}`}
                    />
                  ))}
                </IconList>
              </div>
            </LeadBlock.Card.Section>
          </LeadBlock.Card>
        )}
      </LeadBlock>
    </StyledSystemDetailsLeadBlockSection>
  );
};

export default LeadBlockSection;
