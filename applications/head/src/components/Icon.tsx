import React from "react";
import IconComponent, { iconMap as iconIconMap } from "@bmi/icon";
import { iconMap as logoIconMap } from "@bmi/logo";
import QuestionMark from "@material-ui/icons/Help";

export const iconMap = {
  ...iconIconMap,
  ...logoIconMap
};

export type IconName = keyof typeof iconMap;

const Icon = ({ name }: { name: keyof typeof iconMap }) => {
  const Source = iconMap[name] || QuestionMark;
  return <IconComponent source={Source} />;
};

export default Icon;
