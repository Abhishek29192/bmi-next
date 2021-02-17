import React from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Card from "@bmi/card";
import CompanyDetails from "@bmi/company-details";
import { useQuery, gql } from "@apollo/client";
import Layout from "../components/Layout";

const GET_COMPANY = gql`
  query GetCompanyDetail($companyId: Int!) {
    companyById(id: $companyId) {
      name
      privateemail
      aboutus
      phone
      website
      tradingaddressline2
    }
  }
`;

interface Company {
  name: string;
  privateemail: string;
  aboutus: string;
  phone: string;
  website: string;
  tradingaddressline2: string;
}
interface CompanyData {
  companyById: Company;
}
interface CompanyVars {
  companyId: number;
}

const getCompanyData = (
  companyData: CompanyData
): { name: string; aboutus: string; details: any } => {
  const company = companyData.companyById;
  const details = [
    {
      type: "address",
      text: company.tradingaddressline2,
      label: "Address"
    },
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
      text: company.privateemail,

      action: {
        model: "htmlLink" as "htmlLink",
        href: `mailto:${company.privateemail}`
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
    aboutus: company.aboutus,
    details
  };
};

const Company = () => {
  const { t } = useTranslation("common");

  const { loading, data } = useQuery<CompanyData, CompanyVars>(GET_COMPANY, {
    variables: { companyId: 2 }
  });

  if (loading) {
    return <p>Loading</p>;
  }

  const { name, aboutus, details } = getCompanyData(data);
  return (
    <Layout title={t("Company")}>
      <Card
        style={{
          padding: "60px",
          maxHeight: "100%"
        }}
      >
        <CompanyDetails name={name} details={details}>
          {aboutus}
        </CompanyDetails>
      </Card>
    </Layout>
  );
};

export const getStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        "common",
        "sidebar",
        "footer"
      ]))
    }
  };
};

export default Company;
