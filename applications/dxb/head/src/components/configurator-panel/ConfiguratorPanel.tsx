import { Typography } from "@bmi-digital/components";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion, { AccordionProps } from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import React, { ReactNode } from "react";
import { Root, classes } from "./styles";

export type ConfiguratorPanelProps = {
  title: string;
  selectedOptionTitle?: string;
  isExpanded?: boolean;
  options?: ReactNode[];
  children?: ReactNode;
  handleOnChange?: (event: React.SyntheticEvent, expanded: boolean) => void;
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
    <Root ref={forwardedRef} className={classes.root}>
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
    </Root>
  );
};

const ConfiguratorPanelWithRef = React.forwardRef(ConfiguratorPanel);

export default ConfiguratorPanelWithRef;
