import React from "react";
import classnames from "classnames";
import { Icopal as IcopalLogoSVG } from "@bmi-digital/components/logo";
import Container from "@bmi-digital/components/container";
import Button from "@bmi-digital/components/button";
import styles from "./Footer.module.scss";

type MenuItem = {
  label: string;
  action: {
    model: string;
    href: string;
  };
};

const NavigationItem = ({ label, icon, isLabelHidden, action }: any) => {
  const IconComponent = icon;

  return (
    <li
      className={classnames(
        styles["list-item"],
        isLabelHidden && styles["list-item--icon"]
      )}
    >
      {isLabelHidden ? (
        <Button
          className={styles["icon-link"]}
          isIconButton
          accessibilityLabel={label}
          variant="text"
          hasDarkBackground
          action={action}
        >
          <IconComponent />
        </Button>
      ) : (
        <Button
          startIcon={icon ? <IconComponent /> : undefined}
          className={styles["link"]}
          hasDarkBackground
          variant="text"
          action={action}
        >
          {label}
        </Button>
      )}
    </li>
  );
};

const BmiFooter = ({ menu }: { menu: MenuItem[] }) => {
  return (
    <div className={styles.Footer}>
      <Container className={styles.container}>
        <a href="http://www.icopal.co.uk/">
          <IcopalLogoSVG className={styles.logo} />
        </a>
        {menu && menu.length && (
          <ul className={classnames(styles["list"], styles["list--inline"])}>
            {menu.map((menuItem, index) => (
              <NavigationItem key={index} {...menuItem} />
            ))}
          </ul>
        )}
      </Container>
    </div>
  );
};

export default BmiFooter;
