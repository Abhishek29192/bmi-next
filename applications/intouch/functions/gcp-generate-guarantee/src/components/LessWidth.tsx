import React from "react";
import { Row, Col } from "react-pdf-maker";

export const LessWidth = ({ children }: { children: React.ReactNode }) => (
  <Row marginBottom={9}>
    <Col width={102}>{children}</Col>
  </Row>
);
