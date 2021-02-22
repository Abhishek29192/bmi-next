import Button, { ButtonProps, ClickableAction } from "@bmi/button";
import Icon from "@bmi/icon";
import Typography from "@bmi/typography";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import classnames from "classnames";
import React from "react";
import styles from "./Navigation.module.scss";

export type LinkList = {
  label: string;
  hasSeparator?: boolean;
  action?: ClickableAction;
  icon?: SVGImport;
  image?: string;
  isHeading?: boolean;
  isLabelHidden?: boolean;
  isParagraph?: boolean;
};

export type NavigationList = LinkList & {
  footer?: readonly LinkList[];
  menu?: readonly NavigationList[];
};

type NavigationProps = {
  menu: readonly NavigationList[];
  initialDepth?: number;
  initialValue?: number | boolean;
  setRootValue?: (value: any) => void;
  toggleLanguageSelection?: () => void;
  utilities: readonly LinkList[];
  mainMenuTitleLabel?: string;
  mainMenuDefaultLabel?: string;
  languageLabel?: string;
};

const Navigation = ({
  menu,
  initialDepth = 0,
  initialValue,
  setRootValue,
  toggleLanguageSelection,
  utilities,
  languageLabel,
  mainMenuTitleLabel,
  mainMenuDefaultLabel
}: NavigationProps) => {
  const [depth, setDepth] = React.useState<number>(0);

  React.useEffect(() => setDepth(initialDepth), [initialDepth]);

  return (
    <nav className={styles["Navigation"]}>
      <NavigationList
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
        languageLabel={languageLabel}
      />
    </nav>
  );
};

type NavigationListProps = {
  backLabel?: string;
  className?: string;
  depth: number;
  initialValue?: number | boolean;
  isFooter?: boolean;
  isRoot?: boolean;
  menu: readonly NavigationList[];
  parentHandleClick?: (newValue: number | boolean) => void;
  setDepth: (depth: number) => void;
  setRootValue?: (value: any) => void;
  show?: boolean;
  toggleLanguageSelection?: () => void;
  utilities?: readonly LinkList[];
  mainMenuTitleLabel?: string;
  mainMenuDefaultLabel?: string;
  languageLabel?: string;
};

const NavigationList = ({
  backLabel = "Back",
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
  languageLabel
}: NavigationListProps) => {
  const [value, setValue] = React.useState<number | boolean>(initialValue);

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
      className={classnames(styles["NavigationList"], {
        [className]: isRoot,
        [styles["NavigationList--footer"]]: isFooter,
        [styles["NavigationList--show"]]: show
      })}
    >
      <ul>
        {parentHandleClick ? (
          <li className={styles["BackNavigation"]} key={`menu-${depth}-back`}>
            <NavigationListButton
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
            subMenu ? (
              <li key={`menu-${depth}-item-${key}`}>
                <NavigationListButton
                  active={value === key}
                  accessibilityLabel={label}
                  startIcon={icon && <Icon source={icon} />}
                  endIcon={<ChevronRight className={styles["chevronRight"]} />}
                  onClick={() => handleClick(key)}
                >
                  {isLabelHidden ? null : label}
                </NavigationListButton>
                <NavigationList
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
                    return (
                      <img
                        alt={label}
                        className={styles["Image"]}
                        src={image}
                      />
                    );
                  } else {
                    return (
                      <NavigationListButton
                        action={action}
                        accessibilityLabel={label}
                        startIcon={
                          icon && isLabelHidden && <Icon source={icon} />
                        }
                        endIcon={
                          icon &&
                          !isLabelHidden && (
                            <span className={styles["icon-wrapper"]}>
                              <Icon source={icon} />
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
                depth={depth + 1}
                isFooter={true}
                key={`menu-${depth}-navigation-list-${key}`}
                menu={footer}
                show={value === key}
                setDepth={() => {}}
              />
            )
          ]
        )}
        {utilities && (
          <ul className={styles["Utilities"]}>
            {utilities.map(({ label, action }, key) => (
              <li key={`mobile-utilities-link-${key}`}>
                <NavigationListButton action={action}>
                  {label}
                </NavigationListButton>
              </li>
            ))}
          </ul>
        )}
        {isRoot && !!languageLabel && (
          <li>
            <NavigationListButton
              endIcon={<ChevronRight className={styles["chevronRight"]} />}
              onClick={toggleLanguageSelection}
            >
              {languageLabel}
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
};

export const NavigationListButton = ({
  active = false,
  children,
  className,
  ...rest
}: NavigationListButtonProps) => (
  <Button
    className={classnames(styles["NavigationListButton"], className, {
      [styles["NavigationListButton--active"]]: active
    })}
    variant="text"
    {...rest}
  >
    {children}
  </Button>
);

export default Navigation;
