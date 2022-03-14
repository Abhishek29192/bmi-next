import { Typography } from "@bmi/components";
import Accordion, { AccordionProps } from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { ChangeEvent, ReactNode } from "react";
import { useStyles } from "./styles";

export type ConfiguratorPanelProps = {
  title: string;
  selectedOptionTitle?: string;
  isExpanded?: boolean;
  options?: ReactNode[];
  children?: ReactNode;
  handleOnChange?: (
    event: ChangeEvent<Record<string, unknown>>,
    expanded: boolean
  ) => void;
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
  const classes = useStyles();
  return (
    <div ref={forwardedRef} className={classes.root}>
      <Accordion
        square
        className={classes.panel}
        elevation={0}
        expanded={isExpanded}
        onChange={handleOnChange}
        {...rest}
      >
        <AccordionSummary
          className={classes.summary}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography
            color="inherit"
            component="h3"
            variant="h3"
            className={classes.title}
          >
            {selectedOptionTitle ? (
              <>
                {`${title}: `}
                <span className={classes.selectedTitle}>
                  {selectedOptionTitle}
                </span>
              </>
            ) : (
              title
            )}
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          {children && <div className={classes.content}>{children}</div>}
          {options}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

const ConfiguratorPanelWithRef = React.forwardRef(ConfiguratorPanel);

export default ConfiguratorPanelWithRef;
