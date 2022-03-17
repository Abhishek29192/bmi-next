import React from "react";
import { Technology } from "@bmi/intouch-api-types";
import { SvgIcon } from "@material-ui/core";
import {
  CertificationFlatRoof,
  CertificationOtherTraining,
  CertificationPitchedRoof
} from "@bmi/components";

const CERTIFICATION_ICONS: {
  [K in Technology]: React.FC<React.SVGProps<SVGSVGElement>>;
} = {
  FLAT: CertificationFlatRoof,
  PITCHED: CertificationPitchedRoof,
  OTHER: CertificationOtherTraining
};
const TeamMemberCertification = ({
  certifications
}: {
  certifications: Technology[];
}) => {
  return (
    <div>
      {certifications.map((certification, index) => (
        <SvgIcon
          key={`${certification}-${index}`}
          viewBox="0 0 48 48"
          component={CERTIFICATION_ICONS[certification as Technology]}
          data-testid={`icon-${certification}`}
        />
      ))}
    </div>
  );
};
export default TeamMemberCertification;
