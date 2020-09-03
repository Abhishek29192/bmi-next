import Typography from "@bmi/typography";
import { Button, ButtonProps } from "@material-ui/core";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import classnames from "classnames";
import React from "react";
import styles from "./Navigation.module.scss";

export interface LinkList {
  label: string;
  hasSeparator?: boolean;
  href?: string;
  image?: string;
  isHeading?: boolean;
  isParagraph?: boolean;
}

export type NavitationList = LinkList & {
  footer?: readonly LinkList[];
  menu?: readonly NavitationList[];
};

type NavigationProps = {
  menu: readonly NavitationList[];
  initialDepth?: number;
  initialValue?: number | boolean;
  utilities: readonly LinkList[];
};

const Navigation = ({
  menu,
  initialDepth = 0,
  initialValue,
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
  utilities?: readonly LinkList[];
};

const NavigationList = ({
  backLabel,
  className,
  depth,
  menu,
  show,
  initialValue = false,
  isFooter = false,
  isRoot = false,
  parentHandleClick,
  setDepth,
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
              {backLabel || "Back"}
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
              href,
              image = null,
              isHeading,
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
                  backLabel={label}
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
                      <NavigationListButton href={href}>
                        {label}
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
            {utilities.map(({ label, href }, key) => (
              <li key={`mobile-utilities-link-${key}`}>
                <NavigationListButton href={href}>{label}</NavigationListButton>
              </li>
            ))}
          </ul>
        )}
      </ul>
    </div>
  );
};

type NavigationListButtonProps = ButtonProps & {
  active?: boolean;
  linkComponent?: React.ElementType;
};

export const NavigationListButton = ({
  active = false,
  children,
  className,
  linkComponent: LinkComponent = Button,
  ...other
}: NavigationListButtonProps) => (
  <LinkComponent
    className={classnames(styles.NavigationListButton, className, {
      [styles["NavigationListButton--active"]]: active
    })}
    {...other}
  >
    {children}
  </LinkComponent>
);

export default Navigation;
