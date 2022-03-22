import React from "react";
import { Container } from "@bmi/components";
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
