import React from "react";
import Section from "@bmi/section";
import LeadBlock from "@bmi/lead-block";
import Typography from "@bmi/typography";
import AnchorLink from "@bmi/anchor-link";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Button from "@bmi/button";
import IconList from "@bmi/icon-list";
import CheckIcon from "@material-ui/icons/Check";
import Link, { Data as LinkData } from "../../components/Link";
import Image, { Data as ImageData } from "../../components/Image";
import styles from "./styles/leadBlockSection.module.scss";
import { Category, Classification } from "./types";

const BlueCheckIcon = <CheckIcon style={{ color: "#009fe3" }} />;

type Props = {
  name: string;
  categories: Category[];
  classifications: Classification[];
  cta?: LinkData;
};

const getBrandLogo = (categories: Category[]): null | ImageData => {
  const brandCategory = categories.find((c) => c.categoryType === "Brand");
  if (!brandCategory) return null;

  return {
    type: null,
    altText: null,
    image: {
      file: {
        fileName: brandCategory.image.realFileName,
        url: brandCategory.image.url
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
  cta
}: Props) => {
  const brandLogo = getBrandLogo(categories);
  const promotionalContent = getPromotionalContent(classifications);

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
            <AnchorLink
              action={{ model: "htmlLink", href: "/" }}
              iconStart
              iconInverted
            >
              Back to your selection
            </AnchorLink>

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
        <LeadBlock.Card theme="pearl">
          <LeadBlock.Card.Section>
            <IconList>
              <IconList.Item
                isCompact
                icon={BlueCheckIcon}
                title="Lorem, ipsum dolor sit amet consectetur adipisicing elit"
              />
              <IconList.Item
                isCompact
                icon={BlueCheckIcon}
                title="Minoritetsladningsbærerdiffusjonskoeffisientmålingsapparatur"
              />
              <IconList.Item
                isCompact
                icon={BlueCheckIcon}
                title="Excepturi eaque delectus rerum maxime vitae minus error ipsam suscipit totam ab voluptates accusamus quia"
              />
            </IconList>
          </LeadBlock.Card.Section>
        </LeadBlock.Card>
      </LeadBlock>
    </Section>
  );
};

export default LeadBlockSection;
