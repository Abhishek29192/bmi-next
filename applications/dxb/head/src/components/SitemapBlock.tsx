import { useIsClient } from "@bmi-digital/components";
import AnchorLink from "@bmi-digital/components/anchor-link";
import MasonryGrid from "@bmi-digital/components/masonry-grid";
import classnames from "classnames";
import React from "react";
import memoize from "../utils/memoize";
import {
  Data as LinkData,
  NavigationData,
  NavigationItem,
  getClickableActionFromUrl
} from "./Link";
import { useSiteContext } from "./Site";
import {
  StyledSitemapBlock,
  StyledSitemapItem,
  classes
} from "./styles/SitemapBlock.styles";

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
  <StyledSitemapBlock className={classnames(isChild && classes.child)}>
    {isChild ? <div>{children}</div> : <MasonryGrid>{children}</MasonryGrid>}
  </StyledSitemapBlock>
);

const SitemapBlock = ({ links, label, level = 0 }: Props) => {
  const { countryCode } = useSiteContext();
  const { isClient } = useIsClient();
  const memoizedGetClickableActionFromUrl = memoize(getClickableActionFromUrl);

  const validSitemapLinks = links?.filter(isValidSitemapType);

  return (
    <WrapperComponent isChild={level > 0}>
      {validSitemapLinks?.map((linkData) => {
        const { __typename } = linkData;

        if (__typename === "ContentfulLink") {
          const { label, linkedPage, url } = linkData as LinkData;

          return (
            <StyledSitemapItem
              variant={levelVariantMap[level.toString()].link}
              key={`${level}-${label}`}
            >
              <AnchorLink
                action={memoizedGetClickableActionFromUrl(
                  { isSSR: !isClient, linkedPage, url, countryCode, label },
                  []
                )}
                data-testid={"sitemap-link"}
              >
                {label}
              </AnchorLink>
            </StyledSitemapItem>
          );
        }

        if (__typename === "ContentfulNavigation") {
          const { links, label, link } = linkData as NavigationData;

          return (
            <div key={`${level}-${label}`}>
              {label && (
                <StyledSitemapItem
                  variant={levelVariantMap[level.toString()].label}
                >
                  {link ? (
                    <AnchorLink
                      action={memoizedGetClickableActionFromUrl(
                        {
                          isSSR: !isClient,
                          linkedPage: link.linkedPage,
                          url: link.url,
                          countryCode,
                          label: link.label
                        },
                        []
                      )}
                    >
                      {label}
                    </AnchorLink>
                  ) : (
                    label
                  )}
                </StyledSitemapItem>
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
