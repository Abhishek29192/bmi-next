import React from "react";
import Button from "@bmi/button";
import Typography from "@bmi/typography";
import AnchorLink, { ClickableAction } from "@bmi/anchor-link";
import Icon from "@bmi/icon";
import Logo, { RoofProExpert, RoofProPartner, RoofProElite } from "@bmi/logo";
import styles from "./CompanyDetails.module.scss";

import {
  LocationOn,
  Phone,
  Mail,
  Directions,
  Public
} from "@material-ui/icons";

type RoofProLevel = "expert" | "partner" | "elite";

type DetailTypeWithIcons =
  | "address"
  | "phone"
  | "email"
  | "distance"
  | "website";

type DetailType = DetailTypeWithIcons | "cta" | "content";

type DetailProps =
  | {
      type: "roofProLevel";
      label: React.ReactNode;
      level: RoofProLevel;
    }
  | {
      type: DetailType;
      text: React.ReactNode;
      label: React.ReactNode;
      action?: ClickableAction;
    };

type Props = {
  name: React.ReactNode;
  details: readonly DetailProps[];
  children: React.ReactNode;
};

const typeToIconMap: Record<DetailTypeWithIcons, SVGImport> = {
  address: LocationOn,
  phone: Phone,
  email: Mail,
  distance: Directions,
  website: Public
};

const DetailsItem = (props: DetailProps) => {
  const icon = typeToIconMap[props.type];

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

  if (props.type === "content") {
    const { label, text } = props;

    return (
      <div className={styles["row"]}>
        <dt className={styles["term"]}>
          <span className={styles["label"]}>{label}</span>
        </dt>
        <dd className={styles["description"]}>{text}</dd>
      </div>
    );
  }

  if (props.type === "roofProLevel") {
    const { label, level } = props;
    const iconSourceMap: Record<RoofProLevel, SVGImport> = {
      expert: RoofProExpert,
      partner: RoofProPartner,
      elite: RoofProElite
    };

    return (
      <div className={styles["row"]}>
        <dt className={styles["term"]}>
          <span className={styles["label"]}>{label}</span>
        </dt>
        <dd className={styles["description"]}>
          <Logo
            source={iconSourceMap[level]}
            className={styles[`roofProLevelIcon--${level}`]}
          />
          <span className={styles["accessibility-label"]}>{level}</span>
        </dd>
      </div>
    );
  }

  const { type, label, text, action } = props;
  const WrapperElement = type === "address" ? "address" : "div";

  return (
    <WrapperElement className={styles["row"]}>
      <dt className={styles["term"]}>
        {icon ? <Icon source={icon} className={styles["icon"]} /> : null}
        <Typography
          className={[styles["label"], styles["accessibility-label"]].join(
            ", "
          )}
        >
          {label}
        </Typography>
      </dt>
      <dd className={styles["description"]}>
        {action ? (
          <AnchorLink action={action} className={styles["link"]}>
            {text}
          </AnchorLink>
        ) : (
          text
        )}
      </dd>
    </WrapperElement>
  );
};

const CompanyDetails = ({ name, details, children }: Props) => {
  return (
    <div className={styles["CompanyDetails"]}>
      <Typography variant="h5" className={styles["title"]}>
        {name}
      </Typography>
      <div className={styles["scrollableContent"]}>
        {details.length ? (
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
