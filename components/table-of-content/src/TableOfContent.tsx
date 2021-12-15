import React, { useState, useContext, useEffect } from "react";
import styles from "./TableOfContent.module.scss";

type ContextType = {
  titles: Record<string, string>;
  renderLink: (sectionId: string, title: string) => React.ReactNode;
  getTitleId: (title: string) => string;
};

const Context = React.createContext<ContextType>({
  titles: {},
  renderLink: (sectionId, title) => null,
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

const TableOfContentMenu = ({ className }: { className?: string }) => {
  return (
    <Context.Consumer>
      {({ titles, renderLink }) => (
        <div className={className}>
          {Object.entries(titles).map(([title, sectionId], index) => {
            return (
              <div className={styles["link"]} key={index}>
                {renderLink(sectionId, title)}
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
  renderLink: (sectionId: string, title: string) => React.ReactNode;
};

const TableOfContent = ({ children, renderLink }: Props) => {
  const [titles, setTitles] = useState<Record<string, string>>({});

  const getTitleId = (title: string): string => {
    // eslint-disable-next-line security/detect-object-injection
    if (!titles[title]) {
      setTitles((prevTitles) => ({ ...prevTitles, [title]: getId(title) }));
    }

    return getId(title);
  };

  return (
    <Context.Provider value={{ titles, renderLink, getTitleId }}>
      <div className={styles["TOC"]}>{children}</div>
    </Context.Provider>
  );
};

TableOfContent.Anchor = TableOfContentAnchor;
TableOfContent.Menu = TableOfContentMenu;

export default TableOfContent;
