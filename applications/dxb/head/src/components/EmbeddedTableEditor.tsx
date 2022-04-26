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

type CellProps = {
  cellArray: string[];
};

const EmbeddedTableEditorCell = ({ cellArray }: CellProps): JSX.Element => {
  return (
    <>
      {cellArray.map((cellTextArray, cellIndex) => (
        <Table.Cell key={cellIndex}>
          {JSON.parse(cellTextArray).map((cellElement, cellElIndex) => {
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
            return <span key={cellElIndex}>{cellElement.insert}</span>;
          })}
        </Table.Cell>
      ))}
    </>
  );
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
            <EmbeddedTableEditorCell cellArray={head} />
          </Table.Row>
        </Table.Head>

        {rows.length > 0 ? (
          <Table.Body>
            {rows.map((row, rowIndex) => (
              <Table.Row key={rowIndex}>
                <EmbeddedTableEditorCell cellArray={row} />
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
