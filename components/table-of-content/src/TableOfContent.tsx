import React, { isValidElement } from "react";
import Section, { Props as SectionProps } from "@bmi/section";
import Typography from "@bmi/typography";
import styles from "./TableOfContent.module.scss";
import classnames from "classnames";

type ContextType = {
  titles: string[];
  renderLink: (sectionId: string, title: string) => React.ReactNode;
};

const Context = React.createContext<ContextType>({
  titles: [],
  renderLink: (sectionId, title) => null
});

const getId = (title: string) =>
  title
    .split(" ")
    .map((word) => word.toLowerCase())
    .join("-")
    .replace(/[^\w-]+/g, "");

type ContentSectionProps = SectionProps & {
  title: string;
};

const ContentSection = ({
  title,
  children,
  backgroundColor
}: ContentSectionProps) => {
  const sectionId = getId(title);

  return (
    <Section backgroundColor={backgroundColor}>
      <Typography
        id={sectionId}
        variant="h2"
        hasUnderline
        className={styles["section-heading"]}
      >
        {title}
      </Typography>
      <div>{children}</div>
    </Section>
  );
};

const Menu = ({
  header,
  className
}: {
  header: React.ReactNode;
  className?: string;
}) => {
  return (
    <Context.Consumer>
      {({ titles, renderLink }) => (
        <div className={classnames(styles["menu"], className)}>
          <Typography variant="h4" className={styles["menu-title"]}>
            {header}
          </Typography>
          {titles.map((title, index) => {
            const sectionId = getId(title);
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
  const titles = React.Children.map(children, (child) => {
    if (isValidElement(child) && child.type && child.type === ContentSection) {
      return child.props.title;
    }
    return null;
  }).filter(Boolean);

  return (
    <Context.Provider value={{ titles, renderLink }}>
      <div className={styles["TOC"]}>{children}</div>
    </Context.Provider>
  );
};

TableOfContent.Section = ContentSection;
TableOfContent.Menu = Menu;

export default TableOfContent;
