import React from "react";
import Button from "@bmi/button";
import Table from "@bmi/table";
import Accordion from "@bmi/accordion";
import Typography from "@bmi/typography";
import VisibilityIcon from "@material-ui/icons/Visibility";
import styles from "./styles.module.scss";

export type UploadsTabProps = {
  uploads?: Map<string, string[]>;
};

export const UploadsTab = ({ uploads }: UploadsTabProps) => {
  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <Button variant="outlined">Upload file</Button>
      </div>
      <div className={styles.body}>
        <Accordion>
          {uploads &&
            [...uploads.entries()].map(([key, values]) => {
              return (
                <Accordion.Item key={key} data-testid="uploads-category">
                  <Accordion.Summary>
                    <Typography component="h1" variant="h6">
                      {key}
                    </Typography>
                  </Accordion.Summary>
                  <Accordion.Details>
                    <Table>
                      <Table.Body>
                        {values.map((value) => (
                          <Table.Row key={value} data-testid="uploads-item">
                            <Table.Cell>{value}</Table.Cell>
                            <Table.Cell>
                              <VisibilityIcon />
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </Accordion.Details>
                </Accordion.Item>
              );
            })}
        </Accordion>
      </div>
    </div>
  );
};
