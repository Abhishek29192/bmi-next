import { SVGImport } from "@bmi-digital/svg-import";
import { useMediaQuery, useTheme } from "@material-ui/core";
import classnames from "classnames";
import React from "react";
import DefaultButton from "../button/Button";
import { ClickableAction } from "../clickable/Clickable";
import Container from "../container/Container";
import Grid from "../grid/Grid";
import Typography from "../typography/Typography";
import { useStyles } from "./styles";
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
  const classes = useStyles();

  const IconComponent = icon;

  const Button = component || DefaultButton;

  return (
    <li
      className={classnames(
        classes.listItem,
        isLabelHidden && classes.listItemIcon
      )}
    >
      {isLabelHidden && IconComponent ? (
        <Button
          className={classes.iconLink}
          isIconButton
          accessibilityLabel={label}
          variant="text"
          hasDarkBackground
          action={action}
        >
          <IconComponent className={classes.icon} />
        </Button>
      ) : (
        <Button
          startIcon={IconComponent ? <IconComponent /> : undefined}
          className={classes.link}
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
  const classes = useStyles();
  return (
    <Grid container spacing={3} justifyContent="space-between">
      {menu &&
        menu.map((menuItem, index) => {
          return (
            <Grid key={index} item>
              <Typography variant="h4">{menuItem.label}</Typography>
              {menuItem.menu && menuItem.menu.length && (
                <nav>
                  <ul className={classes.list}>
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
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));
  const Logo = logo;
  const StandardResponsiveLogo = matches ? StandardLogo : StandardCenteredLogo;

  return (
    <div className={classes.secondaryNavigation}>
      {Logo && (
        <div className={classes.logo}>
          <Logo />
        </div>
      )}
      {menu && menu.length && (
        <ul className={classnames(classes.list, classes.listInline)}>
          {menu.map((menuItem, index) => (
            <NavigationItem
              key={index}
              component={buttonComponent}
              {...menuItem}
            />
          ))}
        </ul>
      )}
      <div className={classes.standardLogo}>
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
  const classes = useStyles();
  return (
    <div
      className={classnames(
        classes.root,
        mainNavigation.length === 0 && classes.noBorder
      )}
      data-testid="footer"
    >
      <Container>
        {!!mainNavigation.length && (
          <MainNavigation
            menu={mainNavigation}
            buttonComponent={buttonComponent}
          />
        )}
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
