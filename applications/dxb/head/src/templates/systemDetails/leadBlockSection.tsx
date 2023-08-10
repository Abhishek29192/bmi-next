import {
  Button,
  ButtonProps,
  IconList,
  LeadBlock
} from "@bmi-digital/components";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon
} from "@bmi-digital/components/icon";
import { Check as CheckIcon } from "@mui/icons-material";
import { useLocation } from "@reach/router";
import React, { useEffect, useState } from "react";
import { GoodBetterBest } from "@bmi/pim-types";
import { microCopy } from "@bmi/microcopies";
import { StyledBlueCheckIconInter } from "../../components/CommonIcons";
import Link, { Data as LinkData } from "../../components/Link";
import { useSiteContext } from "../../components/Site";
import {
  SYSTEM_CONFIG_QUERY_KEY_PREV_PAGE,
  SYSTEM_CONFIG_QUERY_KEY_REFERER,
  SYSTEM_CONFIG_QUERY_KEY_SELECTED_SYSTEM
} from "../../constants/queryConstants";
import withGTM from "../../utils/google-tag-manager";
import {
  Description,
  StyledGoodBetterBestIndicator,
  StyledSystemDetailsLeadBlockSection,
  StyledTitle,
  classes
} from "./styles/leadBlockSection.styles";

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

  const GTMButton = withGTM<ButtonProps>(Button);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const systemId = params.get(SYSTEM_CONFIG_QUERY_KEY_SELECTED_SYSTEM);
    const prevPagePath = params.get(SYSTEM_CONFIG_QUERY_KEY_PREV_PAGE);
    const referer = params.get(SYSTEM_CONFIG_QUERY_KEY_REFERER);

    setSelectedSystemId(systemId);
    setPrevPagePath(prevPagePath);
    setReferer(referer);
  }, []);

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
              <StyledGoodBetterBestIndicator indicatorType={goodBetterBest} />
            )}
            {promotionalContent && (
              <Description variant="body2" data-testid="system-lead-block-desc">
                {promotionalContent}
              </Description>
            )}
          </LeadBlock.Content.Section>

          <LeadBlock.Content.Section className={classes.ctaContainer}>
            {selectedSystemId && prevPagePath && (
              <GTMButton
                variant="text"
                size="large"
                className={classes.backToYourSelectionBtn}
                action={{
                  model: "htmlLink",
                  href: backToYourSelectionBtnHref,
                  rel: "noopener noreferrer"
                }}
                gtm={{
                  id: "cta-click1",
                  label: backToYourSelectionText,
                  action: backToYourSelectionBtnHref
                }}
                startIcon={<ArrowBackIcon />}
                data-testid="system-lead-block-prev-page"
              >
                {backToYourSelectionText}
              </GTMButton>
            )}
            {Boolean(cta) && (
              <Link
                data={cta}
                component={({ children, ...rest }) => (
                  <GTMButton
                    {...rest}
                    className={classes.quotationBtn}
                    endIcon={<ArrowForwardIcon />}
                    gtm={{
                      id: "cta-click1",
                      label: cta?.label,
                      action:
                        cta?.type === "Dialog"
                          ? "Form-modal" + cta?.dialogContent?.__typename
                          : cta?.url
                    }}
                  >
                    {children}
                  </GTMButton>
                )}
                data-testid="system-lead-block-cta-action"
              >
                {cta?.label}
              </Link>
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
