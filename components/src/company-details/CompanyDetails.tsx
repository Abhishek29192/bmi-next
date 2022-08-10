import { SVGImport } from "@bmi-digital/svg-import";
import {
  Directions,
  LocationOn,
  Mail,
  Phone,
  Public
} from "@material-ui/icons";
import React from "react";
import classnames from "classnames";
import AnchorLink from "../anchor-link/AnchorLink";
import Button from "../button/Button";
import { ClickableAction } from "../clickable/Clickable";
import Icon from "../icon/Icon";
import Logo, {
  RoofProElite,
  RoofProExpert,
  RoofProPartnerSmall
} from "../logo";
import Typography from "../typography/Typography";
import styles from "./CompanyDetails.module.scss";

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
  if (props.type === "cta") {
    const { action, label } = props;

    return (
      <div className={[styles["row"], styles["row--cta"]].join(", ")}>
        <Button
          className={styles["cta-button"]}
          variant="contained"
          action={action}
        >
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
      <div className={styles["row"]}>
        <dt className={styles["term"]}>
          <span className={styles["label"]}>{label}</span>
        </dt>
        <dd className={styles["description"]}>
          {iconSource ? (
            <Logo source={iconSource} className={styles[`roofProLevelIcon`]} />
          ) : (
            <pre style={{ color: "#d6001c" }}>
              Error: Level &quot;{level}&quot; does not exist
            </pre>
          )}
          <span className={styles["accessibility-label"]}>{level}</span>
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
    <WrapperElement className={styles["row"]}>
      <dt className={styles["term"]}>
        {icon && display === "icon" ? (
          <Icon source={icon} className={styles["icon"]} />
        ) : null}
        {display !== "contentOnly" ? (
          <Typography
            component="span"
            className={classnames(
              styles["label"],
              display === "icon" && styles["accessibility-label"]
            )}
          >
            {label}
          </Typography>
        ) : undefined}
      </dt>
      <dd className={styles["description"]}>
        {action ? (
          <AnchorLink action={action} className={styles["link"]}>
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
  return (
    <div className={styles["CompanyDetails"]}>
      {name && (
        <Typography variant="h5" className={styles["title"]}>
          {name}
        </Typography>
      )}
      <div className={styles["scrollbar"]}>
        {details?.length ? (
          <dl className={styles["list"]}>
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