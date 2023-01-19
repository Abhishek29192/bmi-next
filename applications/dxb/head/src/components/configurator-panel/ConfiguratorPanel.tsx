import { Typography } from "@bmi-digital/components";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccordionProps } from "@mui/material";
import React, { ReactNode } from "react";
import {
  classes,
  Content,
  Root,
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary
} from "./styles";

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
    <Root ref={forwardedRef}>
      <StyledAccordion
        square
        elevation={0}
        expanded={isExpanded}
        onChange={handleOnChange}
        data-testid="configurator-panel-accordion"
        {...rest}
      >
        <StyledAccordionSummary
          expandIcon={<ExpandMoreIcon />}
          data-testid="configurator-panel-accordion-summary"
        >
          <Typography
            color="inherit"
            component="h3"
            variant="h3"
            className={classes.title}
            data-testid="configurator-panel-accordion-summary-title"
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
        </StyledAccordionSummary>
        <StyledAccordionDetails data-testid="configurator-panel-accordion-details">
          {children && (
            <Content data-testid="configurator-panel-accordion-details-content">
              {children}
            </Content>
          )}
          {options}
        </StyledAccordionDetails>
      </StyledAccordion>
    </Root>
  );
};

const ConfiguratorPanelWithRef = React.forwardRef(ConfiguratorPanel);

export default ConfiguratorPanelWithRef;
