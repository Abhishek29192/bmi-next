import { Form } from "@bmi-digital/components";
import { styled } from "@mui/material/styles";

const PREFIX = "FormSection";

export const classes = {
  root: `${PREFIX}-root`,
  dialog: `${PREFIX}-dialog`
};

export const StyledForm = styled(Form)(({ theme }) => ({
  backgroundColor: theme.colours.white,
  border: `1px solid ${theme.colours.alabaster}`,
  marginTop: "1rem",
  padding: "2rem",
  maxWidth: "920px",
  marginBottom: "1rem"
}));

export const HubspotFormWrapper = styled("div")(({ theme }) => ({
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  color: theme.colours.charcoal,
  fontSize: "1rem",
  marginTop: "1rem",
  padding: "1rem 2rem 2rem",
  maxWidth: "920px",
  [`.${classes.dialog}`]: {
    border: "none",
    padding: 0,
    margin: 0,
    "& input[type=submit]": {
      display: "none"
    }
  },
  ".hs-form fieldset": {
    maxWidth: "none"
  },
  ".legal-consent-container .hs-form-booleancheckbox-display > span": {
    paddingLeft: "40px",
    marginLeft: 0
  },
  ".field": {
    // Text box
    "&.hs-fieldtype-text, &.hs-fieldtype-textarea, &.hs-fieldtype-number, &.hs-fieldtype-date, &.hs-fieldtype-file, &.hs-fieldtype-select":
      {
        "&:focus-within": {
          "& > label": {
            color: theme.colours.inter
          }
        },
        "& > label": {
          backgroundColor: theme.colours.white,
          color: theme.colours.charcoal,
          marginBottom: "-10px",
          fontSize: "14px",
          top: "12px",
          position: "relative",
          left: "9px",
          padding: "0 5px",
          zIndex: 1
        },
        // Inputs
        "& .hs-input": {
          fontFamily: "Effra Regular",
          borderRadius: "4px",
          border: `1px solid ${theme.colours.storm}`,
          padding: "18.5px 14px",
          fontSize: "16px",
          color: theme.colours.charcoal,
          lineHeight: "1.1876em",
          width: "100%",
          "&:hover": {
            borderColor: theme.colours.charcoal
          },
          "&:focus": {
            outline: "none",
            borderColor: theme.colours.inter,
            borderWidth: "2px"
          }
        }
      },
    // Checkbox
    "&.hs-fieldtype-booleancheckbox, &.hs-fieldtype-checkbox": {
      "& .inputs-list": {
        listStyle: "none",
        padding: 0,
        "& li:before": {
          content: "''" //override rich text classes
        }
      },
      "& .hs-form-radio": {
        padding: "10px 0"
      },
      "& .hs-input": {
        position: "relative",
        top: 0,
        height: 0,
        width: "0 !important", // To rewrite HS styles on different screen sizes
        visibility: "hidden"
      },
      "& .hs-input + span": {
        paddingLeft: "40px",
        position: "relative"
      },
      "& .hs-input + span::before": {
        visibility: "visible",
        position: "absolute",
        top: "-9px",
        left: "-9px",
        content: "''",
        display: "block",
        height: "42px",
        width: "42px",
        borderRadius: "50%"
      },
      "& .hs-input + span:hover::before": {
        backgroundColor: "#0072b00a"
      },
      "& .hs-input::after": {
        display: "inline-block",
        position: "absolute",
        top: "-12px",
        left: "-12px"
      },
      "& .hs-input + span::after": {
        position: "absolute",
        left: 0,
        top: "-1px",
        visibility: "visible",
        width: "24px",
        height: "24px",
        content: "''",
        webkitMask: "url(/icons/checkbox_outline.svg) no-repeat center center",
        mask: "url(/icons/checkbox_outline.svg) no-repeat center center",
        backgroundColor: theme.colours.inter
        // This would be preferable, but I can't get this to work unfortunately.
        // content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#0072b0"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>');
      },
      "& .hs-input:checked + span::after": {
        content: "''",
        webkitMask: "url(/icons/checkbox.svg) no-repeat center center",
        mask: "url(/icons/checkbox.svg) no-repeat center center"
        // content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#0072b0"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>');
      }
    },
    // Radio
    "&.hs-fieldtype-radio": {
      "& .inputs-list": {
        listStyle: "none",
        padding: 0,
        "& li:before": {
          content: "''" //override rich text classes
        }
      },
      "& .hs-form-radio": {
        padding: "10px 0"
      },
      "& .hs-input": {
        position: "relative",
        top: 0,
        height: 0,
        width: "0 !important", // To rewrite HS styles on different screen sizes
        visibility: "hidden"
      },
      "& .hs-input + span": {
        paddingLeft: "40px",
        position: "relative"
      },
      "& .hs-input + span::before": {
        visibility: "visible",
        position: "absolute",
        top: "-9px",
        left: "-9px",
        content: "''",
        display: "block",
        height: "42px",
        width: "42px",
        borderRadius: "50%"
      },
      "& .hs-input + span:hover::before": {
        backgroundColor: "#0072b00a"
      },
      "& .hs-input::after": {
        display: "inline-block",
        position: "absolute",
        top: "-12px",
        left: "-12px"
      },
      "& .hs-input + span::after": {
        position: "absolute",
        left: 0,
        top: "-1px",
        visibility: "visible",
        content: "''",
        width: "24px",
        height: "24px",
        webkitMask: "url(/icons/radio_outline.svg) no-repeat center center",
        mask: "url(/icons/radio_outline.svg) no-repeat center center",
        backgroundColor: theme.colours.inter
      },
      "& .hs-input:checked + span::after": {
        webkitMask: "url(/icons/radio.svg) no-repeat center center",
        mask: "url(/icons/radio.svg) no-repeat center center"
      }
    },
    // Select
    "&.hs-fieldtype-select": {
      "& .input": {
        position: "relative"
      },
      "& .input::after": {
        content: "'▾'",
        // font-size: 17px;
        color: theme.colours.slate,
        right: "1rem",
        top: "1rem",
        position: "absolute",
        pointerEvents: "none"
      },
      "& .hs-input": {
        appearance: "none"
      }
    }
  },
  // Date input
  ".hs-dateinput": {
    position: "relative"
  },
  // Date selector
  ".hs-datepicker": {
    "& .is-today .pika-button": {
      color: theme.colours.accent
    },
    "& .is-selected .pika-button": {
      backgroundColor: theme.colours.accent,
      color: theme.colours.white
    },
    "& .pika-button:hover": {
      backgroundColor: `${theme.colours.charcoal} !important`
    }
  },
  ".form-columns-2": {
    "& .hs-form-field:first-of-type": {
      "& .input": {
        marginRight: "24px"
      }
    }
  },
  // Error
  ".hs-error-msgs": {
    color: theme.colours.charcoal,
    fontSize: "14px",
    margin: "5px 0 0",
    padding: "0 15px",
    listStyle: "none"
  },
  // Submit button
  ".hs-submit": {
    paddingRight: "5px"
  },
  ".hs-button": {
    fontFamily: "Effra Regular",
    color: theme.colours.white,
    backgroundColor: theme.colours.inter,
    borderRadius: "3px",
    border: 0,
    fontSize: "16px",
    fontWeight: 500,
    boxShadow:
      "0px 3px 1px -2px #00000033, 0px 2px 2px 0px #00000024, 0px 1px 5px 0px #0000001f",
    padding: "6px 16px",
    lineHeight: 1.75,
    minWidth: "64px",
    transition:
      "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "&:hover": {
      boxShadow:
        "0px 2px 4px -1px #00000033, 0px 4px 5px 0px #00000024, 0px 1px 10px 0px #0000001f",
      backgroundColor: theme.colours.focus,
      cursor: "pointer"
    }
  },
  // HubSpot logo
  ".sproket": {
    display: "none"
  },
  // Typography
  "h1, h2, h3, h4, h5, h6": {
    color: theme.colours.charcoal
  }
}));
