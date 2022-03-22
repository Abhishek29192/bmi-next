import React from "react";
import { Icon as IconComponent, iconMap as iconIconMap } from "@bmi/components";
import { logoIconMap } from "@bmi/components";
import QuestionMark from "@material-ui/icons/Help";

export const iconMap = {
  ...iconIconMap,
  ...logoIconMap
};

export type IconName = keyof typeof iconMap;

const Icon = ({ name }: { name: keyof typeof iconMap }) => {
  // eslint-disable-next-line security/detect-object-injection
  const Source = iconMap[name] || QuestionMark;
  return <IconComponent source={Source} />;
};

export default Icon;
