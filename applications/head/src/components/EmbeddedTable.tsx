import React, { useContext } from "react";
import _ from "lodash";
import Table from "@bmi/table";
import { SiteContext } from "../components/Site";

type TableFields = {
  data: {
    [locale: string]: {
      tableData: readonly string[][];
    };
  };
};

type LocalisedTableFields = {
  data: {
    tableData: readonly string[][];
  };
};

type Props = {
  fields: TableFields;
};

const EmbeddedTable = ({ fields }: Props) => {
  const { node_locale } = useContext(SiteContext);

  // TODO: Check the typing here
  const localeFields = _.mapValues(
    fields,
    (value) => value[node_locale]
  ) as LocalisedTableFields;

  const {
    data: { tableData }
  } = localeFields;
  const [head, ...rows] = tableData || [];

  if (!head) {
    return null;
  }

  return (
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
  );
};

export default EmbeddedTable;
