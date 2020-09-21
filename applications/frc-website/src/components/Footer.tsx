import React from "react";
import Footer from "@bmi/footer";
import IcopalLogoSVG from "@bmi/logo/svgs/Icopal.svg";

const BmiFooter = () => {
  return (
    <Footer
      mainNavigation={[]}
      secondaryNavigation={[
        {
          label: "Warranty"
        },
        {
          label: "Cookie Policy"
        },
        {
          label: "Terms and conditions"
        }
      ]}
      logo={IcopalLogoSVG}
    />
  );
};

export default BmiFooter;
