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
import { makeStyles } from "@material-ui/core/styles";
import variables from "./Accordion.module.scss";

export const useAccordionStyles = makeStyles(
  () => ({
    root: {
      "& .MuiAccordionSummary-root.Mui-expanded": {
        minHeight: "48px"
      },
      "& .MuiAccordion-root.Mui-expanded": {
        margin: "0px",
        minHeight: "48px"
      },
      "& .Mui-expanded": {
        margin: "0px"
      }
    },
    item: {
      backgroundColor: variables["color-pearl"],
      border: "1px",
      borderStyle: "solid",
      borderColor: variables["color-storm"],
      "&:nth-child(n+2)": {
        borderTop: "0px"
      },
      "& + .item": {
        borderTop: "none",
        marginTop: "-1px"
      },
      "&:last-of-type .details": {
        borderBottomLeftRadius: "4px",
        borderBottomRightRadius: "4px"
      }
    },
    details: {
      backgroundColor: variables["color-white"],
      borderTop: "1px",
      borderTopStyle: "solid",
      borderTopColor: variables["color-storm"]
    },
    "no-inner-padding": {
      "& .MuiAccordionDetails-root": {
        padding: 0
      }
    },
    summaryRoot: {
      minHeight: "48px"
    },
    summaryExpanded: {
      minHeight: "revert",
      margin: "0"
    },
    summaryContent: {}
  }),
  { classNamePrefix: "accordionStyles" }
);

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
  const classes = useAccordionStyles();
  const [expanded, setExpanded] = useState<number>(firstDefaultExpanded + 1);

  return (
    <div
      className={classnames(
        classes.root,
        noInnerPadding && classes["no-inner-padding"]
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
  const classes = useAccordionStyles();
  const handleChange = (
    event: React.ChangeEvent<{}>,
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
    <ExpansionPanel
      expanded={isExpanded}
      onChange={handleChange}
      className={classes.item}
      {...props}
    >
      {children}
    </ExpansionPanel>
  );
};

export type AccordionSummaryProps = ExpansionPanelSummaryProps & {
  expandIcon?: React.ReactElement;
  collapseIcon?: React.ReactElement;
};

const AccordionSummary = ({
  children,
  expandIcon = <ExpandMoreIcon />,
  ...other
}: AccordionSummaryProps) => {
  const classes = useAccordionStyles();
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

const AccordionDetails = ({ children, ...other }: AccordionSummaryProps) => {
  const classes = useAccordionStyles();
  return (
    <ExpansionPanelDetails className={classes.details} {...other}>
      {children}
    </ExpansionPanelDetails>
  );
};

Accordion.Summary = AccordionSummary;
Accordion.Details = AccordionDetails;
Accordion.Item = AccordionItem;

export default Accordion;
