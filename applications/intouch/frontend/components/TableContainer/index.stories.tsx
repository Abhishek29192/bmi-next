import React from "react";
import Table from "@bmi-digital/components/table";
import { TableContainer } from ".";

export default {
  title: "Table Container",
  component: TableContainer
};

export const Empty = () => <TableContainer title="Certification(s)" />;

export const HasTable = () => (
  <TableContainer title="Projects">
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Cell>
            <i>Lorem</i>
          </Table.Cell>
          <Table.Cell>ipsum</Table.Cell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Lorem</Table.Cell>
          <Table.Cell>ipsum</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Lorem</Table.Cell>
          <Table.Cell>ipsum</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Lorem</Table.Cell>
          <Table.Cell>ipsum</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </TableContainer>
);
