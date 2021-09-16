import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import Typography from "@bmi/typography";
import Icon from "@bmi/icon";
import { BMI } from "@bmi/logo";
import { Notifications, Menu, Close } from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import { findAccountTier, isSuperOrMarketAdmin } from "../../lib/account";
import { Link } from "../Link";
import UserMenu from "../UserMenu";
import { NotificationsPanel } from "../NotificationsPanel";
import { useAccountContext } from "../../context/AccountContext";
import styles from "./styles.module.scss";

type HeaderLink = {
  href: string;
  label: string;
  isExternal?: boolean;
};

export type HeaderProps = {
  title: string;
  contactUsLink?: HeaderLink;
  globalExternalLink?: HeaderLink;
};

export const Header = ({
  title,
  contactUsLink,
  globalExternalLink
}: HeaderProps) => {
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = React.useState(false);
  const { account } = useAccountContext();

  const subHeading = useMemo(() => {
    return isSuperOrMarketAdmin(account)
      ? t(`roles.${account.role}`)
      : t(`tier.${findAccountTier(account)}`);
  }, [account]);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.upperHeader}>
          <nav>
            {contactUsLink ? (
              <Link
                href={contactUsLink.href}
                isExternal={contactUsLink.isExternal}
              >
                {contactUsLink.label}
              </Link>
            ) : null}

            {globalExternalLink ? (
              <Link
                href={globalExternalLink.href}
                isExternal={globalExternalLink.isExternal}
              >
                {globalExternalLink.label}
              </Link>
            ) : null}
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
            <IconButton onClick={toggle} id="notifications-panel-toggle">
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
              {subHeading}
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
