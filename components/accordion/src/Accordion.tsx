import ExpansionPanel, {
  ExpansionPanelProps
} from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import MaterialAccordionSummary, {
  ExpansionPanelSummaryProps
} from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useState } from "react";
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
};

const Accordion = ({ children, isRadio }: AccordionProps) => {
  const firstDefaultExpanded = React.Children.toArray(children).findIndex(
    (child) => React.isValidElement(child) && child.props.defaultExpanded
  );

  const [expanded, setExpanded] = useState<number>(firstDefaultExpanded + 1);

  return (
    <>
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
    </>
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
      className={styles.Accordion}
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

Accordion.Summary = AccordionSummary;
Accordion.Details = ExpansionPanelDetails;
Accordion.Item = AccordionItem;

export default Accordion;
