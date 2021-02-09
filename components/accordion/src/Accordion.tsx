import ExpansionPanel, {
  AccordionProps as ExpansionPanelProps
} from "@material-ui/core/Accordion";
import ExpansionPanelDetails from "@material-ui/core/AccordionDetails";
import MaterialAccordionSummary, {
  AccordionSummaryProps as ExpansionPanelSummaryProps
} from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useState } from "react";
import classnames from "classnames";
import styles from "./Accordion.module.scss";

type AccordionItemProps = ExpansionPanelProps & {
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

  const [expanded, setExpanded] = useState<number>(firstDefaultExpanded + 1);

  return (
    <div
      className={classnames(
        styles["Accordion"],
        noInnerPadding && styles["Accordion--no-inner-padding"]
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
  const handleChange = (event, expandedState) => {
    if (setExpanded) {
      setExpanded(expandedState ? itemKey : 0);
    }
    if (onChange) {
      onChange(event, expandedState);
    }
  };

  return (
    <ExpansionPanel
      expanded={isExpanded}
      onChange={handleChange}
      className={styles["item"]}
      {...props}
    >
      {children}
    </ExpansionPanel>
  );
};

type AccordionSummaryProps = ExpansionPanelSummaryProps & {
  expandIcon?: React.ReactElement;
  collapseIcon?: React.ReactElement;
};

const AccordionSummary = ({
  children,
  expandIcon = <ExpandMoreIcon />,
  ...other
}: AccordionSummaryProps) => (
  <MaterialAccordionSummary expandIcon={expandIcon} {...other}>
    {children}
  </MaterialAccordionSummary>
);

const AccordionDetails = ({ children, ...other }: AccordionSummaryProps) => (
  <ExpansionPanelDetails className={styles["details"]} {...other}>
    {children}
  </ExpansionPanelDetails>
);

Accordion.Summary = AccordionSummary;
Accordion.Details = AccordionDetails;
Accordion.Item = AccordionItem;

export default Accordion;
