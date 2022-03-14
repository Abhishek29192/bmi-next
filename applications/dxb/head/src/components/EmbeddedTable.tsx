import { Table } from "@bmi/components";
import { graphql } from "gatsby";
import React from "react";
import { useStyles } from "./styles/EmbeddedTableStyles";

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
  const classes = useStyles();

  if (!head) {
    return null;
  }

  return (
    <div className={classes.root}>
      <Table>
        <Table.Head>
          <Table.Row>
            {head.map((cellValue, cellIndex) => (
              <Table.Cell key={cellIndex}>
                {cellValue && cellValue.includes("[{")
                  ? JSON.parse(cellValue).map((cellElement, cellElIndex) => {
                      if (cellElement.attributes.link) {
                        return (
                          <a
                            rel="noreferrer"
                            target="_blank"
                            key={cellElIndex}
                            href={cellElement.attributes.link}
                          >
                            {cellElement.insert}
                          </a>
                        );
                      }
                      return (
                        <span key={cellElIndex}>{cellElement.insert}</span>
                      );
                    })
                  : cellValue}
              </Table.Cell>
            ))}
          </Table.Row>
        </Table.Head>

        {rows.length > 0 ? (
          <Table.Body>
            {rows.map((row, rowIndex) => (
              <Table.Row key={rowIndex}>
                {row.map((cellValue, cellIndex) => (
                  <Table.Cell key={cellIndex}>
                    {cellValue && cellValue.includes("[{")
                      ? JSON.parse(cellValue).map(
                          (cellElement, cellElIndex) => {
                            if (cellElement.attributes.link) {
                              return (
                                <a
                                  rel="noreferrer"
                                  target="_blank"
                                  key={cellElIndex}
                                  href={cellElement.attributes.link}
                                >
                                  {cellElement.insert}
                                </a>
                              );
                            }
                            return (
                              <span key={cellElIndex}>
                                {cellElement.insert}
                              </span>
                            );
                          }
                        )
                      : cellValue}
                  </Table.Cell>
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
