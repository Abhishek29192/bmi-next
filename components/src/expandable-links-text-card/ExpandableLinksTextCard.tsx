import React from "react";
import AnchorLink from "../anchor-link/AnchorLink";
import { ButtonProps, IconButtonProps } from "../button/Button";
import { ClickableAction } from "../clickable/Clickable";
import Icon, { iconMap } from "../icon";
import ShowMore from "../show-more/ShowMore";
import Typography from "../typography/Typography";
import { useStyles } from "./styles";

function partitionLinks(links: Link[], separator?: number) {
  return links.reduce(
    (
      partitionedLinks: { shownLinks: Link[]; hiddenLinks: Link[] },
      link,
      index
    ) => {
      if (separator && index < separator) {
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

type Link = {
  action: ClickableAction | undefined;
  label: string;
};

type ExpandableLinksTextCardsProps = {
  title: string;
  links: Link[];
  separator?: number;
  openButton: React.ReactElement<ButtonProps | IconButtonProps>;
  closeButton?: React.ReactElement<ButtonProps | IconButtonProps>;
  anchorLinkComponent?: React.ElementType;
};

const ExpandableLinksTextCards = ({
  title,
  links,
  separator = 3,
  openButton,
  closeButton,
  anchorLinkComponent: AnchorLinkComponent = AnchorLink
}: ExpandableLinksTextCardsProps) => {
  const classes = useStyles();
  const { shownLinks, hiddenLinks } = partitionLinks(links, separator);

  return (
    <div className={classes.root}>
      <Typography component="h3" variant="h5" className={classes.title}>
        {title}
      </Typography>
      <nav>
        <div className={classes.shownLinksContainer}>
          {shownLinks &&
            shownLinks.map(({ label, action }, index) => (
              <div className={classes.linkWrapper} key={`${label}-${index}`}>
                {action && action.model === "download" && (
                  <Icon source={iconMap.Download} className={classes.icon} />
                )}
                <AnchorLinkComponent
                  key={`${label}-${index}`}
                  action={action}
                  className={classes.link}
                >
                  {label}
                </AnchorLinkComponent>
              </div>
            ))}
        </div>
        <div className={classes.hiddenLinksContainer}>
          {hiddenLinks.length > 0 && (
            <ShowMore openButton={openButton} closeButton={closeButton}>
              {hiddenLinks.map(({ label, action }, index) => (
                <div className={classes.linkWrapper} key={`${label}-${index}`}>
                  {action && action.model === "download" && (
                    <Icon source={iconMap.Download} className={classes.icon} />
                  )}
                  <AnchorLinkComponent
                    key={`${label}-${index}`}
                    action={action}
                    className={classes.link}
                  >
                    {label}
                  </AnchorLinkComponent>
                </div>
              ))}
            </ShowMore>
          )}
        </div>
      </nav>
    </div>
  );
};

export default ExpandableLinksTextCards;
