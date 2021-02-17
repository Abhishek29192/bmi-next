import React from "react";
import classnames from "classnames";
import ChevronRightIcon from "@material-ui/icons/KeyboardArrowRight";
import Card from "@bmi/card";
import Typography from "@bmi/typography";
import styles from "./LinkCard.module.scss";

type Props = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onClick?: () => void;
  onCloseClick?: () => void;
};

const LinkCard = ({
  title,
  subtitle,
  isOpen = false,
  children,
  onClick,
  onCloseClick
}: Props) => {
  return (
    <Card
      className={classnames(styles["LinkCard"], {
        [styles[`LinkCard--selected`]]: isOpen
      })}
      onClick={!isOpen ? onClick : null}
    >
      <div className={styles["item"]}>
        <Typography gutterBottom variant="h6">
          {title}
        </Typography>
        <Typography className={styles["subtitle"]}>{subtitle}</Typography>
      </div>
      <div className={styles["icon"]}>
        <ChevronRightIcon onClick={isOpen ? onCloseClick : null} />
      </div>
      <div
        className={classnames(styles["details"], {
          [styles[`details--selected`]]: isOpen
        })}
      >
        {children}
      </div>
    </Card>
  );
};

export default LinkCard;
