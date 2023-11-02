import { Typography } from "@bmi-digital/components";
import React from "react";
import blueGrey from "../images/blue-grey.jpg";
import brown from "../images/brown.jpg";
import charcoal from "../images/charcoal.jpg";
import green from "../images/green.jpg";

const dialogImageStyle = { width: "100%", marginBottom: 16, marginTop: 36 };
const swatchStyle = {
  minHeight: "100%",
  height: 48
};

export const treeFieldsDisplay = (type: string) => ({
  guarantee: {
    label: "Product guarantee",
    description:
      "Please select the guarantee length that you require for this project.",
    defaultValue: "20",
    options: {
      20: { label: "20 year System" },
      15: { label: "15 Year System" }
    }
  },
  combustible: {
    label: "Roof substrate",
    description:
      type === "APP"
        ? "Please select the roof substrate for your project. We recommend torch-safe roofing systems for combustible substrates such as timber, plywood and OSB. Please refer to our SBS-Bitumen systems if you're working with a combustible substrate."
        : "Please select the roof substrate for your project. We recommend torch-safe roofing systems for combustible substrate types such as timber, plywood and OSB.",
    options: {
      Yes: { label: "Combustible (timber/plywood)" },
      No: { label: "Non-combustible (metal/concrete)" }
    }
  },
  insulated: {
    label: "Roof insulation",
    description: "Please select if this roof is insulated or uninsulated.",
    options: {
      Yes: { label: "Insulated (Warm roof)" },
      No: { label: "Uninsulated (Cold-roof)" }
    }
  },
  color: {
    label: "Capsheet colour",
    description: "Please select the desired colour finish of the system.",
    helpContent: (
      <>
        <img src={green} style={dialogImageStyle} alt={"Green colour finish"} />
        <Typography>
          <b>Green</b>
        </Typography>
        <img src={brown} style={dialogImageStyle} alt={"Brown colour finish"} />
        <Typography>
          <b>Brown</b>
        </Typography>
        <img
          src={charcoal}
          style={dialogImageStyle}
          alt={"Charcoal colour finish"}
        />
        <Typography>
          <b>Charcoal</b>
        </Typography>
        <img
          src={blueGrey}
          style={dialogImageStyle}
          alt={"Blue/Grey colour finish"}
        />
        <Typography>
          <b>Blue/Grey</b>
        </Typography>
      </>
    ),
    options: {
      Green: {
        label: "Green",
        before: (
          <img src={green} style={swatchStyle} alt={"Green colour finish"} />
        )
      },
      Charcoal: {
        label: "Charcoal",
        before: (
          <img
            src={charcoal}
            style={swatchStyle}
            alt={"Charcoal colour finish"}
          />
        )
      },
      "Blue/Grey": {
        label: "Blue/Grey",
        before: (
          <img
            src={blueGrey}
            style={swatchStyle}
            alt={"Blue/Grey colour finish"}
          />
        )
      },
      Brown: {
        label: "Brown",
        before: (
          <img src={brown} style={swatchStyle} alt={"Brown colour finish"} />
        )
      }
    }
  }
});
