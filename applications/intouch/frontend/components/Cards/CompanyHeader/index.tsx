import React from "react";
import Typography from "@bmi/typography";
import Grid from "@bmi/grid";
import { InfoPair } from "../../InfoPair";
import styles from "./styles.module.scss";

export type CompanyHeaderProps = {
  title: string;
  children?: React.ReactNode | React.ReactNode[];
};

export const CompanyHeader = ({ title, children }: CompanyHeaderProps) => {
  return (
    <div className={styles.main}>
      <Typography variant="h4" hasUnderline>
        {title}
      </Typography>
      <div className={styles.body}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3} xl={3}>
            <img
              src="https://source.unsplash.com/MjLrM8rVMC0/600x600"
              alt=""
              style={{ maxWidth: "100%" }}
            />
          </Grid>
          <Grid item xs={12} lg={9} xl={9}>
            <div>
              <InfoPair title="Company description">
                J & J London Roofing provide a wide range of roofing services
                including roof repairs, new roof installation, flat roof repairs
                and new flat roofs, tiling, slating, leadwork, pointing, ridge
                and hip tiles as well as the supply and installation of
                guttering, fascias and soffits. Our team of roofing
                professionals are highly experienced and fully qualified in
                their field.
              </InfoPair>
            </div>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <InfoPair title="Main office address">
                  28 Old Brompton Road
                  <br />
                  South Kensington
                  <br />
                  London
                  <br />
                  SW7 3SS
                </InfoPair>
              </Grid>
              <Grid item xs={12} md={6}></Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
