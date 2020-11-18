import React from "react";
import AnchorLink, { ClickableAction } from "@bmi/anchor-link";
import ShowMore from "@bmi/show-more";
import Typography from "@bmi/typography";
import { ButtonProps, IconButtonProps } from "@bmi/button";
import styles from "./ExpandableLinksTextCard.module.scss";

function partitionLinks(links, separator) {
  return links.reduce(
    (partitionedLinks, link, index) => {
      if (index < separator) {
        partitionedLinks.shownLinks.push(link);
      } else {
        partitionedLinks.hiddenLinks.push(link);
      }
      return partitionedLinks;
    },
    {
      shownLinks: [],
      hiddenLinks: []
    }
  );
}

type ExpandableLinksTextCardsProps = {
  title: string;
  links: {
    action: ClickableAction | undefined;
    label: string;
  }[];
  separator?: number;
  openButton: React.ReactElement<ButtonProps | IconButtonProps>;
  closeButton?: React.ReactElement<ButtonProps | IconButtonProps>;
};

const ExpandableLinksTextCards = ({
  title,
  links,
  separator = 3,
  openButton,
  closeButton
}: ExpandableLinksTextCardsProps) => {
  const { shownLinks, hiddenLinks } = partitionLinks(links, separator);

  return (
    <div className={styles["ExpandableLinksTextCards"]}>
      <Typography component="h3" variant="h5" className={styles["title"]}>
        {title}
      </Typography>
      <div className={styles["shown-links-wrapper"]}>
        {shownLinks &&
          shownLinks.map(({ label, action }, index) => (
            <AnchorLink
              key={`${label}-${index}`}
              action={action}
              className={styles["link"]}
            >
              {label}
            </AnchorLink>
          ))}
      </div>
      <div className={styles["hidden-links-wrapper"]}>
        {hiddenLinks.length > 0 && (
          <ShowMore openButton={openButton} closeButton={closeButton}>
            {hiddenLinks.map(({ label, action }, index) => (
              <AnchorLink
                key={`${label}-${index}`}
                action={action}
                className={styles["link"]}
              >
                {label}
              </AnchorLink>
            ))}
          </ShowMore>
        )}
      </div>
    </div>
  );
};

export default ExpandableLinksTextCards;
