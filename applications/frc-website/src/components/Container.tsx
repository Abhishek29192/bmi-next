import React from "react";
import Container from "@bmi/container";
import styles from "./Container.module.scss";

type Props = {
  children?: React.ReactNode;
};

const BMIContainer = ({ children }: Props) => {
  return <Container className={styles.Container}>{children}</Container>;
};

export default BMIContainer;
