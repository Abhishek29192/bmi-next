import { SVGImport } from "@bmi-digital/svg-import";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import classnames from "classnames";
import React, { useEffect, useState } from "react";
import DefaultButton, { ButtonProps } from "../button/Button";
import { ClickableAction } from "../clickable/Clickable";
import Icon from "../icon";
import type { LanguageSelectionItem } from "../language-selection/LanguageSelection";
import Typography from "../typography/Typography";
import { useStyles } from "./styles";

type Depth = 0 | 1 | 2 | 3 | 4;

export type LinkList = {
  label: string;
  hasSeparator?: boolean;
  action?: ClickableAction;
  icon?: SVGImport;
  image?: string | React.ReactElement;
  isHeading?: boolean;
  isLabelHidden?: boolean;
  isParagraph?: boolean;
};

export type NavigationList = LinkList & {
  footer?: readonly LinkList[];
  menu?: readonly NavigationList[];
};

type NavigationProps = {
  buttonComponent?: React.ComponentType<any>; // TODO
  promoButtonComponent?: React.ComponentType<any>; // TODO
  menu: readonly NavigationList[];
  initialDepth?: Depth;
  initialValue?: number | boolean;
  setRootValue?: (value: number | boolean) => void;
  toggleLanguageSelection?: () => void;
  utilities: readonly LinkList[];
  mainMenuTitleLabel?: string;
  mainMenuDefaultLabel?: string;
  language?: LanguageSelectionItem;
};

const Navigation = ({
  buttonComponent,
  promoButtonComponent,
  menu,
  initialDepth = 0,
  initialValue,
  setRootValue,
  toggleLanguageSelection,
  utilities,
  language,
  mainMenuTitleLabel,
  mainMenuDefaultLabel
}: NavigationProps) => {
  const classes = useStyles();
  const [depth, setDepth] = useState<Depth>(0);

  useEffect(() => setDepth(initialDepth), [initialDepth]);

  return (
    <nav className={classnames(classes.root)}>
      <NavigationList
        buttonComponent={buttonComponent}
        promoButtonComponent={promoButtonComponent}
        className={classes[`offset${depth}`]}
        depth={0}
        initialValue={initialValue}
        isRoot={true}
        menu={menu}
        setDepth={setDepth}
        setRootValue={setRootValue}
        show={initialValue !== false}
        toggleLanguageSelection={toggleLanguageSelection}
        utilities={utilities}
        mainMenuTitleLabel={mainMenuTitleLabel}
        mainMenuDefaultLabel={mainMenuDefaultLabel}
        language={language}
      />
    </nav>
  );
};

type NavigationListProps = {
  backLabel?: string;
  buttonComponent?: React.ComponentType<any>; // TODO
  promoButtonComponent?: React.ComponentType<any>; // TODO
  className?: string;
  depth: Depth;
  initialValue?: number | boolean;
  isFooter?: boolean;
  isRoot?: boolean;
  menu: readonly NavigationList[];
  parentHandleClick?: (newValue: number | boolean) => void;
  setDepth: (depth: Depth) => void;
  setRootValue?: (value: number | boolean) => void;
  show?: boolean;
  toggleLanguageSelection?: () => void;
  utilities?: readonly LinkList[];
  mainMenuTitleLabel?: string;
  mainMenuDefaultLabel?: string;
  language?: LanguageSelectionItem;
};

const NavigationList = ({
  backLabel = "Back",
  buttonComponent,
  promoButtonComponent,
  className,
  depth,
  initialValue = false,
  isFooter = false,
  isRoot = false,
  menu,
  parentHandleClick,
  setDepth,
  setRootValue,
  show,
  toggleLanguageSelection,
  utilities,
  mainMenuTitleLabel = "BMI Group",
  mainMenuDefaultLabel = "Main menu",
  language
}: NavigationListProps) => {
  const classes = useStyles();
  const [value, setValue] = useState<number | boolean>(initialValue);

  const Button = buttonComponent || DefaultButton;

  useEffect(() => setValue(initialValue), [initialValue]);

  const handleClick = (newValue: number | boolean) => {
    if (newValue === false || value === newValue) {
      setDepth(depth);
      setValue(false);
    } else {
      if (setRootValue) {
        setRootValue(newValue);
      }
      if (depth < 4) {
        setDepth((depth + 1) as Depth);
      }
      setValue(newValue);
    }
  };

  return (
    <div
      className={classnames(
        classes.navigationList,
        isRoot && className,
        isFooter && classes.footer,
        show && classes.show
      )}
    >
      <ul>
        {parentHandleClick ? (
          <li className={classes.backNavigation} key={`menu-${depth}-back`}>
            <NavigationListButton
              component={Button}
              className={classes.backButton}
              startIcon={<ChevronLeft className={classes.chevronLeft} />}
              endIcon={false}
              onClick={() => parentHandleClick(false)}
            >
              {backLabel}
            </NavigationListButton>
            <hr className={classes.separator} />
          </li>
        ) : (
          !isFooter && (
            <li key={`menu-${depth}-heading`}>
              <Typography className={classes.mainMenuTitle} variant="h6">
                {mainMenuTitleLabel}
              </Typography>
            </li>
          )
        )}
        {menu.map(
          (
            {
              footer,
              hasSeparator,
              action,
              icon,
              image = null,
              isHeading,
              isLabelHidden,
              isParagraph,
              label,
              menu: subMenu
            },
            key
          ) => [
            subMenu &&
            (subMenu.length > 1 ||
              subMenu[0]?.menu ||
              (depth !== 0 && depth < 4)) ? (
              <li key={`menu-${depth}-item-${key}`}>
                <NavigationListButton
                  component={Button}
                  active={value === key}
                  accessibilityLabel={label}
                  startIcon={icon && <Icon source={icon} />}
                  endIcon={<ChevronRight className={classes.chevronRight} />}
                  onClick={() => handleClick(key)}
                >
                  {isLabelHidden ? null : label}
                </NavigationListButton>
                <NavigationList
                  buttonComponent={Button}
                  backLabel={
                    menu[0].isHeading ? menu[0].label : mainMenuDefaultLabel
                  }
                  depth={(depth + 1) as Depth}
                  menu={subMenu}
                  show={value === key}
                  parentHandleClick={handleClick}
                  setDepth={setDepth}
                  mainMenuDefaultLabel={mainMenuDefaultLabel}
                />
                {hasSeparator && <hr className={classes.separator} />}
              </li>
            ) : (
              <li key={`menu-${depth}-item-${key}`}>
                {(() => {
                  if (isHeading) {
                    return (
                      <Typography
                        className={classes.navigationListType}
                        variant="h6"
                      >
                        {label}
                      </Typography>
                    );
                  } else if (isParagraph) {
                    return (
                      <Typography
                        className={classes.navigationListType}
                        variant="body1"
                      >
                        {label}
                      </Typography>
                    );
                  } else if (image) {
                    return React.isValidElement(image) ? (
                      image
                    ) : (
                      <img alt={label} className={classes.image} src={image} />
                    );
                  } else {
                    let clickableAction = action;

                    if (subMenu && subMenu.length === 1 && subMenu[0].action) {
                      clickableAction = subMenu[0].action;
                    }

                    return (
                      <NavigationListButton
                        component={Button}
                        action={clickableAction}
                        accessibilityLabel={label}
                        startIcon={
                          icon && isLabelHidden && <Icon source={icon} />
                        }
                        endIcon={
                          icon &&
                          !isLabelHidden && (
                            <span className={classes.iconWrapper}>
                              <Icon source={icon} />
                            </span>
                          )
                        }
                        target="_blank"
                      >
                        {isLabelHidden ? null : label}
                      </NavigationListButton>
                    );
                  }
                })()}
                {hasSeparator && <hr className={classes.separator} />}
              </li>
            ),
            footer && (
              <NavigationList
                buttonComponent={
                  promoButtonComponent ? promoButtonComponent : Button
                }
                depth={(depth + 1) as Depth}
                isFooter={true}
                key={`menu-${depth}-navigation-list-${key}`}
                menu={footer}
                show={value === key}
                setDepth={() => {
                  // no-op
                }}
              />
            )
          ]
        )}
        {utilities && (
          <ul className={classes.utilities}>
            {utilities.map(({ label, action }, key) => (
              <li key={`mobile-utilities-link-${key}`}>
                <NavigationListButton component={Button} action={action}>
                  {label}
                </NavigationListButton>
              </li>
            ))}
          </ul>
        )}
        {isRoot && !!language && (
          <li>
            <NavigationListButton
              component={Button}
              endIcon={<ChevronRight className={classes.chevronRight} />}
              onClick={toggleLanguageSelection}
              accessibilityLabel={language.code.toUpperCase()}
            >
              <span className={classes.languageButtonContent}>
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
                {language.code.toUpperCase()}
              </span>
            </NavigationListButton>
          </li>
        )}
      </ul>
    </div>
  );
};

type TargetOptions = "_blank" | "_self" | "_parent" | "_top";

type NavigationListButtonProps = ButtonProps & {
  active?: boolean;
  action?: ClickableAction;
  component?: React.ComponentType<any>; // TODO
  target?: TargetOptions;
};

export const NavigationListButton = ({
  active = false,
  component: Component = DefaultButton,
  children,
  className,
  target,
  ...rest
}: NavigationListButtonProps) => {
  const classes = useStyles();
  return (
    <Component
      className={classnames(
        classes.navigationListButton,
        className,
        active && classes.active
      )}
      variant="text"
      classes={{
        outlinedPrimary: classnames(!rest.isIconButton && classes.outline)
      }}
      target={target}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Navigation;
