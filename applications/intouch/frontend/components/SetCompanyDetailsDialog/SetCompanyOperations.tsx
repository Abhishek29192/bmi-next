import React from "react";
import { useTranslation } from "next-i18next";
import { Grid } from "@bmi/components";
import { Checkbox } from "@bmi/components";
import { Typography } from "@bmi/components";
import AccessControl from "../../lib/permissions/AccessControl";
import { GetCompanyQuery } from "../../graphql/generated/operations";
import { InfoPair } from "../InfoPair";
import { formatCompanyOperations } from "../Pages/Company/RegisteredDetails";
import { useCompanyPageContext } from "../../context/CompanyPageContext";

type Props = {
  operations: GetCompanyQuery["company"]["companyOperationsByCompany"]["nodes"];
};

const ViewOperations = ({
  operations
}: {
  operations: Props["operations"];
}) => {
  const { t } = useTranslation("company-page");
  const { operationTypes } = useCompanyPageContext();
  return (
    operations?.length > 0 && (
      <InfoPair title={t("edit_dialog.form.fields.operationTypes")}>
        {formatCompanyOperations(
          t,
          operations.map((node) => node.operation),
          operationTypes
        )}
      </InfoPair>
    )
  );
};

export const SetCompanyOperations = ({ operations }: Props) => {
  const { t } = useTranslation("company-page");
  const { operationTypes } = useCompanyPageContext();
  return (
    <AccessControl
      action="editOperations"
      dataModel="company"
      fallbackView={<ViewOperations operations={operations} />}
    >
      <Typography variant="h6" style={{ marginBottom: "1rem" }}>
        {t("edit_dialog.form.fields.operationTypes")}
      </Typography>

      <Grid container xs={12} spacing={0} style={{ marginBottom: "1.5rem" }}>
        {operationTypes.map(({ type, displayName }, idx) => {
          const defaultValue = operations.some((o) => o.operation === type);
          return (
            <Grid item xs={6} key={`${type}-${idx}`}>
              <Checkbox
                name={`operationTypes.${type}`}
                label={displayName}
                defaultValue={defaultValue}
                defaultChecked={defaultValue}
              />
            </Grid>
          );
        })}
      </Grid>
    </AccessControl>
  );
};
