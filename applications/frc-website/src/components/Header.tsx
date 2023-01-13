import {
  Container,
  Icopal as IcopalLogoSVG,
  Typography
} from "@bmi-digital/components";
import Paper from "@mui/material/Paper";
import { Link } from "gatsby";
import React from "react";
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
