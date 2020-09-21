import Button, { ButtonProps, ClickableAction } from "@bmi/button";
import Icon from "@bmi/icon";
import Arrow from "@bmi/icon/src/svgs/Arrow.svg";
import Typography from "@bmi/typography";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import classnames from "classnames";
import React from "react";
import styles from "./Navigation.module.scss";

export type LinkList = {
  label: string;
  hasSeparator?: boolean;
  action?: ClickableAction;
  image?: string;
  isHeading?: boolean;
  isBigLink?: boolean;
  isParagraph?: boolean;
};

export type NavitationList = LinkList & {
  footer?: readonly LinkList[];
  menu?: readonly NavitationList[];
};

type NavigationProps = {
  menu: readonly NavitationList[];
  initialDepth?: number;
  initialValue?: number | boolean;
  toggleLanguageSelection?: (boolean) => void;
  utilities: readonly LinkList[];
};

const Navigation = ({
  menu,
  initialDepth = 0,
  initialValue,
  toggleLanguageSelection,
  utilities
}: NavigationProps) => {
  const [depth, setDepth] = React.useState<number>(0);

  React.useEffect(() => setDepth(initialDepth), [initialDepth]);

  return (
    <nav className={styles.Navigation}>
      <NavigationList
        className={styles[`Offset${depth * 100}`]}
        depth={0}
        initialValue={initialValue}
        isRoot={true}
        menu={menu}
        setDepth={setDepth}
        show={initialValue !== false}
        toggleLanguageSelection={toggleLanguageSelection}
        utilities={utilities}
      />
    </nav>
  );
};

type NavigationListProps = {
  backLabel?: string;
  className?: string;
  depth: number;
  menu: readonly NavitationList[];
  show?: boolean;
  initialValue?: number | boolean;
  isFooter?: boolean;
  isRoot?: boolean;
  parentHandleClick?: (number) => void;
  setDepth: (number) => void;
  toggleLanguageSelection?: (boolean) => void;
  utilities?: readonly LinkList[];
};

const NavigationList = ({
  backLabel = "Back",
  className,
  depth,
  menu,
  show,
  initialValue = false,
  isFooter = false,
  isRoot = false,
  parentHandleClick,
  setDepth,
  toggleLanguageSelection,
  utilities
}: NavigationListProps) => {
  const [value, setValue] = React.useState<number | boolean>(initialValue);

  React.useEffect(() => setValue(initialValue), [initialValue]);

  const handleClick = (newValue: number | boolean) => {
    if (newValue === false || value === newValue) {
      setDepth(depth);
      setValue(false);
    } else {
      setDepth(depth + 1);
      setValue(newValue);
    }
  };

  return (
    <div
      className={classnames(styles.NavigationList, {
        [className]: isRoot,
        [styles["NavigationList--footer"]]: isFooter,
        [styles["NavigationList--show"]]: show
      })}
    >
      <ul>
        {parentHandleClick ? (
          <li className={styles.BackNavigation} key={`menu-${depth}-back`}>
            <NavigationListButton
              className={styles.BackButton}
              endIcon={false}
              onClick={() => parentHandleClick(false)}
              startIcon={<ChevronLeft />}
            >
              {backLabel}
            </NavigationListButton>
            <hr className={styles.Separator} />
          </li>
        ) : (
          !isFooter && (
            <li key={`menu-${depth}-heading`}>
              <Typography className={styles.MainMenuTitle} variant="h6">
                BMI Group
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
              image = null,
              isHeading,
              isBigLink,
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
                  endIcon={<ChevronRight />}
                  onClick={() => handleClick(key)}
                >
                  {label}
                </NavigationListButton>
                <NavigationList
                  backLabel={menu[0].isHeading ? menu[0].label : "Main menu"}
                  depth={depth + 1}
                  menu={subMenu}
                  show={value === key}
                  parentHandleClick={handleClick}
                  setDepth={setDepth}
                />
                {hasSeparator && <hr className={styles.Separator} />}
              </li>
            ) : (
              <li key={`menu-${depth}-item-${key}`}>
                {(() => {
                  if (isHeading) {
                    return (
                      <Typography
                        className={styles.NavigationListType}
                        variant="h6"
                      >
                        {label}
                      </Typography>
                    );
                  } else if (isParagraph) {
                    return (
                      <Typography
                        className={styles.NavigationListType}
                        variant="body1"
                      >
                        {label}
                      </Typography>
                    );
                  } else if (image) {
                    return (
                      <img alt={label} className={styles.Image} src={image} />
                    );
                  } else {
                    return (
                      <NavigationListButton action={action}>
                        {isBigLink ? (
                          <>
                            <Icon source={Arrow} />
                            <b>{label}</b>
                          </>
                        ) : (
                          label
                        )}
                      </NavigationListButton>
                    );
                  }
                })()}
                {hasSeparator && <hr className={styles.Separator} />}
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
          <ul className={styles.Utilities}>
            {utilities.map(({ label, action }, key) => (
              <li key={`mobile-utilities-link-${key}`}>
                <NavigationListButton action={action}>
                  {label}
                </NavigationListButton>
              </li>
            ))}
          </ul>
        )}
        {isRoot && (
          <li>
            <NavigationListButton
              endIcon={<ChevronRight />}
              onClick={toggleLanguageSelection}
            >
              Language
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
    className={classnames(styles.NavigationListButton, className, {
      [styles["NavigationListButton--active"]]: active
    })}
    variant="text"
    {...rest}
  >
    {children}
  </Button>
);

export default Navigation;
