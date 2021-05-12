import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import EditIcon from "@material-ui/icons/Edit";
import { gql } from "@apollo/client";
import Button from "@bmi/button";
import Dialog from "@bmi/dialog";
import Form from "@bmi/form";
import TextField from "@bmi/text-field";
import CompanyDetails from "@bmi/company-details";
import { useUpdateCompanyDetailsMutation } from "graphql/generated/hooks";
import AccessControl from "../lib/permissions/AccessControl";
import { GetCompanyQuery } from "../graphql/generated/operations";

type CompanyType = GetCompanyQuery["company"];

const getCompanyData = (
  company: GetCompanyQuery["company"]
): { name: string; aboutUs?: string; details: any } => {
  if (!company) {
    return {
      name: "Company not found",
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
    aboutUs: company.aboutUs,
    details
  };
};

export const CompanyDetailsFragment = gql`
  fragment CompanyDetailsFragment on Company {
    id
    name
    phone
    website
    aboutUs
    publicEmail
    phone
    website
    companyMembers {
      nodes {
        id
      }
    }
  }
`;

export const UPDATE_COMPANY = gql`
  mutation updateCompanyDetails($input: UpdateCompanyInput!) {
    updateCompany(input: $input) {
      company {
        ...CompanyDetailsFragment
      }
    }
  }
`;

const EditDialog = ({
  company,
  isOpen,
  onCloseClick
}: {
  company: CompanyType;
  isOpen: boolean;
  onCloseClick: () => void;
}) => {
  const [updateCompany] = useUpdateCompanyDetailsMutation();

  const handleSave = (event, values) => {
    event.preventDefault();
    updateCompany({
      variables: {
        input: {
          patch: values,
          id: company.id
        }
      }
    });
    onCloseClick && onCloseClick();
  };

  return (
    <Dialog open={isOpen} onCloseClick={onCloseClick}>
      <Dialog.Title hasUnderline>Edit Company Details</Dialog.Title>
      <Dialog.Content>
        <Form onSubmit={handleSave}>
          <Form.Row>
            <TextField
              name="name"
              isRequired
              variant="outlined"
              label="Company Name"
              fullWidth
            />
          </Form.Row>
          <Form.ButtonWrapper>
            <Form.SubmitButton>Save & close</Form.SubmitButton>
          </Form.ButtonWrapper>
        </Form>
      </Dialog.Content>
      <Dialog.Actions confirmLabel={"Save & close"} />
    </Dialog>
  );
};

type Props = {
  company: CompanyType;
};

const CompanyDetailsCard = ({ company }: Props) => {
  const { t } = useTranslation("common");
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const { name, aboutUs, details } = getCompanyData(company);

  const companyMemberIds = company.companyMembers.nodes.map(({ id }) => id);

  return (
    <CompanyDetails name={name} details={details}>
      {aboutUs || ""}
      <AccessControl
        dataModel="company"
        action="edit"
        extraData={{ companyMemberIds }}
      >
        <Button
          variant="text"
          color="primary"
          onClick={() => setEditDialogOpen(true)}
          startIcon={<EditIcon />}
        >
          {t("Edit")}
        </Button>
      </AccessControl>
      <EditDialog
        company={company}
        isOpen={isEditDialogOpen}
        onCloseClick={() => setEditDialogOpen(false)}
      />
    </CompanyDetails>
  );
};

export default CompanyDetailsCard;
