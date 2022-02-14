import React from "react";
import Typography from "@bmi-digital/components/typography";
import DefaultAnchorLink, {
  ClickableAction
} from "@bmi-digital/components/anchor-link";
import Icon from "@bmi-digital/components/icon";
import { SVGImport } from "@bmi-digital/svg-import";
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
  return (
    <address
      className={classnames(
        styles["LocationCard"],
        isFlat && styles["LocationCard--flat"]
      )}
    >
      <Typography variant="h5">{title}</Typography>
      <dl className={styles["list"]}>
        {details?.map((detail, index) => (
          <LocationItem
            key={index}
            anchorComponent={anchorComponent}
            {...detail}
          />
        ))}
      </dl>
      <div className={styles["foot-note"]}>{footNote}</div>
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
  const typeToIconMap: Record<DetailType, SVGImport> = {
    address: LocationOn,
    phone: Phone,
    email: Mail
  };

  return (
    <>
      <dt className={styles["term"]}>
        {/* eslint-disable-next-line security/detect-object-injection */}
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
