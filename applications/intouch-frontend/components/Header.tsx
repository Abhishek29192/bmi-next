import React from "react";
import Link from "next/link";
import Typography from "@bmi/typography";
import Icon from "@bmi/icon";
import { Notifications, Menu, Close } from "@material-ui/icons";
import { BMI } from "@bmi/logo";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import UserMenu from "./UserMenu";
import NotificationsPanel from "./NotificationsPanel";
import styles from "./styles/Header.module.scss";

interface Props {
  title: string;
}

export const Header = ({ title }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.upperHeader}>
          <nav>
            <Link href="/">Contact</Link>
            <Link href="/">BMI Merits</Link>
          </nav>
        </div>

        <div className={styles.midHeader}>
          <Link href="/">
            <Icon
              source={BMI}
              className={styles.logo}
              style={{ width: 50, display: "block" }}
            />
          </Link>
          <div className={styles.midHeaderNav}>
            <IconButton onClick={toggle}>
              <Icon source={Notifications} color="primary" />
            </IconButton>
            <Icon source={Menu} style={{ width: 40, display: "block" }} />
          </div>
        </div>

        <div className={styles.lowerHeader}>
          <div className={styles.lowerHeaderMeta}>
            <Typography variant="h3">{title}</Typography>
            <Divider
              orientation="vertical"
              flexItem
              style={{ margin: "0 1rem" }}
            />
            <Typography variant="h3" className={styles.lowerHeaderUserLevel}>
              Expert
            </Typography>
          </div>

          <div className={styles.lowerHeaderNav}>
            <IconButton onClick={toggle}>
              <Icon source={Notifications} color="primary" />
            </IconButton>
            <UserMenu />
          </div>
        </div>
      </div>
      <NotificationsPanel open={isOpen}>
        <IconButton onClick={toggle}>
          <Icon source={Close} color="primary" />
        </IconButton>
      </NotificationsPanel>
    </div>
  );
};
