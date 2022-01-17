import Button from "@bmi/button";
import Icon from "@bmi/icon";
import Search from "@bmi/search";
import LanguageSelection, {
  LanguageSelectionItem,
  LanguageSelectionList
} from "@bmi/language-selection";
import { BMI as BmiIcon } from "@bmi/logo";
import Clickable, { ClickableAction, ClickableProps } from "@bmi/clickable";
import Navigation, {
  LinkList,
  NavigationList,
  NavigationListButton
} from "@bmi/navigation";
import Container from "@bmi/container";
import Typography from "@bmi/typography";
import DefaultTab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Backdrop from "@material-ui/core/Backdrop";
import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import Close from "@material-ui/icons/Close";
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";
import Menu from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import ShoppingCartOutlined from "@material-ui/icons/ShoppingCartOutlined";
import classnames from "classnames";
import React, { forwardRef } from "react";
import styles from "./Header.module.scss";
import {
  getElementWidths,
  getSize,
  HeaderSizes
} from "./utils/widthCalculations";

type HeaderProps = {
  language?: LanguageSelectionItem;
  languages?: readonly LanguageSelectionList[];
  navigation: readonly NavigationList[];
  utilities: readonly LinkList[];
  logoAction?: ClickableAction;
  logoLabel?: string;
  activeNavLabel?: string;
  closeLabel?: string;
  searchButtonComponent?: React.ComponentType<any>; // TODO
  navigationButtonComponent?: React.ComponentType<any>; // TODO
  promoButtonComponent?: React.ComponentType<any>; // TODO
  tabComponent?: React.ComponentType<any>; // TODO
  isSearchDisabled?: boolean;
  isOnSearchPage?: boolean;
  isBasketEmpty?: boolean;
  searchAction?: string;
  searchLabel?: string;
  basketAction?: ClickableAction;
  searchPlaceholder?: string;
  basketLabel?: string;
  searchTitle?: string;
  openLabel?: string;
  mainMenuTitleLabel?: string;
  mainMenuDefaultLabel?: string;
  languageLabel?: string;
  languageIntroduction?: React.ReactNode;
};

const Header = ({
  language,
  languages,
  navigation,
  utilities,
  logoAction = { model: "htmlLink", href: "/" },
  logoLabel = "Link to home",
  activeNavLabel,
  closeLabel = "Close",
  searchButtonComponent,
  navigationButtonComponent,
  promoButtonComponent,
  tabComponent: Tab = DefaultTab,
  isSearchDisabled,
  isOnSearchPage,
  isBasketEmpty,
  searchAction,
  searchLabel = "Search",
  searchPlaceholder = "Search BMI...",
  basketAction,
  basketLabel = "Basket",
  searchTitle = "How can we help you today?",
  openLabel = "Open menu",
  mainMenuTitleLabel,
  mainMenuDefaultLabel,
  languageLabel,
  languageIntroduction
}: HeaderProps) => {
  const body =
    typeof document !== "undefined"
      ? document.querySelector("body")
      : undefined;
  const [sizes, setSizes] = React.useState<HeaderSizes>([
    "small",
    "medium",
    "large"
  ]);
  const [showLanguageSelection, setShowLanguageSelection] =
    React.useState<boolean>(false);
  const [showSearch, setShowSearch] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<number | boolean>(false);
  const elementWidths = getElementWidths(navigation);

  const amendClassList = (classValue: string, method: "add" | "remove") => {
    if (!body) {
      return;
    }
    // eslint-disable-next-line security/detect-object-injection
    body.classList[method](classValue);
  };

  const handleChange = (
    _event: React.ChangeEvent<Record<string, unknown>>,
    newValue: any
  ) => {
    if (value === newValue) {
      amendClassList(styles.MenuIsOpen!, "remove");
      setValue(false);
    } else {
      amendClassList(styles.MenuIsOpen!, "add");
      setShowSearch(false);
      setValue(newValue);
    }
  };

  const toggleMenu = () => {
    if (typeof value === "number" || value === true) {
      amendClassList(styles.MenuIsOpen!, "remove");
      setValue(false);
    } else {
      amendClassList(styles.MenuIsOpen!, "add");
      setShowSearch(false);
      setValue(!value);
    }
  };

  const toggleLanguageSelection = () =>
    setShowLanguageSelection(!showLanguageSelection);

  const toggleSearch = () => {
    if (!showSearch) {
      setValue(false);
      amendClassList(styles.MenuIsOpen!, "remove");
    }
    setShowSearch(!showSearch);
  };

  const hideAll = () => {
    setValue(false);
    setShowLanguageSelection(false);
    setShowSearch(false);
    amendClassList(styles.MenuIsOpen!, "remove");
  };

  const handleResize = ({ currentTarget }: Pick<UIEvent, "currentTarget">) => {
    if (!currentTarget || !("innerWidth" in currentTarget)) {
      return;
    }
    const target = currentTarget as { innerWidth: number };
    setSizes(getSize(target.innerWidth, elementWidths));
  };

  React.useEffect(() => {
    amendClassList(styles.MenuIsOpen!, "remove");
    handleResize({ currentTarget: window });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const QUERY_KEY = "q";
  const params = new URLSearchParams(
    typeof window !== `undefined` ? window.location.search : ""
  );
  const query = params.get(QUERY_KEY);

  // Fallback if language doesn't exist in region.json - e.g. Group site
  // (which can't exist there as code needs to be unique in that file)
  if (!language) {
    language = {
      code: "EN",
      icon: "/icons/flags/globe.svg",
      label: ""
    };
  }

  return (
    <Paper
      className={classnames(
        styles["Header"],
        ...sizes.map((size) => styles[`Header--${size}`])
      )}
      component="header"
      elevation={3}
      square
    >
      <nav
        aria-label="Utilities"
        className={styles["utilities-bar"]}
        role="navigation"
      >
        <Container>
          <ul>
            {utilities.map(({ label, action }, key) => (
              <li key={`utilities-link-${key}`} className={styles["nav-item"]}>
                <Button
                  className={styles["utilities-button"]}
                  action={action}
                  variant="text"
                >
                  {label}
                </Button>
              </li>
            ))}
            {language && languages && (
              <li className={styles["nav-item"]}>
                <Button
                  className={classnames(
                    styles["utilities-button"],
                    styles["language-selection-button"],
                    {
                      [styles["language-selection-button--active"]!]:
                        showLanguageSelection
                    }
                  )}
                  onClick={toggleLanguageSelection}
                  variant="text"
                  aria-label={languageLabel}
                >
                  {language.icon &&
                    (typeof language.icon === "string" ? (
                      <img
                        width="20px"
                        height="16px"
                        className={styles["language-icon"]}
                        src={language.icon}
                        alt={language.label}
                      />
                    ) : (
                      <Icon
                        width="20px"
                        height="16px"
                        source={language.icon}
                        className={styles["language-icon"]}
                      />
                    ))}
                  {language.code.toUpperCase()}
                  <span
                    className={classnames(styles["down-arrow"], {
                      [styles["down-arrow--up"]!]: showLanguageSelection
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
          direction={!sizes.length ? "left" : "down"}
          in={showLanguageSelection}
        >
          <div
            className={classnames(styles["drawer"], styles["language-drawer"])}
          >
            <Button
              accessibilityLabel={closeLabel}
              className={styles["close-button"]}
              isIconButton
              onClick={hideAll}
            >
              <Icon source={Close} />
            </Button>
            <div className={styles["back-navigation"]}>
              <NavigationListButton
                component={Button}
                className={styles["back-button"]}
                startIcon={<ChevronLeft className={styles["chevronLeft"]} />}
                endIcon={false}
                onClick={toggleLanguageSelection}
              >
                {mainMenuDefaultLabel}
              </NavigationListButton>
              <hr className={styles["separator"]} />
            </div>
            <Container wrapperClassName={styles["language-container"]}>
              <LanguageSelection
                introduction={languageIntroduction}
                languages={languages}
                forceMobile={!sizes.length}
              />
            </Container>
          </div>
        </Slide>
      )}
      <div className={styles["navigation-bar"]}>
        <Container>
          <div className={styles["navigation-bar-content"]}>
            <Clickable
              {...logoAction}
              className={styles["logo-link"]}
              aria-label={logoLabel}
            >
              <Icon className={styles["logo"]} source={BmiIcon} />
            </Clickable>
            <nav
              aria-label="Navigation"
              className={styles["navigation"]}
              role="navigation"
            >
              <Tabs
                onChange={handleChange}
                scrollButtons="off"
                value={value === true ? 0 : value}
                variant="scrollable"
              >
                {navigation.map(({ label, action, menu }, key) => {
                  let clickableAction = action;

                  if (menu && menu.length === 1 && menu[0].action) {
                    clickableAction = menu[0].action;
                  }

                  if (clickableAction) {
                    const ClickableNavItem = (
                      { children, ...props }: ClickableProps,
                      ref: any
                    ) => {
                      return (
                        <Clickable {...clickableAction} {...props}>
                          {children &&
                            React.Children.map(children, (child) =>
                              child
                                ? React.cloneElement(child, {
                                    children: label
                                  })
                                : null
                            )}
                        </Clickable>
                      );
                    };

                    return (
                      <Tab
                        className={classnames(
                          styles["nav-item"],
                          styles["nav-item--no-children"],
                          activeNavLabel === label &&
                            styles["nav-item--selected"]
                        )}
                        key={`navigation-tab-${key}`}
                        component={forwardRef(ClickableNavItem)}
                      />
                    );
                  }

                  return (
                    <Tab
                      aria-controls={`navigation-tabpanel-${key}`}
                      className={classnames(
                        styles["nav-item"],
                        activeNavLabel === label && styles["nav-item--selected"]
                      )}
                      icon={<KeyboardArrowDown />}
                      id={`navigation-tab-${key}`}
                      key={`navigation-tab-${key}`}
                      label={label}
                    />
                  );
                })}
              </Tabs>
            </nav>
            <div className={styles["navigation-bar-buttons"]}>
              {!isBasketEmpty && (
                <Button
                  action={basketAction}
                  accessibilityLabel={basketLabel}
                  className={classnames(styles["basket-button"])}
                  variant={!sizes.length ? "text" : "contained"}
                  isIconButton
                >
                  <Icon source={ShoppingCartOutlined} />
                </Button>
              )}
              {!isSearchDisabled && (
                <Button
                  accessibilityLabel={searchLabel}
                  className={classnames(styles["search-button"], {
                    [styles["search-button--is-on-search-page"]!]:
                      isOnSearchPage
                  })}
                  variant={!sizes.length ? "text" : "contained"}
                  isIconButton
                  onClick={toggleSearch}
                >
                  <Icon source={SearchIcon} />
                </Button>
              )}
              <Button
                accessibilityLabel={openLabel}
                className={styles["burger-button"]}
                variant="text"
                isIconButton
                onClick={toggleMenu}
              >
                <Icon source={Menu} />
              </Button>
            </div>
          </div>
        </Container>
      </div>
      <Backdrop
        className={styles["backdrop"]}
        open={value !== false || showSearch || showLanguageSelection}
        onClick={hideAll}
      />
      <Slide direction={!sizes.length ? "left" : "down"} in={value !== false}>
        <div className={classnames(styles["drawer"], styles["nav-drawer"])}>
          <Button
            accessibilityLabel={closeLabel}
            className={styles["close-button"]}
            isIconButton
            onClick={toggleMenu}
          >
            <Icon source={Close} />
          </Button>
          <Navigation
            menu={navigation}
            initialDepth={typeof value === "number" ? 1 : 0}
            initialValue={value}
            buttonComponent={navigationButtonComponent}
            promoButtonComponent={promoButtonComponent}
            toggleLanguageSelection={toggleLanguageSelection}
            utilities={utilities}
            setRootValue={setValue}
            mainMenuTitleLabel={mainMenuTitleLabel}
            mainMenuDefaultLabel={mainMenuDefaultLabel}
            language={language}
            sizes={sizes}
          />
        </div>
      </Slide>
      {!isSearchDisabled && (
        <Slide direction={!sizes.length ? "left" : "down"} in={showSearch}>
          <div
            className={classnames(styles["search-drawer-container"], {
              [styles["search-drawer-container--hidden"]!]:
                !showSearch && !sizes.length
            })}
          >
            <div
              className={classnames(styles["drawer"], styles["search-drawer"])}
            >
              <Button
                accessibilityLabel={closeLabel}
                className={styles["close-button"]}
                isIconButton
                onClick={toggleSearch}
              >
                <Icon source={Close} />
              </Button>
              <Typography variant="h4">{searchTitle}</Typography>
              {showSearch && (
                <Search
                  action={searchAction}
                  buttonComponent={searchButtonComponent}
                  label={searchLabel}
                  placeholder={searchPlaceholder}
                  defaultValue={(isOnSearchPage && query) || ""}
                />
              )}
            </div>
          </div>
        </Slide>
      )}
    </Paper>
  );
};

export default Header;
