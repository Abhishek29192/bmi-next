import React from "react";
import Button, { ClickableAction } from "@bmi/button";
import Container from "@bmi/container";
import styles from "./Footer.module.scss";
import Typography from "@bmi/typography";
import Grid from "@bmi/grid";
import classnames from "classnames";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import StandardLogo from "./svgs/Standard.svg";
import StandardCenteredLogo from "./svgs/Standard_centered.svg";

export type MenuItem = {
  icon?: SVGImport;
  label: string;
  action?: ClickableAction;
  isLabelHidden?: boolean;
  menu?: MenuItem[];
};

type Props = {
  mainNavigation: readonly MenuItem[];
  secondaryNavigation?: readonly MenuItem[];
  logo?: SVGImport;
};

const NavigationItem = ({ label, icon, isLabelHidden, action }: MenuItem) => {
  const IconComponent = icon;

  return (
    <li
      className={classnames(styles["list-item"], {
        [styles["list-item--icon"]]: isLabelHidden
      })}
    >
      {isLabelHidden && IconComponent ? (
        <Button
          className={styles["icon-link"]}
          isIconButton
          accessibilityLabel={label}
          variant="text"
          hasDarkBackground
          action={action}
        >
          <IconComponent className={styles["icon"]} />
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

const MainNavigation = ({ menu }: { menu: readonly MenuItem[] }) => {
  return (
    <Grid container spacing={3} justify="space-between">
      {menu.map((menuItem, index) => {
        return (
          <Grid key={index} item>
            <Typography variant="h4">{menuItem.label}</Typography>
            {menuItem.menu && menuItem.menu.length && (
              <nav>
                <ul className={styles["list"]}>
                  {menuItem.menu.map((subMenuItem, index) => (
                    <NavigationItem key={index} {...subMenuItem} />
                  ))}
                </ul>
              </nav>
            )}
          </Grid>
        );
      })}
    </Grid>
  );
};

const SecondaryNavigation = ({
  logo,
  menu
}: {
  logo?: SVGImport;
  menu?: readonly MenuItem[];
}) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));
  const Logo = logo;
  const StandardResponsiveLogo = matches ? StandardLogo : StandardCenteredLogo;

  return (
    <div className={styles["secondary-navigation"]}>
      {logo && (
        <div className={styles["logo"]}>
          <Logo />
        </div>
      )}
      {menu && menu.length && (
        <ul className={classnames(styles["list"], styles["list--inline"])}>
          {menu.map((menuItem, index) => (
            <NavigationItem key={index} {...menuItem} />
          ))}
        </ul>
      )}
      <div className={styles["standard-logo"]}>
        <StandardResponsiveLogo />
      </div>
    </div>
  );
};

const Footer = ({ mainNavigation, secondaryNavigation, logo }: Props) => {
  return (
    <div className={styles["Footer"]}>
      <Container>
        <MainNavigation menu={mainNavigation} />
        <SecondaryNavigation menu={secondaryNavigation} logo={logo} />
      </Container>
    </div>
  );
};

export default Footer;
