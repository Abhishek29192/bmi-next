import { SVGImport } from "@bmi-digital/svg-import";
import {
  Directions,
  LocationOn,
  Mail,
  Phone,
  Public
} from "@material-ui/icons";
import classnames from "classnames";
import React from "react";
import AnchorLink from "../anchor-link";
import Button from "../button";
import { ClickableAction } from "../clickable";
import Icon from "../icon";
import Logo, {
  RoofProElite,
  RoofProExpert,
  RoofProPartnerSmall
} from "../logo";
import { colours } from "../theme-provider";
import Typography from "../typography";
import { useStyles } from "./styles";

export type RoofProLevel = "expert" | "partner" | "elite" | string;

type DetailTypeWithIcons =
  | "address"
  | "phone"
  | "email"
  | "distance"
  | "website";

type DetailType = DetailTypeWithIcons | "cta" | "content";

export type DetailProps =
  | {
      type: "roofProLevel";
      label: React.ReactNode;
      level: RoofProLevel;
    }
  | {
      type: DetailType;
      text: React.ReactNode;
      textStyle?: "bold";
      label: React.ReactNode;
      action?: ClickableAction;
      display?: "icon" | "label" | "contentOnly";
    };

type Props = {
  name?: React.ReactNode;
  details: readonly DetailProps[];
  children: React.ReactNode;
};

const typeToIconMap = (type: DetailProps["type"]): SVGImport | undefined => {
  switch (type) {
    case "address":
      return LocationOn;
    case "phone":
      return Phone;
    case "email":
      return Mail;
    case "distance":
      return Directions;
    case "website":
      return Public;
    default:
      return undefined;
  }
};

const DetailsItem = (props: DetailProps) => {
  const classes = useStyles();

  if (props.type === "cta") {
    const { action, label } = props;

    return (
      <div className={[classes.row, classes.cta].join(", ")}>
        <Button className={classes.button} variant="contained" action={action}>
          {label}
        </Button>
      </div>
    );
  }

  if (props.type === "roofProLevel") {
    const { label, level } = props;
    const iconSourceMap: Record<RoofProLevel, SVGImport> = {
      expert: RoofProExpert,
      partner: RoofProPartnerSmall,
      elite: RoofProElite
    };
    const iconSource = iconSourceMap[level as RoofProLevel];

    return (
      <div className={classes.row}>
        <dt className={classes.term}>
          <span className={classes.label}>{label}</span>
        </dt>
        <dd className={classes.description}>
          {iconSource ? (
            <Logo source={iconSource} className={classes.roofProLevelIcon} />
          ) : (
            <pre style={{ color: colours.error }}>
              Error: Level &quot;{level}&quot; does not exist
            </pre>
          )}
          <span className={classes.accessibilityLabel}>{level}</span>
        </dd>
      </div>
    );
  }

  const {
    type,
    label,
    text,
    textStyle,
    action,
    display = type === "content" ? "label" : "icon"
  } = props;
  const WrapperElement = type === "address" ? "address" : "div";
  const icon = typeToIconMap(type);
  const styledText = textStyle === "bold" ? <b>{text}</b> : text;

  return (
    <WrapperElement
      className={classnames([
        classes.row,
        type === "address" && classes.address
      ])}
    >
      <dt className={classes.term}>
        {icon && display === "icon" ? (
          <Icon source={icon} className={classes.icon} />
        ) : null}
        {display !== "contentOnly" ? (
          <Typography
            component="span"
            className={classnames(
              classes.label,
              display === "icon" && classes.accessibilityLabel
            )}
          >
            {label}
          </Typography>
        ) : undefined}
      </dt>
      <dd className={classes.description}>
        {action ? (
          <AnchorLink action={action} className={classes.link}>
            {text}
          </AnchorLink>
        ) : (
          styledText
        )}
      </dd>
    </WrapperElement>
  );
};

const CompanyDetails = ({ name, details, children }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {name && (
        <Typography variant="h5" className={classes.title}>
          {name}
        </Typography>
      )}
      <div>
        {details?.length ? (
          <dl className={classes.list}>
            {details.map((detail, index) => (
              <DetailsItem key={index} {...detail} />
            ))}
          </dl>
        ) : null}
        {children}
      </div>
    </div>
  );
};

export default CompanyDetails;
