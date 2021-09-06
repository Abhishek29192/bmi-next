import React, { useEffect, useState } from "react";
import Section from "@bmi/section";
import LeadBlock from "@bmi/lead-block";
import Typography from "@bmi/typography";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Button from "@bmi/button";
import IconList from "@bmi/icon-list";
import CheckIcon from "@material-ui/icons/Check";
import { isEmpty } from "lodash";
import { useLocation } from "@reach/router";
import Link, { Data as LinkData } from "../../components/Link";
import Image, { Data as ImageData } from "../../components/Image";
import { useSiteContext } from "../../components/Site";
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

const SYSTEM_CONFIG_QUERY_KEY = "selected_system";

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
  const brandLogo = getBrandLogo(categories);
  const promotionalContent = getPromotionalContent(classifications);
  const location = useLocation();

  useEffect(() => {
    const systemId = new URLSearchParams(location.search).get(
      SYSTEM_CONFIG_QUERY_KEY
    );

    setSelectedSystemId(systemId);
  }, []);

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
            {selectedSystemId && (
              <Button
                variant="text"
                action={{
                  model: "htmlLink",
                  href: `system-configurator-page?referer=sys_details`,
                  rel: "noopener noreferrer"
                }}
                startIcon={<ArrowBackIcon />}
              >
                {getMicroCopy("sdp.leadBlock.backToYourSelection")}
              </Button>
            )}
            {Boolean(cta) && (
              <Link
                data={cta}
                component={({ children, ...rest }) => (
                  <Button
                    {...rest}
                    className={styles["quotationBtn"]}
                    endIcon={<ArrowForwardIcon />}
                  >
                    {children}
                  </Button>
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
