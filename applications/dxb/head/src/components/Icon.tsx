import {
  Icon as IconComponent,
  iconMap as iconIconMap,
  logoIconMap
} from "@bmi-digital/components";
import QuestionMark from "@material-ui/icons/Help";
import React from "react";

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
