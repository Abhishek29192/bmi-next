import React from "react";
import Head from "next/head";
import Button from "@bmi/button";
import Typography from "@bmi/typography";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>BMI InTouch</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Typography variant="h3">
        DXB component integration prototype (Button + Typography)
      </Typography>
      <Button>Click Me</Button>
    </div>
  );
}
