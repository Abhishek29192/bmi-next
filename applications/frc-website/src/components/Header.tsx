import React from "react";
import { Icopal as IcopalLogoSVG } from "@bmi-digital/components";
import Paper from "@material-ui/core/Paper";
import { Container } from "@bmi-digital/components";
import { Typography } from "@bmi-digital/components";
import { Link } from "gatsby";
import styles from "./Header.module.scss";

const BmiHeader = () => {
  return (
    <Paper className={styles.Header} component="header" elevation={3} square>
      <Container className={styles.container}>
        <Link
          to={
            "/" + (typeof window !== "undefined" ? window.location.search : "")
          }
        >
          <IcopalLogoSVG className={styles.logo} />
        </Link>
        <Typography variant="h5" className={styles.text}>
          Bitumen Flat Roof Estimator
        </Typography>
      </Container>
    </Paper>
  );
};

export default BmiHeader;
