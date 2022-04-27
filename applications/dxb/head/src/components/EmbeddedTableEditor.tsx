import React from "react";
import { Table } from "@bmi/components";
import { graphql } from "gatsby";
import styles from "./styles/EmbeddedTableEditor.module.scss";

type TableEditorFields = {
  data: {
    tableData: readonly string[][];
  };
};

type Props = {
  fields: TableEditorFields;
};

const EmbeddedTableEditor = ({ fields }: Props) => {
  const {
    data: { tableData }
  } = fields;
  const [head, ...rows] = tableData || [];

  if (!head) {
    return null;
  }

  return (
    <div className={styles["EmbeddedTableEditor"]}>
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

export default EmbeddedTableEditor;

export const query = graphql`
  fragment EmbeddedTableEditorFragment on ContentfulTableEditor {
    __typename
    contentful_id
    data {
      tableData
    }
  }
`;
