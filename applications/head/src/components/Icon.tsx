import React from "react";
import IconComponent from "@bmi/icon";
import PhoneIcon from "@material-ui/icons/Phone";
import MailIcon from "@material-ui/icons/Mail";
import FacebookIcon from "@material-ui/icons/Facebook";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import YouTubeIcon from "@material-ui/icons/YouTube";
import AeroDek from "@bmi/logo/svgs/AeroDek.svg";
import Arrow from "@bmi/header/svgs/Arrow.svg";
import Icopal from "@bmi/logo/svgs/Icopal.svg";
import Monier from "@bmi/logo/svgs/Monier.svg";
import Monarplan from "@bmi/logo/svgs/Monarplan.svg";
import Zanda from "@bmi/logo/svgs/Zanda.svg";
import QuestionMark from "@material-ui/icons/Help";

export const IconMap = {
  Facebook: FacebookIcon,
  YouTube: YouTubeIcon,
  Mail: MailIcon,
  Phone: PhoneIcon,
  LinkedIn: LinkedInIcon,
  AeroDek: AeroDek,
  Monier: Monier,
  Monarplan: Monarplan,
  Arrow: Arrow,
  Zanda: Zanda,
  Icopal: Icopal
};

const Icon = ({ name }: { name: string }) => {
  const Source = IconMap[name] || QuestionMark;
  return <IconComponent source={Source} />;
};

export default Icon;
