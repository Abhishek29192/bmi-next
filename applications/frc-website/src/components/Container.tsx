import { Container } from "@bmi-digital/components";
import React from "react";
import styles from "./Container.module.scss";

type Props = {
  children?: React.ReactNode;
};

const BMIContainer = ({ children }: Props) => {
  return (
    <Container className={styles.Container}>{!!children && children}</Container>
  );
};

export default BMIContainer;
