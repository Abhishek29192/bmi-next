import React from "react";
import { SVGImport } from "@bmi-digital/svg-import";
import classnames from "classnames";
import { useTheme } from "@material-ui/core";
import { useMediaQuery } from "@material-ui/core";
import DefaultButton from "../button/Button";
import { ClickableAction } from "../clickable/Clickable";
import Container from "../container/Container";
import Typography from "../typography/Typography";
import Grid from "../grid/Grid";
import styles from "./Footer.module.scss";
import StandardLogo from "./svgs/Standard.svg";
import StandardCenteredLogo from "./svgs/Standard_centered.svg";

export type MenuItem = {
  component?: React.ComponentType<any>; // TODO
  icon?: SVGImport;
  label: string;
  action?: ClickableAction;
  isLabelHidden?: boolean;
  menu?: MenuItem[];
};

type Props = {
  buttonComponent?: React.ComponentType<any>; // TODO
  mainNavigation: readonly MenuItem[];
  secondaryNavigation?: readonly MenuItem[];
  logo?: SVGImport;
};

const NavigationItem = ({
  component,
  label,
  icon,
  isLabelHidden,
  action
}: MenuItem) => {
  const IconComponent = icon;

  const Button = component || DefaultButton;

  return (
    <li
      className={classnames(styles["list-item"], {
        [styles["list-item--icon"]!]: isLabelHidden
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
          startIcon={IconComponent ? <IconComponent /> : undefined}
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

const MainNavigation = ({
  buttonComponent,
  menu
}: {
  buttonComponent?: React.ComponentType<any>; // TODO
  menu: readonly MenuItem[];
}) => {
  return (
    <Grid container spacing={3} justifyContent="space-between">
      {menu &&
        menu.map((menuItem, index) => {
          return (
            <Grid key={index} item>
              <Typography variant="h4">{menuItem.label}</Typography>
              {menuItem.menu && menuItem.menu.length && (
                <nav>
                  <ul className={styles["list"]}>
                    {menuItem.menu.map((subMenuItem, index) => (
                      <NavigationItem
                        key={index}
                        component={buttonComponent}
                        {...subMenuItem}
                      />
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
  buttonComponent,
  logo,
  menu
}: {
  buttonComponent?: React.ComponentType<any>; // TODO
  logo?: SVGImport;
  menu?: readonly MenuItem[];
}) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));
  const Logo = logo;
  const StandardResponsiveLogo = matches ? StandardLogo : StandardCenteredLogo;

  return (
    <div className={styles["secondary-navigation"]}>
      {Logo && (
        <div className={styles["logo"]}>
          <Logo />
        </div>
      )}
      {menu && menu.length && (
        <ul className={classnames(styles["list"], styles["list--inline"])}>
          {menu.map((menuItem, index) => (
            <NavigationItem
              key={index}
              component={buttonComponent}
              {...menuItem}
            />
          ))}
        </ul>
      )}
      <div className={styles["standard-logo"]}>
        <StandardResponsiveLogo />
      </div>
    </div>
  );
};

const Footer = ({
  buttonComponent,
  mainNavigation,
  secondaryNavigation,
  logo
}: Props) => {
  return (
    <div className={styles["Footer"]}>
      <Container>
        <MainNavigation
          menu={mainNavigation}
          buttonComponent={buttonComponent}
        />
        <SecondaryNavigation
          menu={secondaryNavigation}
          logo={logo}
          buttonComponent={buttonComponent}
        />
      </Container>
    </div>
  );
};

export default Footer;
