import React, { useEffect, useState } from "react";
import Section from "@bmi/section";
import LeadBlock from "@bmi/lead-block";
import Typography from "@bmi/typography";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Button, { ButtonProps } from "@bmi/button";
import IconList from "@bmi/icon-list";
import CheckIcon from "@material-ui/icons/Check";
import { isEmpty } from "lodash";
import { useLocation } from "@reach/router";
import Link, { Data as LinkData } from "../../components/Link";
import Image, { Data as ImageData } from "../../components/Image";
import withGTM from "../../utils/google-tag-manager";
import { useSiteContext } from "../../components/Site";
import {
  SYSTEM_CONFIG_QUERY_KEY_PREV_PAGE,
  SYSTEM_CONFIG_QUERY_KEY_REFERER,
  SYSTEM_CONFIG_QUERY_KEY_SELECTED_SYSTEM
} from "../../constants/queryConstants";
import styles from "./styles/leadBlockSection.module.scss";
import { Category, Classification, Feature } from "./types";

const BlueCheckIcon = (
  <CheckIcon style={{ color: "var(--color-theme-accent)" }} />
);

type Props = {
  name: string;
  categories: Category[];
  classifications: Classification[];
  cta?: LinkData;
  uniqueSellingPropositions?: Feature;
};

const getBrandLogo = (categories: Category[]): null | ImageData => {
  const brandCategory = categories.find((c) => c.categoryType === "Brand");
  if (!brandCategory) return null;

  return {
    type: null,
    altText: null,
    image: {
      file: {
        fileName: brandCategory.image?.realFileName,
        url: brandCategory.image?.url
      }
    },
    caption: null,
    focalPoint: null
  };
};

const getPromotionalContent = (
  classifications: Classification[]
): string | null => {
  const systemAttributes = classifications.find(
    (c) => c.code === "systemAttributes"
  );
  if (!systemAttributes) return null;

  const { features } = systemAttributes;

  const content = features.find(
    (feature) =>
      feature.code ===
      "bmiSystemsClassificationCatalog/1.0/systemAttributes.promotionalcontent"
  );
  if (!content) return null;

  return content.featureValues[0].value;
};

const LeadBlockSection = ({
  name,
  categories,
  classifications,
  cta,
  uniqueSellingPropositions
}: Props) => {
  const { getMicroCopy } = useSiteContext();
  const [selectedSystemId, setSelectedSystemId] = useState("");
  const [prevPagePath, setPrevPagePath] = useState("");
  const [referer, setReferer] = useState("");
  const brandLogo = getBrandLogo(categories);
  const promotionalContent = getPromotionalContent(classifications);
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
    "sdp.leadBlock.backToYourSelection"
  );
  const backToYourSelectionBtnHref = `${prevPagePath}?referer=${referer}`;
  return (
    <Section backgroundColor="white" className={styles["LeadBlockSection"]}>
      <LeadBlock>
        <LeadBlock.Content>
          {brandLogo && (
            <LeadBlock.Content.Section>
              <Image data={brandLogo} className={styles["brandLogo"]} />
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
        {uniqueSellingPropositions &&
          !isEmpty(uniqueSellingPropositions.featureValues) && (
            <LeadBlock.Card theme="pearl" data-testid="system-attributes-card">
              <LeadBlock.Card.Section>
                <div className={styles["iconList"]}>
                  <IconList>
                    {uniqueSellingPropositions.featureValues.map(
                      ({ value }, id) => (
                        <IconList.Item
                          isCompact
                          icon={BlueCheckIcon}
                          title={value}
                          key={`unique-selling-proposition-${id}`}
                        />
                      )
                    )}
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
