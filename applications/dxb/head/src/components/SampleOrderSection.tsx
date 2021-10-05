import React from "react";

import Button from "@bmi/button";
import { Add } from "@material-ui/icons";
import Section from "@bmi/section";
import styles from "./styles/SampleOrderSection.module.scss";
import { useSiteContext } from "./Site";

const SampleOrderSection = () => {
  const { getMicroCopy } = useSiteContext();

  return (
    <Section
      backgroundColor="white"
      spacing="none"
      className={styles["SampleOrderSection"]}
      hasNoPadding
    >
      <hr />
      <Button endIcon={<Add />}>
        {getMicroCopy("pdp.overview.addSample")}
      </Button>
    </Section>
  );
};

export default SampleOrderSection;
