import React from "react";
import Typography from "@bmi/typography";
import DefaultAnchorLink, { ClickableAction } from "@bmi/anchor-link";
import Icon from "@bmi/icon";
import { LocationOn, Phone, Mail } from "@material-ui/icons";
import classnames from "classnames";
import styles from "./LocationCard.module.scss";

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
  details: readonly [DetailProps, ...DetailProps[]];
  footNote: React.ReactNode;
  isFlat?: boolean;
};

export const LocationItem = ({
  anchorComponent: AnchorLink = DefaultAnchorLink,
  text,
  action,
  label,
  type
}: DetailProps) => {
  const typeToIconMap: Record<DetailType, SVGImport> = {
    address: LocationOn,
    phone: Phone,
    email: Mail
  };

  return (
    <>
      <dt className={styles["term"]}>
        <Icon source={typeToIconMap[type]} className={styles["icon"]} />
        <Typography className={styles["label"]}>{label}</Typography>
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
    </>
  );
};

const LocationCard = ({
  anchorComponent,
  title,
  details,
  footNote,
  isFlat
}: Props) => {
  return (
    <address
      className={classnames(styles["LocationCard"], {
        [styles["LocationCard--flat"]]: isFlat
      })}
    >
      <Typography variant="h5">{title}</Typography>
      <dl className={styles["list"]}>
        {details.map((detail, index) => (
          <LocationItem
            anchorComponent={anchorComponent}
            key={index}
            {...detail}
          />
        ))}
      </dl>
      <div className={styles["foot-note"]}>{footNote}</div>
    </address>
  );
};

export default LocationCard;
