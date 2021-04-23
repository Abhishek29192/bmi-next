import React from "react";
import { gql } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import PhoneIcon from "@material-ui/icons/Phone";
import MailIcon from "@material-ui/icons/Mail";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@bmi/typography";
import Grid from "@bmi/grid";
import Card from "@bmi/card";
import CompanyDetails from "@bmi/company-details";

import { Person } from "@material-ui/icons";
import Icon from "@bmi/icon";
import { Layout } from "../components/Layout";
import { InfoPair } from "../components/InfoPair";
import { CardHeader } from "../components/CardHeader";
import GridStyles from "../styles/Grid.module.scss";

import { initializeApollo } from "../lib/apolloClient";
import { GetCompanyQuery } from "../graphql/generated/operations";
import {
  getServerPageGetCompany,
  getServerPageGetCurrentCompany
} from "../graphql/generated/page";

const getCompanyData = (
  company: GetCompanyQuery["company"]
): { name: string; aboutus: string; details: any } => {
  if (!company) {
    return {
      name: "Company not found",
      aboutus: "company.aboutUs",
      details: []
    };
  }

  const details = [
    {
      type: "cta",
      text: "Get directions",
      action: { model: "htmlLink" as "htmlLink", href: company.website },
      label: "Get directions"
    },
    {
      type: "phone",
      text: company.phone,
      action: {
        model: "htmlLink" as "htmlLink",
        href: `tel:${company.phone}`
      },
      label: "Telephone"
    },
    {
      type: "email",
      text: company.publicEmail,

      action: {
        model: "htmlLink" as "htmlLink",
        href: `mailto:${company.publicEmail}`
      },

      label: "Email"
    },
    {
      type: "website",
      text: "Visit website",
      action: {
        model: "htmlLink" as "htmlLink",
        href: company.website
      },
      label: "Website"
    },
    {
      type: "content",
      label: "Type of roof",
      text: <b>Flat</b>
    },
    {
      type: "roofProLevel",
      label: "BMI RoofPro Level",
      level: "expert"
    }
  ];

  return {
    name: company.name,
    aboutus: "company.aboutUs",
    details
  };
};

export type PageProps = {
  company: GetCompanyQuery["company"];
};

const CompanyPage = ({ company }: PageProps) => {
  const { t } = useTranslation("company-page");

  const { name, aboutus, details } = getCompanyData(company);
  return (
    <Layout title={t("Company")}>
      <Grid
        container
        spacing={3}
        className={GridStyles.outerGrid}
        alignItems="stretch"
      >
        <Grid item xs={12} lg={7} xl={8}>
          <Card className={GridStyles.Card}>
            <CardContent>
              <Typography
                variant="h3"
                hasUnderline
                style={{ marginBottom: "1.5rem", fontSize: "1.7rem" }}
              >
                {t("About Us")}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={3} xl={3}>
                  <img
                    src="https://source.unsplash.com/random/600x600"
                    alt=""
                    style={{ maxWidth: "100%" }}
                  />
                </Grid>
                <Grid item xs={12} lg={9} xl={9}>
                  <div>
                    <InfoPair title="Company description">
                      J & J London Roofing provide a wide range of roofing
                      services including roof repairs, new roof installation,
                      flat roof repairs and new flat roofs, tiling, slating,
                      leadwork, pointing, ridge and hip tiles as well as the
                      supply and installation of guttering, fascias and soffits.
                      Our team of roofing professionals are highly experienced
                      and fully qualified in their field.
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
                    <Grid item xs={12} md={6}>
                      <InfoPair title="Contacts">
                        <Button
                          style={{ marginTop: "0.5rem" }}
                          startIcon={<PhoneIcon />}
                        >
                          07436 920 949
                        </Button>
                        <br />
                        <Button startIcon={<PhoneIcon />}>07436 920 949</Button>
                        <br />
                        <Button startIcon={<MailIcon />}>
                          roofing28@yahoo.com
                        </Button>
                      </InfoPair>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5} xl={4}>
          <Card className={GridStyles.Card}>
            <CardContent>
              <Typography
                variant="h4"
                hasUnderline
                style={{ marginBottom: "1.5rem", fontSize: "1.2rem" }}
              >
                {t("Registered Details")}
              </Typography>
              <CompanyDetails name={name} details={details}>
                {aboutus}
              </CompanyDetails>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4} xl={4}>
          <Card className={GridStyles.Card}>
            <CardContent>
              <Typography variant="h5" style={{ marginBottom: "0.5rem" }}>
                {t("Company Owner")}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "1.5rem" }}>
                {t("A company owner hasn't been added to your company yet.")}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
              >
                {t("Add a company owner")}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4} xl={4}>
          <Card className={GridStyles.Card}>
            <CardHeader>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="avatar">
                  <Icon
                    source={Person}
                    style={{ width: 50, height: 50, color: "#eeeeee" }}
                  />
                </div>
                <div>
                  <Typography variant="h6" style={{ marginBottom: "0.25rem" }}>
                    Jack Peterson
                  </Typography>
                  <Typography
                    variant="h6"
                    style={{ color: "#70706f", fontWeight: "lighter" }}
                  >
                    Company Administrator
                  </Typography>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button startIcon={<PhoneIcon />}>07436 920 949</Button>
              <br />
              <Button startIcon={<MailIcon />}>roofing28@yahoo.com</Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5} xl={4}>
          <Card className={GridStyles.Card}>
            <CardContent>
              <Typography
                variant="h4"
                hasUnderline
                style={{ marginBottom: "1.5rem", fontSize: "1.2rem" }}
              >
                {t("Roofpro Support")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export const GET_CURRENT_COMPANY = gql`
  query GetCurrentCompany {
    currentCompany
  }
`;

export const GET_COMPANY = gql`
  query GetCompany($companyId: Int!) {
    company(id: $companyId) {
      name
      phone
      website
      aboutUs
      publicEmail
      phone
      website
    }
  }
`;

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const apolloClient = await initializeApollo(null, ctx);

    const pageProps = {
      company: null,
      ...(await serverSideTranslations(ctx.locale, [
        "common",
        "sidebar",
        "footer",
        "company-page"
      ]))
    };

    const {
      props: {
        data: { currentCompany }
      }
    } = await getServerPageGetCurrentCompany({}, apolloClient);

    if (currentCompany) {
      const {
        props: {
          data: { company }
        }
      } = await getServerPageGetCompany(
        { variables: { companyId: currentCompany } },
        apolloClient
      );
      pageProps.company = company;
    }

    return { props: pageProps };
  }
});

export default CompanyPage;
