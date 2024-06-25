import React from "react";
import { CourseType } from "@bmi/docebo-types";
import ConnectedTv from "@bmi-digital/components/icon/ConnectedTv";
import ContactsOutlined from "@bmi-digital/components/icon/ContactsOutlined";
import Laptop from "@bmi-digital/components/icon/Laptop";
import { SvgIconProps } from "@mui/material/SvgIcon";

export const trainingTypeIcon: {
  [key in CourseType]: React.FC<SvgIconProps>;
} = {
  classroom: (props) => (
    <ContactsOutlined {...props} data-testid="classroom-training-type-icon" />
  ),
  elearning: (props) => (
    <ConnectedTv {...props} data-testid="elearning-training-type-icon" />
  ),
  webinar: (props) => (
    <Laptop {...props} data-testid="webinar-training-type-icon" />
  )
};
