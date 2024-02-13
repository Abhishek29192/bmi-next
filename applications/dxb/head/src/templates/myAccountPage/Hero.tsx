import CommonHero from "@bmi-digital/components/hero";
import Typography from "@bmi-digital/components/typography";
import { microCopy } from "@bmi/microcopies";
import React from "react";
import BackToResults from "../../components/BackToResults";
import Breadcrumbs from "../../components/Breadcrumbs";
import Image from "../../components/Image";
import { useSiteContext } from "../../components/Site";
import useAuth from "../../hooks/useAuth";
import { HelloText } from "./styles";
import { getUserInfo } from "./utils";
import type { Data as ContentfulImage } from "../../components/Image";

export type HeroProps = {
  salutation: string;
  roleDescription: string;
  featuredMedia: ContentfulImage | null;
  slug: string;
  description: string;
};

const Hero = ({
  salutation,
  roleDescription,
  featuredMedia,
  slug,
  description
}: HeroProps) => {
  const { getMicroCopy } = useSiteContext();
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
        featuredMedia ? <Image {...featuredMedia} size="cover" /> : undefined
      }
      breadcrumbs={
        <BackToResults isDarkThemed data-testid="breadcrumbs-section-top">
          <Breadcrumbs
            data={[
              {
                id: "",
                label: getMicroCopy(microCopy.MY_ACCOUNT_LABEL),
                slug: slug
              }
            ]}
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
