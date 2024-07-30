import Button from "@bmi-digital/components/button";
import PromoSection from "@bmi-digital/components/promo-section";
import Typography from "@bmi-digital/components/typography";
import NextLink from "next/link";
import React from "react";
import FallbackComponent from "../components/FallbackComponent";
import Page from "../components/Page";
import { getPathWithCountryCode } from "../utils/path";
import { stringifyToObject } from "../utils/createActionLabelForAnalytics";
import createVideoProps from "../components/video/createVideoProps";
import createContentfulImageProps from "../components/image/contentful-image/createContentfulImageProps";
import type { AnchorLinkActionProps } from "@bmi-digital/components/anchor-link";
import type { ImageWidths } from "../components/image/types";
import type { Data as SiteData } from "../components/Site";
import type { Data as PromoData } from "../components/Promo";

type Data = {
  fourOFour: {
    siteData: SiteData;
    errorPageData: PromoData | null;
  };
};

const Cta = (
  props: PromoData["cta"] & {
    countryCode: SiteData["countryCode"];
  }
) => {
  const placeholderCTALabel = "Error:404.cta.label";
  const actionProps: AnchorLinkActionProps = props.linkedPage
    ? {
        href: getPathWithCountryCode(props.countryCode, props.linkedPage.path),
        component: NextLink
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
  //Should be removed after the migration to Next.js.
  //https://bmigroup.atlassian.net/browse/DXB-8044
  //Currently, we do not have a function to get Contentful data
  //So it is throwing an error during the build time
  return <FallbackComponent />;

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

// export const pageQuery = graphql`
//   {
//     fourOFour {
//       errorPageData {
//         ...PromoCardFragment
//       }
//       siteData {
//         ...SiteFragment
//       }
//     }
//   }
// `;
