import React from "react";
import classnames from "classnames";
import IcopalLogoSVG from "@bmi/logo/svgs/Icopal.svg";
import Container from "@bmi/container";
import Button from "@bmi/button";
import styles from "./Footer.module.scss";

const NavigationItem = ({ label, icon, isLabelHidden, action }: any) => {
  const IconComponent = icon;

  return (
    <li
      className={classnames(styles["list-item"], {
        [styles["list-item--icon"]]: isLabelHidden
      })}
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

const BmiFooter = ({ menu }: any) => {
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
