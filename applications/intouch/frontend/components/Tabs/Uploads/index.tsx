import React from "react";
import Button from "@bmi/button";
import Accordion from "@bmi/accordion";
import Typography from "@bmi/typography";
import styles from "./styles.module.scss";

export type UploadsTabProps = {
  children?: React.ReactNode | React.ReactNode[];
};

export const UploadsTab = ({ children }: UploadsTabProps) => {
  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <Button variant="outlined">Upload file</Button>
      </div>
      <div className={styles.body}>
        <Accordion>
          <Accordion.Item>
            <Accordion.Summary>
              <Typography component="h1" variant="h6">
                Roof corners
              </Typography>
            </Accordion.Summary>
            <Accordion.Details>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </Accordion.Details>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Summary>
              <Typography component="h1" variant="h6">
                Ventilation systems
              </Typography>
            </Accordion.Summary>
            <Accordion.Details>
              <Typography>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
              </Typography>
            </Accordion.Details>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Summary>
              <Typography component="h1" variant="h6">
                Chimney
              </Typography>
            </Accordion.Summary>
            <Accordion.Details>
              <Typography>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </Typography>
            </Accordion.Details>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Summary>
              <Typography component="h1" variant="h6">
                Receipt of purchase
              </Typography>
            </Accordion.Summary>
            <Accordion.Details>
              <Typography>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </Typography>
            </Accordion.Details>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Summary>
              <Typography component="h1" variant="h6">
                Supporting files
              </Typography>
            </Accordion.Summary>
            <Accordion.Details>
              <Typography>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </Typography>
            </Accordion.Details>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
};
