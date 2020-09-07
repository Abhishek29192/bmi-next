import GBIconSource from "./images/en_GB.svg";
import ITIconSource from "./images/it_IT.svg";

export const defaultLanguage = {
  code: "GB",
  label: "United Kingdom",
  icon: GBIconSource
};

export default [
  {
    label: "Europe",
    menu: [
      defaultLanguage,
      {
        code: "IT",
        label: "Italia",
        icon: ITIconSource
      }
    ]
  }
];
