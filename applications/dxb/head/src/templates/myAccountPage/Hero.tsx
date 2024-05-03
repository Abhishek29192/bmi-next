import CommonHero from "@bmi-digital/components/hero";
import Typography from "@bmi-digital/components/typography";
import BackToResults from "../../components/BackToResults";
import Breadcrumbs from "../../components/Breadcrumbs";
import useAuth from "../../hooks/useAuth";
import createImageProps from "../../components/image/createImageProps";
import { HelloText } from "./styles";
import { getUserInfo } from "./utils";
import type { Data as BreadcrumbData } from "../../components/Breadcrumbs";
import type { Data as ContentfulImage } from "../../components/image/contentful-image/types";
import type { ImageWidths } from "../../components/image/types";

export type HeroProps = {
  breadcrumbs: BreadcrumbData;
  salutation: string;
  roleDescription: string;
  featuredMedia: ContentfulImage | null;
  slug: string;
  description: string;
};

const mediaWidths: ImageWidths = [537, 641, 761, 493, 322];

const Hero = ({
  breadcrumbs,
  salutation,
  roleDescription,
  featuredMedia,
  description
}: HeroProps) => {
  const { profile } = useAuth();

  const transformHeroText =
    profile && getUserInfo(profile, salutation, roleDescription);

  return (
    <CommonHero
      level={1}
      title={
        <HelloText>
          {transformHeroText && transformHeroText.salutation}
        </HelloText>
      }
      media={
        featuredMedia
          ? createImageProps({
              ...featuredMedia,
              size: "cover",
              widths: mediaWidths
            })
          : undefined
      }
      breadcrumbs={
        <BackToResults isDarkThemed data-testid="breadcrumbs-section-top">
          <Breadcrumbs
            data={breadcrumbs}
            isDarkThemed
            data-testid="my-acc-page-breadcrumbs-top"
          />
        </BackToResults>
      }
    >
      {transformHeroText && (
        <Typography>{transformHeroText.roleDescription}</Typography>
      )}
      <Typography>{description}</Typography>
    </CommonHero>
  );
};

export default Hero;
