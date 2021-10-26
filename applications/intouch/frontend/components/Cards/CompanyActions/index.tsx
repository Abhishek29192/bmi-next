import Button from "@bmi/button";
import { CompanyStatus } from "@bmi/intouch-api-types";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import React, { useCallback, useState } from "react";
import { useUpdateCompanyDetailsMutation } from "../../../graphql/generated/hooks";
import { GetCompanyQuery } from "../../../graphql/generated/operations";
import log from "../../../lib/logger";
import { SimpleCard } from "../SimpleCard";

export type CompanyActionsCardProps = {
  title: string;
  company: GetCompanyQuery["company"];
};

export const CompanyActionsCard = ({
  title,
  company
}: CompanyActionsCardProps) => {
  const { id } = company;
  const { t } = useTranslation("company-page");
  const [status, setStatus] = useState<CompanyStatus>(company.status);
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const [updateCompany] = useUpdateCompanyDetailsMutation({
    onError: (error) => {
      log({
        severity: "ERROR",
        message: `There was an error updating the company: ${error.toString()}`
      });
      setIsLoading(false);
      // TODO: show some visual error
    },
    onCompleted: ({ updateCompany: { company } }) => {
      log({
        severity: "INFO",
        message: `Updated company - id: ${company.id}`
      });
      setIsLoading(false);
      setStatus(company.status);
    }
  });

  const toggleCompanyActivation = useCallback(() => {
    setIsLoading(true);
    const updatedStatus: CompanyStatus =
      status === "ACTIVE" ? "DEACTIVATED" : "ACTIVE";

    updateCompany({
      variables: {
        input: {
          id,
          patch: {
            status: updatedStatus
          }
        }
      }
    });
  }, [company, updateCompany]);

  return (
    <SimpleCard>
      <Typography
        variant="h4"
        style={{ marginBottom: "1.5rem", fontSize: "1.2rem" }}
      >
        {title}
      </Typography>
      <div style={{ textAlign: "right" }}>
        <Button onClick={toggleCompanyActivation} disabled={isLoading}>
          {status === "ACTIVE"
            ? t("companyActions.deactivate")
            : t("companyActions.activate")}
        </Button>
      </div>
    </SimpleCard>
  );
};
