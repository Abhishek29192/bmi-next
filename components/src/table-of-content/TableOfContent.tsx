import React, { useState, useContext, useEffect } from "react";
import AnchorLink from "../anchor-link/AnchorLink";
import styles from "./TableOfContent.module.scss";

type ContextType = {
  titles: Record<string, string>;
  getTitleId: (title: string) => string;
};

export const Context = React.createContext<ContextType>({
  titles: {},
  getTitleId: (title) => title
});

const getId = (title: string) =>
  title
    .split(" ")
    .map((word) => word.toLowerCase())
    .join("-")
    .replace(/[^\w-]+/g, "");

const TableOfContentAnchor = ({
  title,
  children,
  offset = 150
}: {
  title: string;
  children?: React.ReactNode;
  offset?: number;
}) => {
  const { getTitleId } = useContext(Context);
  const [titleId, setTitleId] = useState<string>();

  useEffect(() => {
    setTitleId(getTitleId(title));
  }, []);

  return (
    <div
      style={{ marginTop: `-${offset}px`, paddingTop: `${offset}px` }}
      id={titleId}
    >
      {children}
    </div>
  );
};

const TableOfContentMenu = ({
  className,
  anchorLinkComponent: AnchorComponent = AnchorLink
}: {
  className?: string;
  anchorLinkComponent?: React.ElementType;
}) => {
  return (
    <Context.Consumer>
      {({ titles }) => (
        <div className={className}>
          {Object.entries(titles).map(([title, sectionId], index) => {
            return (
              <div className={styles["link"]} key={index}>
                <AnchorComponent
                  action={{
                    model: "htmlLink",
                    href: `#${sectionId}`
                  }}
                >
                  {title}
                </AnchorComponent>
              </div>
            );
          })}
        </div>
      )}
    </Context.Consumer>
  );
};

type Props = {
  children: React.ReactNode;
};

const TableOfContent = ({ children }: Props) => {
  const [titles, setTitles] = useState<Record<string, string>>({});

  const getTitleId = (title: string): string => {
    // eslint-disable-next-line security/detect-object-injection
    !titles[title] &&
      setTitles((prevTitles) => ({ ...prevTitles, [title]: getId(title) }));

    return getId(title);
  };

  return (
    <Context.Provider value={{ titles, getTitleId }}>
      <div className={styles["TOC"]}>{children}</div>
    </Context.Provider>
  );
};

TableOfContent.Anchor = TableOfContentAnchor;
TableOfContent.Menu = TableOfContentMenu;

export default TableOfContent;
