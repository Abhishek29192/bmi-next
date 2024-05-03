import Button from "@bmi-digital/components/button";
import PromoSection from "@bmi-digital/components/promo-section";
import Typography from "@bmi-digital/components/typography";
import { graphql, Link } from "gatsby";
import FallbackComponent from "../components/FallbackComponent";
import Page from "../components/Page";
import { getPathWithCountryCode } from "../utils/path";
import { stringifyToObject } from "../utils/createActionLabelForAnalytics";
import createVideoProps from "../components/video/createVideoProps";
import createContentfulImageProps from "../components/image/contentful-image/createContentfulImageProps";
import type {
  ContentfulPromoCard,
  ContentfulSite,
  FourOFourResponse
} from "../schema/resolvers/types/Contentful";
import type { AnchorLinkActionProps } from "@bmi-digital/components/anchor-link";
import type { ImageWidths } from "../components/image/types";

type Data = {
  fourOFour: FourOFourResponse;
};

const Cta = (
  props: ContentfulPromoCard["cta"] & {
    countryCode: ContentfulSite["countryCode"];
  }
) => {
  const placeholderCTALabel = "Error:404.cta.label";
  const actionProps: AnchorLinkActionProps = props.linkedPage
    ? {
        to: getPathWithCountryCode(props.countryCode, props.linkedPage.path),
        component: Link
      }
    : { href: props.url, external: true };

  const ctaLabel = props.label || placeholderCTALabel;
  return (
    <Button
      {...actionProps}
      gtm={{
        id: "cta-click1",
        action: stringifyToObject(actionProps.to) || actionProps.href,
        label: ctaLabel
      }}
    >
      {ctaLabel}
    </Button>
  );
};

const mediaWidths: ImageWidths = [561, 321, 381, 446, 330];

const FourOFour = ({ data }: { data: Data }) => {
  const siteData = data.fourOFour.siteData;
  const errorFourOFour = data.fourOFour.errorPageData;
  const placeholderTitle = "Error:404.title";
  const placeholderSubtitle = "Error:404.subtitle";

  if (!siteData || !errorFourOFour) {
    return <FallbackComponent />;
  }

  return (
    <Page
      title={errorFourOFour.title || placeholderTitle}
      pageData={{
        breadcrumbs: null,
        signupBlock: null,
        seo: null,
        path: null
      }}
      siteData={siteData}
    >
      <PromoSection
        title={errorFourOFour.title || placeholderTitle}
        media={
          errorFourOFour.featuredVideo
            ? createVideoProps({
                ...errorFourOFour.featuredVideo,
                previewMediaWidths: mediaWidths
              })
            : errorFourOFour.featuredMedia
              ? {
                  ...createContentfulImageProps({
                    ...errorFourOFour.featuredMedia,
                    widths: mediaWidths
                  })
                }
              : undefined
        }
      >
        <Typography variant="body2" gutterBottom>
          {errorFourOFour.subtitle || placeholderSubtitle}
        </Typography>
        {errorFourOFour.cta && (
          <Cta {...errorFourOFour.cta} countryCode={siteData.countryCode} />
        )}
      </PromoSection>
    </Page>
  );
};

export default FourOFour;

export const pageQuery = graphql`
  {
    fourOFour {
      errorPageData {
        ...PromoCardFragment
      }
      siteData {
        ...SiteFragment
      }
    }
  }
`;
