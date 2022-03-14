import {
  Accordion as MaterialAccordion,
  AccordionDetails as MaterialAccordionDetails,
  AccordionProps as MaterialAccordionProps,
  AccordionSummary as MaterialAccordionSummary,
  AccordionSummaryProps as MaterialSummaryProps
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import classnames from "classnames";
import React, { useState } from "react";
import { useStyles } from "./styles";

type AccordionItemProps = MaterialAccordionProps & {
  isExpanded?: boolean;
  setExpanded?: React.Dispatch<React.SetStateAction<number>>;
  isRadio?: boolean;
  itemKey?: number;
  isDefaultExpanded?: boolean;
};

type AccordionProps = {
  children:
    | React.ReactElement<AccordionItemProps>
    | React.ReactElement<AccordionItemProps>[];
  isRadio?: boolean;
  noInnerPadding?: boolean;
};

const Accordion = ({ children, isRadio, noInnerPadding }: AccordionProps) => {
  const firstDefaultExpanded = React.Children.toArray(children).findIndex(
    (child) => React.isValidElement(child) && child.props.defaultExpanded
  );
  const classes = useStyles({ noInnerPadding });
  const [expanded, setExpanded] = useState<number>(firstDefaultExpanded + 1);

  return (
    <div
      className={classnames(
        classes.root,
        noInnerPadding && classes.noInnerPadding
      )}
    >
      {React.Children.map(children, (child, index) => {
        const itemKey = index + 1;
        const radioProps = isRadio
          ? {
              isRadio,
              isExpanded: expanded === itemKey,
              setExpanded
            }
          : {};

        return React.cloneElement(child, {
          itemKey,
          ...radioProps
        });
      })}
    </div>
  );
};

const AccordionItem = ({
  children,
  itemKey,
  onChange,
  isRadio,
  isExpanded,
  setExpanded,
  ...props
}: AccordionItemProps) => {
  const classes = useStyles({});
  const handleChange = (
    event: React.ChangeEvent<Record<string, unknown>>,
    expandedState: boolean
  ) => {
    if (setExpanded) {
      setExpanded(expandedState ? itemKey || 0 : 0);
    }
    if (onChange) {
      onChange(event, expandedState);
    }
  };

  return (
    <MaterialAccordion
      expanded={isExpanded}
      onChange={handleChange}
      className={classes.item}
      {...props}
    >
      {children}
    </MaterialAccordion>
  );
};

export type AccordionSummaryProps = MaterialSummaryProps & {
  expandIcon?: React.ReactElement;
  collapseIcon?: React.ReactElement;
  noInnerPadding?: boolean;
};

const AccordionSummary = ({
  children,
  expandIcon = <ExpandMore />,
  noInnerPadding,
  ...other
}: AccordionSummaryProps) => {
  const classes = useStyles({ noInnerPadding });
  return (
    <MaterialAccordionSummary
      expandIcon={expandIcon}
      {...other}
      classes={{
        root: classes.summaryRoot,
        content: classes.summaryContent,
        expanded: classes.summaryExpanded
      }}
    >
      {children}
    </MaterialAccordionSummary>
  );
};

const AccordionDetails = ({
  children,
  noInnerPadding,
  ...other
}: AccordionSummaryProps) => {
  const classes = useStyles({ noInnerPadding });
  return (
    <MaterialAccordionDetails className={classes.details} {...other}>
      {children}
    </MaterialAccordionDetails>
  );
};

Accordion.Summary = AccordionSummary;
Accordion.Details = AccordionDetails;
Accordion.Item = AccordionItem;

export default Accordion;
