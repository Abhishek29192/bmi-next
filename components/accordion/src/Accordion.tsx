import ExpansionPanel, {
  ExpansionPanelProps
} from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import MaterialAccordionSummary, {
  ExpansionPanelSummaryProps
} from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React from "react";
import styles from "./Accordion.module.scss";

const Accordion = ({ children, ...props }: ExpansionPanelProps) => (
  <ExpansionPanel className={styles.Accordion} {...props}>
    {children}
  </ExpansionPanel>
);

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

export default Accordion;
