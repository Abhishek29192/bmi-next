import React from "react";
import { Table } from "@bmi/components";
import { graphql } from "gatsby";
import styles from "./styles/EmbeddedTable.module.scss";

type TableFields = {
  data: {
    tableData: readonly string[][];
  };
};

type Props = {
  fields: TableFields;
};

const EmbeddedTable = ({ fields }: Props) => {
  const {
    data: { tableData }
  } = fields;
  const [head, ...rows] = tableData || [];

  if (!head) {
    return null;
  }

  return (
    <div className={styles["EmbeddedTable"]}>
      <Table>
        <Table.Head>
          <Table.Row>
            {head.map((cellText, cellIndex) => (
              <Table.Cell key={cellIndex}>{cellText}</Table.Cell>
            ))}
          </Table.Row>
        </Table.Head>
        {rows.length > 0 ? (
          <Table.Body>
            {rows.map((row, rowIndex) => (
              <Table.Row key={rowIndex}>
                {row.map((cellText, cellIndex) => (
                  <Table.Cell key={cellIndex}>{cellText}</Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        ) : null}
      </Table>
    </div>
  );
};

export default EmbeddedTable;

export const query = graphql`
  fragment EmbeddedTableFragment on ContentfulTable {
    __typename
    contentful_id
    data {
      tableData
    }
  }
`;
