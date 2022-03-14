import {
  Backdrop,
  Paper,
  Slide,
  Tab as DefaultTab,
  Tabs,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import {
  ChevronLeft,
  Close,
  KeyboardArrowDown,
  Menu,
  Search as SearchIcon,
  ShoppingCartOutlined
} from "@material-ui/icons";
import classnames from "classnames";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { GTM } from "../";
import Button from "../button/Button";
import Clickable, {
  ClickableAction,
  Props as ClickableProps
} from "../clickable/Clickable";
import Container from "../container/Container";
import Icon from "../icon";
import LanguageSelection, {
  LanguageSelectionItem,
  LanguageSelectionList
} from "../language-selection/LanguageSelection";
import { BMI as BmiIcon } from "../logo";
import Navigation, {
  LinkList,
  NavigationList,
  NavigationListButton
} from "../navigation/Navigation";
import Search from "../search/Search";
import Typography from "../typography/Typography";
import { useStyles } from "./styles";
import { getElementWidths, getSize, HeaderSizes } from "./widthCalculations";

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
  navUtilityLinkButton?: React.ComponentType<any>; //TODO
  closeButtonComponent?: React.ComponentType<any>; //TODO
  onCountrySelection?: (label: string, code: string) => void;
  useGTM?: (gtm: GTM) => any;
  isSearchDisabled?: boolean;
  isOnSearchPage?: boolean;
  isBasketEmpty?: boolean;
  searchAction?: string;
  searchLabel?: string;
  searchPlaceholder?: string;
  basketLabel?: string;
  searchTitle?: string;
  openLabel?: string;
  mainMenuTitleLabel?: string;
  mainMenuDefaultLabel?: string;
  languageLabel?: string;
  languageIntroduction?: React.ReactNode;
  SampleBasketDialog?: React.ElementType;
  isSpaEnabled?: boolean;
  isGatsbyDisabledElasticSearch?: boolean;
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
  basketLabel = "Basket",
  searchTitle = "How can we help you today?",
  openLabel = "Open menu",
  mainMenuTitleLabel,
  mainMenuDefaultLabel,
  languageLabel,
  languageIntroduction,
  navUtilityLinkButton: NavUtilityLinkButton = Button,
  closeButtonComponent: CloseButtonComponent = Button,
  SampleBasketDialog,
  onCountrySelection,
  useGTM,
  isGatsbyDisabledElasticSearch,
  isSpaEnabled
}: HeaderProps) => {
  const classes = useStyles();
  const body =
    typeof document !== "undefined"
      ? document.querySelector("body")
      : undefined;
  const [sizes, setSizes] = useState<HeaderSizes>(["small", "medium", "large"]);
  const [showLanguageSelection, setShowLanguageSelection] =
    React.useState<boolean>(false);
  const [showSearch, setShowSearch] = React.useState<boolean>(false);
  const [showCart, setShowCart] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<number | boolean>(false);
  const elementWidths = getElementWidths(navigation);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const gtm = useMemo(() => {
    const languageSectionState = !showLanguageSelection ? "open" : "close";
    return {
      id: "nav-country-selector",
      label: `${languageSectionState} panel`,
      action: `${languageSectionState} panel`
    };
  }, [showLanguageSelection]);

  const { dataGTM, pushGTMEvent } = useGTM?.(gtm);

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
      amendClassList(classes.menuIsOpen, "remove");
      setValue(false);
    } else {
      amendClassList(classes.menuIsOpen, "add");
      setShowSearch(false);
      setShowCart(false);
      setValue(newValue);
    }
  };

  const toggleMenu = () => {
    if (typeof value === "number" || value === true) {
      amendClassList(classes.menuIsOpen, "remove");
      setValue(false);
    } else {
      amendClassList(classes.menuIsOpen, "add");
      setShowSearch(false);
      setShowCart(false);
      setValue(!value);
    }
  };

  const toggleLanguageSelection = () => {
    setShowLanguageSelection(!showLanguageSelection);
    pushGTMEvent();
  };

  const toggleCart = () => {
    if (!showCart) {
      setValue(false);
      amendClassList(classes.menuIsOpen!, "remove");
    }
    if (showSearch) {
      setShowSearch(false);
    }
    setShowCart(!showCart);
  };

  const toggleSearch = () => {
    if (!showSearch) {
      setValue(false);
      amendClassList(classes.menuIsOpen, "remove");
    }
    setShowCart(false);
    setShowSearch(!showSearch);
  };

  const hideAll = () => {
    setValue(false);
    setShowLanguageSelection(false);
    setShowSearch(false);
    setShowCart(false);
    amendClassList(classes.menuIsOpen!, "remove");
  };

  const handleResize = ({ currentTarget }: Pick<UIEvent, "currentTarget">) => {
    if (!currentTarget || !("innerWidth" in currentTarget)) {
      return;
    }
    const target = currentTarget as Window;
    setSizes(getSize(target.innerWidth, elementWidths));
  };

  useEffect(() => {
    amendClassList(classes.menuIsOpen, "remove");
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

  // Uses for bilingual sites
  const languageCodeSeparator = "/";
  const languageCode =
    language.code.includes(languageCodeSeparator) &&
    language.code.split(languageCodeSeparator).pop();
  return (
    <Paper
      className={classnames(
        classes.root,
        ...sizes.map((size) => classes[`header${size}`])
      )}
      component="header"
      elevation={3}
      square
    >
      <nav
        aria-label="Utilities"
        className={classes.utilitiesBar}
        role="navigation"
      >
        <Container>
          <ul>
            {!isSpaEnabled &&
              utilities.map(({ label, action }, key) => (
                <li key={`utilities-link-${key}`} className={classes.navItem}>
                  <NavUtilityLinkButton
                    className={classes.utilitiesButton}
                    action={action}
                    variant="text"
                    target="_blank"
                  >
                    {label}
                  </NavUtilityLinkButton>
                </li>
              ))}
            {language && languages && (
              <li className={classes.navItem}>
                <Button
                  className={classnames(
                    classes.utilitiesButton,
                    classes.languageSelectionButton,
                    showLanguageSelection &&
                      classes.languageSelectionButtonActive
                  )}
                  data-gtm={JSON.stringify(dataGTM)}
                  onClick={toggleLanguageSelection}
                  variant="text"
                  aria-label={languageLabel}
                  data-testid="language-button"
                >
                  {language.icon &&
                    (typeof language.icon === "string" ? (
                      <img
                        width="20px"
                        height="16px"
                        className={classes.languageIcon}
                        src={language.icon}
                        alt={language.label}
                      />
                    ) : (
                      <Icon
                        width="20px"
                        height="16px"
                        source={language.icon}
                        className={classes.languageIcon}
                      />
                    ))}
                  {(languageCode || language.code).toUpperCase()}
                  <span
                    className={classnames(
                      classes.downArrow,
                      showLanguageSelection && classes.downArrowUp
                    )}
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
          <div className={classnames(classes.drawer, classes.languageDrawer)}>
            <CloseButtonComponent
              accessibilityLabel={closeLabel}
              className={classes.closeButton}
              isIconButton
              onClick={hideAll}
              data-testid="language-close-button"
            >
              <Icon source={Close} />
            </CloseButtonComponent>
            <div className={classes.backNavigation}>
              <NavigationListButton
                component={Button}
                className={classes.backButton}
                startIcon={<ChevronLeft className={classes.chevronLeft} />}
                endIcon={false}
                onClick={toggleLanguageSelection}
              >
                {mainMenuDefaultLabel}
              </NavigationListButton>
              <hr className={classes.separator} />
            </div>
            <Container wrapperClassName={classes.languageContainer}>
              <LanguageSelection
                introduction={languageIntroduction}
                languages={languages}
                forceMobile={!sizes.length}
                onCountrySelection={onCountrySelection}
              />
            </Container>
          </div>
        </Slide>
      )}
      <div className={classes.navigationBar}>
        <Container>
          <div className={classes.navigationBarContent}>
            <Clickable
              {...logoAction}
              className={classes.logoLink}
              aria-label={logoLabel}
            >
              <Icon
                className={isSpaEnabled ? classes.staticLogo : classes.logo}
                source={BmiIcon}
              />
            </Clickable>
            <nav
              aria-label="Navigation"
              className={classes.navigation}
              role="navigation"
            >
              <Tabs
                onChange={handleChange}
                scrollButtons="off"
                value={value === true ? 0 : value}
                variant="scrollable"
              >
                {(isSpaEnabled ? [] : navigation).map(
                  ({ label, action, menu }, key) => {
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
                                child && React.isValidElement(child)
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
                            classes.navItem,
                            classes.navItemNoChildren,
                            activeNavLabel === label && classes.navItemSelected
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
                          classes.navItem,
                          classes.navItemNoChildren,
                          activeNavLabel === label && classes.navItemSelected
                        )}
                        icon={<KeyboardArrowDown />}
                        id={`navigation-tab-${key}`}
                        key={`navigation-tab-${key}`}
                        label={label}
                      />
                    );
                  }
                )}
              </Tabs>
            </nav>
            <div className={classes.navigationBarButtons}>
              {!isBasketEmpty && !isSpaEnabled && (
                <Button
                  accessibilityLabel={basketLabel}
                  className={classes.basketButton}
                  component="a"
                  variant={!sizes.length ? "text" : "contained"}
                  isIconButton
                  onClick={toggleCart}
                >
                  <Icon source={ShoppingCartOutlined} />
                </Button>
              )}
              {!isSearchDisabled && !isGatsbyDisabledElasticSearch && (
                <Button
                  accessibilityLabel={searchLabel}
                  className={classnames(
                    classes.searchButton,
                    isOnSearchPage && classes.searchButtonIsOnSearchPage
                  )}
                  variant={!sizes.length ? "text" : "contained"}
                  isIconButton
                  onClick={toggleSearch}
                  data-testid="search-button"
                >
                  <Icon source={SearchIcon} />
                </Button>
              )}
              <Button
                accessibilityLabel={openLabel}
                className={classes.burgerButton}
                variant="text"
                isIconButton
                onClick={toggleMenu}
                data-testid="open-button"
              >
                <Icon source={Menu} />
              </Button>
            </div>
          </div>
        </Container>
      </div>
      <Backdrop
        className={classes.backdrop}
        open={
          value !== false || showSearch || showLanguageSelection || showCart
        }
        onClick={hideAll}
        data-testid="backdrop"
      />
      <Slide direction={!sizes.length ? "left" : "down"} in={value !== false}>
        <div className={classnames(classes.drawer, classes.navDrawer)}>
          <Button
            accessibilityLabel={closeLabel}
            className={classes.closeButton}
            isIconButton
            onClick={toggleMenu}
            data-testid="nav-close-button"
          >
            <Icon source={Close} />
          </Button>
          <Navigation
            menu={!isSpaEnabled ? navigation : []}
            initialDepth={typeof value === "number" ? 1 : 0}
            initialValue={value}
            buttonComponent={
              !isSpaEnabled ? navigationButtonComponent : undefined
            }
            promoButtonComponent={
              !isSpaEnabled ? promoButtonComponent : undefined
            }
            toggleLanguageSelection={toggleLanguageSelection}
            utilities={!isSpaEnabled ? utilities : []}
            setRootValue={setValue}
            mainMenuTitleLabel={mainMenuTitleLabel}
            mainMenuDefaultLabel={mainMenuDefaultLabel}
            language={language}
          />
        </div>
      </Slide>
      {!isSearchDisabled && (
        <Slide direction={!sizes.length ? "left" : "down"} in={showSearch}>
          <div
            className={classnames(
              classes.searchDrawerContainer,
              !showSearch &&
                !sizes.length &&
                classes.searchDrawerContainerHidden
            )}
          >
            <div className={classnames(classes.drawer, classes.searchDrawer)}>
              <Button
                accessibilityLabel={closeLabel}
                className={classes.closeButton}
                isIconButton
                onClick={toggleSearch}
                data-testid="search-close-button"
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
      {!isBasketEmpty && SampleBasketDialog && (
        <Slide direction={isMobile ? "left" : "down"} in={showCart}>
          <div
            className={classnames(
              classes.cartDrawerContainer,
              !showCart && !sizes.length && classes.cartDrawerContainerHidden
            )}
          >
            <SampleBasketDialog toggleCart={toggleCart} />
          </div>
        </Slide>
      )}
    </Paper>
  );
};
export default Header;
