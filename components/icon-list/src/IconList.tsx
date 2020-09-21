import React from "react";
import styles from "./IconList.module.scss";
import Typography from "@bmi/typography";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

type ListItemProps = {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
  component?: React.ElementType;
};
const ListItem = ({ icon, title, children, component }: ListItemProps) => (
  <div className={styles["ListItem"]}>
    <div className={styles["icon"]}>{icon || <ChevronRightIcon />}</div>
    <div className={styles["content"]}>
      <Typography
        className={styles["title"]}
        component={component}
        variant="h6"
      >
        {title}
      </Typography>
      {children}
    </div>
  </div>
);

type Props = {
  children:
    | React.ReactElement<ListItemProps>
    | React.ReactElement<ListItemProps>[];
};

const IconList = ({ children }: Props) => {
  const items: React.ReactElement<any>[] = [].concat(children);
  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </div>
  );
};

IconList.Item = ListItem;

export default IconList;
