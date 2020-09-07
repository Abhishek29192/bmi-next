import Button from "@bmi/button";
import Icon from "@bmi/icon";
import InputGroup from "@bmi/input-group";
import LanguageSelection, {
  defaultLanguage,
  LanguageSelectionItem,
  LanguageSelectionList
} from "@bmi/language-selection";
import BmiIcon from "@bmi/logo/svgs/BMI.svg";
import Navigation, { LinkList, NavitationList } from "@bmi/navigation";
import TextField from "@bmi/text-field";
import Typography from "@bmi/typography";
import {
  Backdrop,
  Container,
  Paper,
  Slide,
  Tab,
  Tabs
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { Close, KeyboardArrowDown, Menu, Search } from "@material-ui/icons";
import classnames from "classnames";
import React from "react";
import styles from "./Header.module.scss";

type HeaderProps = {
  language?: LanguageSelectionItem;
  languages?: readonly LanguageSelectionList[];
  navigation: readonly NavitationList[];
  utilities: readonly LinkList[];
};

const Header = ({
  language = defaultLanguage,
  languages,
  navigation,
  utilities
}: HeaderProps) => {
  const { breakpoints } = useTheme();
  breakpoints.values.md = 800; // Override
  const $body: HTMLElement = document.querySelector("body");
  const [size, setSize] = React.useState<"small" | "medium" | "large">("small");
  const [showLanguageSelection, setShowLanguageSelection] = React.useState<
    boolean
  >(false);
  const [showSearch, setShowSearch] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<number | boolean>(false);

  const handleChange = (_event: React.ChangeEvent, newValue: number) => {
    if (value === newValue) {
      $body.classList.remove(styles.MenuIsOpen);
      setValue(false);
    } else {
      $body.classList.add(styles.MenuIsOpen);
      setShowSearch(false);
      setValue(newValue);
    }
  };

  const toggleMenu = () => {
    if (typeof value === "number" || value === true) {
      $body.classList.remove(styles.MenuIsOpen);
      setValue(false);
    } else {
      $body.classList.add(styles.MenuIsOpen);
      setShowSearch(false);
      setValue(!value);
    }
  };

  const toggleLanguageSelection = () =>
    setShowLanguageSelection(!showLanguageSelection);

  const toggleSearch = () => {
    if (!showSearch) setValue(false);
    setShowSearch(!showSearch);
  };

  const handleResize = ({ target }) => {
    setSize(target.innerWidth < breakpoints.width("md") ? "small" : "large");
    // @todo: calculate from `es` somehow...
    // const $NavigationBarLeft: HTMLElement = document.querySelector(
    //   `.${styles.NavigationBar__Left}`
    // );
    // const $NavigationBarRight: HTMLElement = document.querySelector(
    //   `.${styles.NavigationBar__Right}`
    // );
    // const es = $NavigationBarRight.offsetLeft - $NavigationBarLeft.offsetWidth;
    // setSize(es <= 20 ? "small" : "large");
  };

  React.useEffect(() => {
    handleResize({ target: window });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Paper className={styles.Header} component="header" elevation={3} square>
      <nav
        aria-label="Utilities"
        className={styles.UtilitiesBar}
        role="navigation"
      >
        <Container>
          <ul>
            {utilities.map(({ label, action }, key) => (
              <li key={`utilities-link-${key}`} className={styles.NavItem}>
                <Button
                  className={styles.UtilitiesButton}
                  action={action}
                  variant="text"
                >
                  {label}
                </Button>
              </li>
            ))}
            {languages && (
              <li className={styles.NavItem}>
                <Button
                  className={classnames(
                    styles.UtilitiesButton,
                    styles.LanguageSelectionButton,
                    {
                      [styles[
                        "LanguageSelectionButton--active"
                      ]]: showLanguageSelection
                    }
                  )}
                  component={Link}
                  onClick={toggleLanguageSelection}
                  variant="text"
                >
                  {language.icon && (
                    <Icon
                      source={language.icon}
                      className={styles.LanguageIcon}
                    />
                  )}
                  {language.code}
                  <span
                    className={classnames(styles.downArrow, {
                      [styles["downArrow--up"]]: showLanguageSelection
                    })}
                  >
                    ▾
                  </span>
                </Button>
              </li>
            )}
          </ul>
        </Container>
      </nav>
      {languages && (
        <Slide
          direction={size === "small" ? "left" : "down"}
          in={showLanguageSelection}
        >
          <div className={classnames(styles.Drawer, styles.LanguageDrawer)}>
            <Button
              accessibilityLabel="Close"
              className={styles.CloseButton}
              isIconButton
              onClick={toggleLanguageSelection}
            >
              <Icon source={Close} />
            </Button>
            <Container>
              <LanguageSelection languages={languages} />
            </Container>
          </div>
        </Slide>
      )}
      <div className={styles.NavigationBar}>
        <Container>
          <div className={styles.NavigationBar__Left}>
            <Icon className={styles.Logo} source={BmiIcon} />
            <nav
              aria-label="Navigation"
              className={styles.Navigation}
              role="navigation"
            >
              <Tabs onChange={handleChange} value={value === true ? 0 : value}>
                {navigation.map(({ label }, key) => (
                  <Tab
                    aria-controls={`navigation-tabpanel-${key}`}
                    className={styles.NavItem}
                    icon={<KeyboardArrowDown />}
                    id={`navigation-tab-${key}`}
                    key={`navigation-tab-${key}`}
                    label={label}
                  />
                ))}
              </Tabs>
            </nav>
          </div>
          <div className={styles.NavigationBar__Right}>
            <Button
              accessibilityLabel="Search"
              isIconButton
              onClick={toggleSearch}
            >
              <Icon source={Search} />
            </Button>
            <Button
              accessibilityLabel="Open menu"
              className={styles.BurgerButton}
              isIconButton
              onClick={toggleMenu}
            >
              <Icon source={Menu} />
            </Button>
          </div>
        </Container>
      </div>
      <Backdrop
        className={styles.Backdrop}
        open={value !== false || showSearch}
      />
      <Slide
        direction={size === "small" ? "left" : "down"}
        in={value !== false}
      >
        <div className={classnames(styles.Drawer, styles.NavDrawer)}>
          <Button
            accessibilityLabel="Close"
            className={styles.CloseButton}
            isIconButton
            onClick={toggleMenu}
          >
            <Icon source={Close} />
          </Button>
          <Navigation
            menu={navigation}
            initialDepth={typeof value === "number" ? 1 : 0}
            initialValue={value}
            toggleLanguageSelection={toggleLanguageSelection}
            utilities={utilities}
          />
        </div>
      </Slide>
      <Slide direction={size === "small" ? "left" : "down"} in={showSearch}>
        <div className={classnames(styles.Drawer, styles.SearchDrawer)}>
          <Button
            accessibilityLabel="Close"
            className={styles.CloseButton}
            isIconButton
            onClick={toggleSearch}
          >
            <Icon source={Close} />
          </Button>
          <Typography variant="h4">How can we help you today?</Typography>
          <InputGroup
            input={
              <TextField
                name="input-banner-text-field"
                variant="hybrid"
                label="Search BMI..."
              />
            }
            button={
              // TODO: Use a submit button for Form control functionalities.
              <Button accessibilityLabel="Search" isIconButton>
                <Icon source={Search} />
              </Button>
            }
          />
        </div>
      </Slide>
    </Paper>
  );
};

export default Header;
