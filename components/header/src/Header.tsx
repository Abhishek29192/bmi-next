import Button from "@bmi/button";
import Icon from "@bmi/icon";
import Search from "@bmi/search";
import LanguageSelection, {
  defaultLanguage,
  LanguageSelectionItem,
  LanguageSelectionList
} from "@bmi/language-selection";
import { BMI as BmiIcon } from "@bmi/logo";
import Clickable, { ClickableAction } from "@bmi/clickable";
import Navigation, { LinkList, NavigationList } from "@bmi/navigation";
import Container from "@bmi/container";
import Typography from "@bmi/typography";
import { Backdrop, Paper, Slide, Tab, Tabs } from "@material-ui/core";
import {
  Close,
  KeyboardArrowDown,
  Menu,
  Search as SearchIcon
} from "@material-ui/icons";
import classnames from "classnames";
import React from "react";
import styles from "./Header.module.scss";

type HeaderProps = {
  language?: LanguageSelectionItem;
  languages?: readonly LanguageSelectionList[];
  navigation: readonly NavigationList[];
  utilities: readonly LinkList[];
  logoAction?: ClickableAction;
  activeNavLabel?: string;
  closeLabel?: string;
  isSearchDisabled?: boolean;
  searchAction?: string;
  searchLabel?: string;
  searchPlaceholder?: string;
  openLabel?: string;
  mainMenuTitleLabel?: string;
  mainMenuDefaultLabel?: string;
  languageLabel?: string;
};

const Header = ({
  language = defaultLanguage,
  languages,
  navigation,
  utilities,
  logoAction = { model: "htmlLink", href: "/" },
  activeNavLabel,
  closeLabel = "Close",
  isSearchDisabled,
  searchAction,
  searchLabel = "Search",
  searchPlaceholder = "Search BMI...",
  openLabel = "Open menu",
  mainMenuTitleLabel,
  mainMenuDefaultLabel,
  languageLabel = "Language"
}: HeaderProps) => {
  const $body: HTMLElement =
    typeof document !== "undefined"
      ? document.querySelector("body")
      : undefined;
  const [size, setSize] = React.useState<"small" | "medium" | "large">("small");
  const [showLanguageSelection, setShowLanguageSelection] = React.useState<
    boolean
  >(false);
  const [showSearch, setShowSearch] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<number | boolean>(false);

  const amendClassList = (classValue: string, method: "add" | "remove") => {
    if (!$body) {
      return;
    }
    $body.classList[method](classValue);
  };

  const handleChange = (_event: React.ChangeEvent, newValue: number) => {
    if (value === newValue) {
      amendClassList(styles.MenuIsOpen, "remove");
      setValue(false);
    } else {
      amendClassList(styles.MenuIsOpen, "add");
      setShowSearch(false);
      setValue(newValue);
    }
  };

  const toggleMenu = () => {
    if (typeof value === "number" || value === true) {
      amendClassList(styles.MenuIsOpen, "remove");
      setValue(false);
    } else {
      amendClassList(styles.MenuIsOpen, "add");
      setShowSearch(false);
      setValue(!value);
    }
  };

  const toggleLanguageSelection = () =>
    setShowLanguageSelection(!showLanguageSelection);

  const toggleSearch = () => {
    if (!showSearch) {
      setValue(false);
      amendClassList(styles.MenuIsOpen, "remove");
    }
    setShowSearch(!showSearch);
  };

  const hideAll = () => {
    setValue(false);
    setShowLanguageSelection(false);
    setShowSearch(false);
    amendClassList(styles.MenuIsOpen, "remove");
  };

  const handleResize = ({ currentTarget }) => {
    setSize(
      currentTarget.innerWidth < parseFloat(styles["breakpoint-sm"])
        ? "small"
        : "large"
    );
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
    amendClassList(styles.MenuIsOpen, "remove");
    handleResize({ currentTarget: window });
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
                  onClick={toggleLanguageSelection}
                  variant="text"
                  aria-label={languageLabel}
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
              accessibilityLabel={closeLabel}
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
            <Clickable {...logoAction} className={styles.LogoLink}>
              <Icon className={styles.Logo} source={BmiIcon} />
            </Clickable>
            <nav
              aria-label="Navigation"
              className={styles.Navigation}
              role="navigation"
            >
              <Tabs
                onChange={handleChange}
                scrollButtons="off"
                value={value === true ? 0 : value}
                variant="scrollable"
              >
                {navigation.map(({ label }, key) => (
                  <Tab
                    aria-controls={`navigation-tabpanel-${key}`}
                    className={classnames(
                      styles["NavItem"],
                      activeNavLabel === label && styles["NavItem--selected"]
                    )}
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
            {!isSearchDisabled && (
              <Button
                accessibilityLabel={searchLabel}
                className={styles["SearchButton"]}
                variant={size === "small" ? "text" : "contained"}
                isIconButton
                onClick={toggleSearch}
              >
                <Icon source={SearchIcon} />
              </Button>
            )}
            <Button
              accessibilityLabel={openLabel}
              className={styles["BurgerButton"]}
              variant="text"
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
        open={value !== false || showSearch || showLanguageSelection}
        onClick={hideAll}
      />
      <Slide
        direction={size === "small" ? "left" : "down"}
        in={value !== false}
      >
        <div className={classnames(styles.Drawer, styles.NavDrawer)}>
          <Button
            accessibilityLabel={closeLabel}
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
            setRootValue={setValue}
            mainMenuTitleLabel={mainMenuTitleLabel}
            mainMenuDefaultLabel={mainMenuDefaultLabel}
            languageLabel={languageLabel}
          />
        </div>
      </Slide>
      {!isSearchDisabled && (
        <Slide direction={size === "small" ? "left" : "down"} in={showSearch}>
          <div className={classnames(styles.Drawer, styles.SearchDrawer)}>
            <Button
              accessibilityLabel={closeLabel}
              className={styles.CloseButton}
              isIconButton
              onClick={toggleSearch}
            >
              <Icon source={Close} />
            </Button>
            <Typography variant="h4">How can we help you today?</Typography>
            {showSearch && (
              <Search
                action={searchAction}
                label={searchLabel}
                placeholder={searchPlaceholder}
              />
            )}
          </div>
        </Slide>
      )}
    </Paper>
  );
};

export default Header;
