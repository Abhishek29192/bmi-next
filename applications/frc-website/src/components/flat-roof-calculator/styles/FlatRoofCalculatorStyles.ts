import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";

const StyledFlatRoofCalculator = styled("div")(({ theme }) => ({
  ".header": {
    marginTop: "72px",
    marginBottom: "48px"
  },

  ".header3": {
    marginBottom: "24px",

    "&--extra-margin": {
      marginBottom: "48px"
    }
  },

  ".description": {
    marginBottom: "36px",

    "&--less-margin": {
      marginBottom: "24px"
    }
  },

  ".field": {
    marginBottom: "40px",

    "&--extra-margin": {
      marginBottom: "48px"
    },

    ".iconButton": {
      color: theme.colours.storm,
      marginLeft: "24px"
    }
  },

  ".fieldHeader": {
    marginBottom: "8px",
    display: "flex",
    alignItems: "center"
  },

  ".fieldDescription": {
    marginBottom: "36px"
  },

  ".section": {
    marginBottom: "60px",

    "&--less-margin": {
      marginBottom: "48px"
    },

    "&--x-less-margin": {
      marginBottom: "36px"
    },

    "&--xx-less-margin": {
      marginBottom: "24px"
    }
  },

  ".helpHeader": {
    marginBottom: "14px",

    "&--extra-margin": {
      marginBottom: "24px"
    }
  },

  ".divider": {
    marginBottom: "24px"
  },

  ".spaceBetween": {
    display: "flex",
    flexFlow: "column nowrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    margin: "-12px",

    [theme.breakpoints.up("sm")]: {
      flexFlow: "row wrap",
      alignItems: "center",
      justifyContent: "space-between"
    },

    ".item": {
      margin: "12px"
    }
  },

  ".systemName": {
    marginBottom: "24px"
  },

  ".linkContainer": {
    padding: "34px",
    border: `1px solid ${theme.colours.storm}`,
    borderRadius: "6px"
  },

  ".link": {
    fontSize: "18px",
    wordBreak: "break-all"
  },

  ".img": {
    marginTop: "48px",
    width: "100%",
    border: `1px solid ${theme.colours.storm}`
  },

  /* TODO: move to a separate component */
  ".inputLabel": {
    color: theme.colours.slate
  },

  ".input": {
    padding: "14.5px 14px"
  },

  "& :global(.MuiInputLabel-outlined)": {
    transform: "translate(14px, 16px) scale(1)"
  },

  "& :global(.MuiInputLabel-shrink)": {
    /* original Material UI shrink */
    transform: "translate(14px, -6px) scale(0.75)"
  }
}));

export const StyledTable = styled(Table)(({ theme }) => ({
  border: `1px solid ${theme.colours.storm}`,

  ".head": {
    borderBottom: `1px solid ${theme.colours.storm}`,
    backgroundColor: theme.colours.pearl
  },

  ".row": {
    "&:not(:last-child)": {
      borderBottom: `1px solid ${theme.colours.storm}`
    }
  },

  ".cell": {
    fontSize: "18px",
    lineHeight: "25px",
    color: theme.colours.slate,

    "&--bold": {
      fontWeight: "bold"
    }
  }
}));

export default StyledFlatRoofCalculator;
