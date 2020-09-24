import React from "react";
import IconComponent from "@bmi/icon";
import Phone from "@material-ui/icons/Phone";
import Mail from "@material-ui/icons/Mail";
import Facebook from "@material-ui/icons/Facebook";
import LinkedIn from "@material-ui/icons/LinkedIn";
import YouTube from "@material-ui/icons/YouTube";
import AeroDek from "@bmi/logo/svgs/AeroDek.svg";
import Arrow from "@bmi/icon/src/svgs/Arrow.svg";
import Icopal from "@bmi/logo/svgs/Icopal.svg";
import Monier from "@bmi/logo/svgs/Monier.svg";
import Monarplan from "@bmi/logo/svgs/Monarplan.svg";
import Zanda from "@bmi/logo/svgs/Zanda.svg";
import QuestionMark from "@material-ui/icons/Help";
import User from "@material-ui/icons/Person";

export const iconMap = {
  Facebook,
  YouTube,
  Mail,
  Phone,
  LinkedIn,
  AeroDek,
  Monier,
  Monarplan,
  Arrow,
  Zanda,
  Icopal,
  User
};

const Icon = ({ name }: { name: keyof typeof iconMap }) => {
  const Source = iconMap[name] || QuestionMark;
  return <IconComponent source={Source} />;
};

export default Icon;
