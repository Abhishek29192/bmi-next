import React from "react";
import classnames from "classnames";
import AnchorLink from "@bmi-digital/components/anchor-link";
import MasonryGrid from "@bmi-digital/components/masonry-grid";
import Typography from "@bmi-digital/components/typography";
import {
  Data as LinkData,
  NavigationData,
  getClickableActionFromUrl,
  NavigationItem
} from "./Link";
import { useSiteContext } from "./Site";
import styles from "./styles/SitemapBlock.module.scss";

type Props = {
  links: (NavigationData | NavigationItem | LinkData)[] | null;
  label?: string;
  level?: number;
  isChild?: boolean;
};

const levelVariantMap = {
  max: 2,
  0: {
    label: "h4",
    link: "h5"
  },
  1: {
    label: "h5",
    link: "h6"
  },
  2: {
    label: "h6",
    link: "h6"
  }
};

const isValidSitemapType = (
  item: NavigationData | NavigationItem | LinkData
): item is NavigationData | LinkData => {
  return item.__typename !== "ContentfulNavigationItem";
};

const WrapperComponent = ({
  isChild,
  children
}: {
  isChild: boolean;
  children: React.ReactNode;
}) => (
  <div
    className={classnames(styles.SitemapBlock, {
      [styles["SitemapBlock--child"]]: isChild
    })}
  >
    {isChild ? <div>{children}</div> : <MasonryGrid>{children}</MasonryGrid>}
  </div>
);

const SitemapBlock = ({ links, label, level = 0 }: Props) => {
  const { countryCode } = useSiteContext();

  const validSitemapLinks = links?.filter(isValidSitemapType);

  return (
    <WrapperComponent isChild={level > 0}>
      {validSitemapLinks?.map((link) => {
        const { __typename } = link;

        if (__typename === "ContentfulLink") {
          const { label, linkedPage, url } = link as LinkData;

          return (
            <Typography
              variant={levelVariantMap[level.toString()].link}
              gutterBottom
              key={`${level}-${label}`}
            >
              <AnchorLink
                action={getClickableActionFromUrl(
                  linkedPage,
                  url,
                  countryCode,
                  null,
                  label
                )}
              >
                {label}
              </AnchorLink>
            </Typography>
          );
        }

        if (__typename === "ContentfulNavigation") {
          const { links, label } = link as NavigationData;

          return (
            <div key={`${level}-${label}`}>
              {label && (
                <Typography
                  variant={levelVariantMap[level.toString()].label}
                  gutterBottom
                >
                  {label}
                </Typography>
              )}
              <SitemapBlock
                links={links}
                label={label}
                level={
                  level + 1 <= levelVariantMap.max
                    ? level + 1
                    : levelVariantMap.max
                }
                isChild
              />
            </div>
          );
        }
      })}
    </WrapperComponent>
  );
};

export default SitemapBlock;
