import { SVGImport } from "@bmi-digital/svg-import";
import { LocationOn, Mail, Phone } from "@material-ui/icons";
import classnames from "classnames";
import React from "react";
import DefaultAnchorLink from "../anchor-link/AnchorLink";
import { ClickableAction } from "../clickable/Clickable";
import Icon from "../icon";
import Typography from "../typography/Typography";
import { useStyles } from "./styles";

type DetailType = "address" | "phone" | "email";

export type DetailProps = {
  anchorComponent?: React.ComponentType<any>; // TODO
  text: React.ReactNode;
  action?: ClickableAction;
  label: React.ReactNode;
  type: DetailType;
};

type Props = {
  anchorComponent?: React.ComponentType<any>; // TODO
  title: React.ReactNode;
  details?: readonly [DetailProps, ...DetailProps[]];
  footNote: React.ReactNode;
  isFlat?: boolean;
};

const LocationCard = ({
  anchorComponent,
  title,
  details,
  footNote,
  isFlat
}: Props): React.ReactElement => {
  const classes = useStyles();
  return (
    <address className={classnames(classes.root, isFlat && classes.flat)}>
      <Typography variant="h5">{title}</Typography>
      <dl className={classes.list}>
        {details?.map((detail, index) => (
          <LocationItem
            key={index}
            anchorComponent={anchorComponent}
            {...detail}
          />
        ))}
      </dl>
      <div className={classes.footNote}>{footNote}</div>
    </address>
  );
};

export default LocationCard;

export const LocationItem = ({
  anchorComponent: AnchorLink = DefaultAnchorLink,
  text,
  action,
  label,
  type
}: DetailProps): React.ReactElement => {
  const classes = useStyles();
  const typeToIconMap: Record<DetailType, SVGImport> = {
    address: LocationOn,
    phone: Phone,
    email: Mail
  };

  return (
    <>
      <dt className={classes.term}>
        {/* eslint-disable-next-line security/detect-object-injection */}
        <Icon source={typeToIconMap[type]} className={classes.icon} />
        <Typography className={classes.label}>{label}</Typography>
      </dt>
      <dd className={classes.description}>
        {action ? (
          <AnchorLink action={action} className={classes.link}>
            {text}
          </AnchorLink>
        ) : (
          text
        )}
      </dd>
    </>
  );
};
