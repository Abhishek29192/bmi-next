import {
  Button,
  ButtonProps,
  IconList,
  LeadBlock,
  Section,
  Typography
} from "@bmi-digital/components";
import { SVGImport } from "@bmi-digital/svg-import";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";
import { useLocation } from "@reach/router";
import React, { useEffect, useState } from "react";
import { StyledBlueCheckIconInter } from "../../components/CommonIcons";
import Link, { Data as LinkData } from "../../components/Link";
import { useSiteContext } from "../../components/Site";
import { microCopy } from "../../constants/microCopies";
import {
  SYSTEM_CONFIG_QUERY_KEY_PREV_PAGE,
  SYSTEM_CONFIG_QUERY_KEY_REFERER,
  SYSTEM_CONFIG_QUERY_KEY_SELECTED_SYSTEM
} from "../../constants/queryConstants";
import withGTM from "../../utils/google-tag-manager";
import styles from "./styles/leadBlockSection.module.scss";

const BlueCheckIcon = () => {
  return <StyledBlueCheckIconInter source={CheckIcon} />;
};

type Props = {
  name: string;
  cta?: LinkData;
  promotionalContent?: string;
  uniqueSellingPropositions?: readonly string[];
  brandLogo?: SVGImport;
};

const LeadBlockSection = ({
  name,
  cta,
  promotionalContent,
  uniqueSellingPropositions,
  brandLogo: BrandLogo
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
    <Section backgroundColor="white" className={styles["LeadBlockSection"]}>
      <LeadBlock>
        <LeadBlock.Content>
          {BrandLogo && (
            <LeadBlock.Content.Section>
              <BrandLogo className={styles["brandLogo"]} />
            </LeadBlock.Content.Section>
          )}

          <LeadBlock.Content.Section>
            <Typography variant="h1" hasUnderline>
              {name}
            </Typography>
          </LeadBlock.Content.Section>

          {promotionalContent && (
            <LeadBlock.Content.Section>
              <Typography variant="body2">{promotionalContent}</Typography>
            </LeadBlock.Content.Section>
          )}
          <LeadBlock.Content.Section className={styles["ctaContainer"]}>
            {selectedSystemId && prevPagePath && (
              <GTMButton
                variant="text"
                size="large"
                className={styles["backToYourSelectionBtn"]}
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
                    className={styles["quotationBtn"]}
                    endIcon={<ArrowForwardIcon />}
                    gtm={{
                      id: "cta-click1",
                      label: cta.label,
                      action:
                        cta.type === "Dialog"
                          ? "Form-modal" + cta.dialogContent.__typename
                          : cta.url
                    }}
                  >
                    {children}
                  </GTMButton>
                )}
              >
                {cta.label}
              </Link>
            )}
          </LeadBlock.Content.Section>
        </LeadBlock.Content>
        {uniqueSellingPropositions && uniqueSellingPropositions.length > 0 && (
          <LeadBlock.Card
            className={styles["card"]}
            theme="pearl"
            data-testid="system-attributes-card"
          >
            <LeadBlock.Card.Section>
              <div className={styles["iconList"]}>
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
    </Section>
  );
};

export default LeadBlockSection;
