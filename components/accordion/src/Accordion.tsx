import ExpansionPanel, {
  ExpansionPanelProps
} from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import MaterialAccordionSummary, {
  ExpansionPanelSummaryProps
} from "@material-ui/core/ExpansionPanelSummary";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import React from "react";
import styles from "./Accordion.module.scss";

const Accordion = ({ children, ...props }: ExpansionPanelProps) => (
  <ExpansionPanel {...props}>{children}</ExpansionPanel>
);

type ButtonIconProps = {
  expandIcon: React.ReactElement;
  collapseIcon: React.ReactElement;
};

const ButtonIcon = ({ expandIcon, collapseIcon }: ButtonIconProps) => (
  <>
    {React.cloneElement(expandIcon, {
      className: styles.ExpandIcon
    })}
    {React.cloneElement(collapseIcon, {
      className: styles.CollapseIcon
    })}
  </>
);

type AccordionSummaryProps = ExpansionPanelSummaryProps & {
  expandIcon?: React.ReactElement;
  collapseIcon?: React.ReactElement;
};

const AccordionSummary = ({
  children,
  expandIcon = <AddIcon />,
  collapseIcon = <RemoveIcon />,
  ...props
}: AccordionSummaryProps) => (
  <MaterialAccordionSummary
    expandIcon={
      <ButtonIcon expandIcon={expandIcon} collapseIcon={collapseIcon} />
    }
    {...props}
  >
    {children}
  </MaterialAccordionSummary>
);

Accordion.Summary = AccordionSummary;
Accordion.Details = ExpansionPanelDetails;

export default Accordion;
