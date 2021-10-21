import React from "react";
import { Row, Col } from "@bmi-digital/react-pdf-maker";

export const LessWidth = ({ children }: { children: React.ReactNode }) => (
  <Row marginBottom={9}>
    <Col width={102}>{children}</Col>
  </Row>
);
