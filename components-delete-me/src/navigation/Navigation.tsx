import { SVGImport } from "@bmi-digital/svg-import";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import classnames from "classnames";
import React from "react";
import DefaultButton, { ButtonProps } from "../button/Button";
import { ClickableAction } from "../clickable/Clickable";
import Icon from "../icon";
import Typography from "../typography/Typography";
import type { LanguageSelectionItem } from "../language-selection/LanguageSelection";
import styles from "./Navigation.module.scss";

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
  initialDepth?: number;
  initialValue?: number | boolean;
  setRootValue?: (value: number | boolean) => void;
  toggleLanguageSelection?: () => void;
  utilities: readonly LinkList[];
  mainMenuTitleLabel?: string;
  mainMenuDefaultLabel?: string;
  language?: LanguageSelectionItem;
  sizes?: string[];
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
  mainMenuDefaultLabel,
  sizes
}: NavigationProps) => {
  const [depth, setDepth] = React.useState<number>(0);

  React.useEffect(() => setDepth(initialDepth), [initialDepth]);

  return (
    <nav
      className={classnames(
        styles["Navigation"],
        ...(sizes
          ?.map((size) => styles[`Navigation--${size}`])
          .filter(Boolean) || [])
      )}
    >
      <NavigationList
        buttonComponent={buttonComponent}
        promoButtonComponent={promoButtonComponent}
        className={styles[`Offset${depth * 100}`]}
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
  depth: number;
  initialValue?: number | boolean;
  isFooter?: boolean;
  isRoot?: boolean;
  menu: readonly NavigationList[];
  parentHandleClick?: (newValue: number | boolean) => void;
  setDepth: (depth: number) => void;
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
  const [value, setValue] = React.useState<number | boolean>(initialValue);

  const Button = buttonComponent || DefaultButton;

  React.useEffect(() => setValue(initialValue), [initialValue]);

  const handleClick = (newValue: number | boolean) => {
    if (newValue === false || value === newValue) {
      setDepth(depth);
      setValue(false);
    } else {
      if (setRootValue) {
        setRootValue(newValue);
      }
      setDepth(depth + 1);
      setValue(newValue);
    }
  };

  return (
    <div
      className={classnames(
        styles["NavigationList"],
        isRoot && className,
        isFooter && styles["NavigationList--footer"],
        show && styles["NavigationList--show"]
      )}
    >
      <ul>
        {parentHandleClick ? (
          <li className={styles["BackNavigation"]} key={`menu-${depth}-back`}>
            <NavigationListButton
              component={Button}
              className={styles["BackButton"]}
              startIcon={<ChevronLeft className={styles["chevronLeft"]} />}
              endIcon={false}
              onClick={() => parentHandleClick(false)}
            >
              {backLabel}
            </NavigationListButton>
            <hr className={styles["Separator"]} />
          </li>
        ) : (
          !isFooter && (
            <li key={`menu-${depth}-heading`}>
              <Typography className={styles["MainMenuTitle"]} variant="h6">
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
            (subMenu.length > 1 || subMenu[0]?.menu || depth !== 0) ? (
              <li key={`menu-${depth}-item-${key}`}>
                <NavigationListButton
                  component={Button}
                  active={value === key}
                  accessibilityLabel={label}
                  startIcon={
                    icon && <Icon className={styles["icon"]} source={icon} />
                  }
                  endIcon={<ChevronRight className={styles["chevronRight"]} />}
                  onClick={() => handleClick(key)}
                >
                  {isLabelHidden ? null : label}
                </NavigationListButton>
                <NavigationList
                  buttonComponent={Button}
                  backLabel={
                    menu[0].isHeading ? menu[0].label : mainMenuDefaultLabel
                  }
                  depth={depth + 1}
                  menu={subMenu}
                  show={value === key}
                  parentHandleClick={handleClick}
                  setDepth={setDepth}
                />
                {hasSeparator && <hr className={styles["Separator"]} />}
              </li>
            ) : (
              <li key={`menu-${depth}-item-${key}`}>
                {(() => {
                  if (isHeading) {
                    return (
                      <Typography
                        className={styles["NavigationListType"]}
                        variant="h6"
                      >
                        {label}
                      </Typography>
                    );
                  } else if (isParagraph) {
                    return (
                      <Typography
                        className={styles["NavigationListType"]}
                        variant="body1"
                      >
                        {label}
                      </Typography>
                    );
                  } else if (image) {
                    return React.isValidElement(image) ? (
                      image
                    ) : (
                      <img
                        alt={label}
                        className={styles["Image"]}
                        src={image}
                      />
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
                          icon &&
                          isLabelHidden && (
                            <Icon className={styles["icon"]} source={icon} />
                          )
                        }
                        endIcon={
                          icon &&
                          !isLabelHidden && (
                            <span className={styles["icon-wrapper"]}>
                              <Icon className={styles["icon"]} source={icon} />
                            </span>
                          )
                        }
                      >
                        {isLabelHidden ? null : label}
                      </NavigationListButton>
                    );
                  }
                })()}
                {hasSeparator && <hr className={styles["Separator"]} />}
              </li>
            ),
            footer && (
              <NavigationList
                buttonComponent={
                  promoButtonComponent ? promoButtonComponent : Button
                }
                depth={depth + 1}
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
          <ul className={styles["Utilities"]}>
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
              endIcon={<ChevronRight className={styles["chevronRight"]} />}
              onClick={toggleLanguageSelection}
              accessibilityLabel={language.code.toUpperCase()}
            >
              <span className={styles["LanguageButtonContent"]}>
                {language.icon &&
                  (typeof language.icon === "string" ? (
                    <img
                      width="20px"
                      height="16px"
                      className={styles["LanguageIcon"]}
                      src={language.icon}
                      alt={language.label}
                    />
                  ) : (
                    <Icon
                      width="20px"
                      height="16px"
                      source={language.icon}
                      className={styles["LanguageIcon"]}
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

type NavigationListButtonProps = ButtonProps & {
  active?: boolean;
  action?: ClickableAction;
  component?: React.ComponentType<any>; // TODO
};

export const NavigationListButton = ({
  active = false,
  component: Component = DefaultButton,
  children,
  className,
  ...rest
}: NavigationListButtonProps) => (
  <Component
    className={classnames(
      styles["NavigationListButton"],
      className,
      active && styles["NavigationListButton--active"]
    )}
    variant="text"
    classes={{
      outlinedPrimary: classnames(
        !rest.isIconButton && styles["NavigationListButton--outline"]
      )
    }}
    {...rest}
  >
    {children}
  </Component>
);

export default Navigation;
