import React, { ChangeEvent, ReactNode } from "react";
import Accordion, { AccordionProps } from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@bmi/typography";
import styles from "./ConfiguratorPanel.module.scss";

export type ConfiguratorPanelProps = {
  title: string;
  selectedOptionTitle?: string;
  isExpanded?: boolean;
  options?: ReactNode[];
  children?: ReactNode;
  handleOnChange?: (event: ChangeEvent<{}>, expanded: boolean) => void;
} & Partial<AccordionProps>;

const ConfiguratorPanel = (
  {
    title,
    selectedOptionTitle,
    isExpanded,
    options,
    children,
    handleOnChange,
    ...rest
  }: ConfiguratorPanelProps,
  forwardedRef?: React.Ref<HTMLDivElement>
) => {
  return (
    <div ref={forwardedRef} className={styles["ConfiguratorPanel"]}>
      <Accordion
        square
        className={styles["panel"]}
        elevation={0}
        expanded={isExpanded}
        onChange={handleOnChange}
        {...rest}
      >
        <AccordionSummary
          className={styles["summary"]}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography
            color="inherit"
            component="h3"
            variant="h3"
            className={styles["title"]}
          >
            {selectedOptionTitle ? (
              <>
                {`${title}: `}
                <span className={styles["selected-title"]}>
                  {selectedOptionTitle}
                </span>
              </>
            ) : (
              title
            )}
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={styles["details"]}>
          {children && <div className={styles["content"]}>{children}</div>}
          {options}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

const ConfiguratorPanelWithRef = React.forwardRef(ConfiguratorPanel);

export default ConfiguratorPanelWithRef;
