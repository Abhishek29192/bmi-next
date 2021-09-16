import capitalize from "lodash/capitalize";
import React from "react";
import { useTranslation } from "next-i18next";
import Grid from "@bmi/grid";
import Checkbox from "@bmi/checkbox";
import Typography from "@bmi/typography";
import { OPERATION_TYPES } from "../../lib/constants";
import AccessControl from "../../lib/permissions/AccessControl";
import { GetCompanyQuery } from "../../graphql/generated/operations";
import { InfoPair } from "../InfoPair";
import { formatCompanyOperations } from "../Pages/Company/RegisteredDetails";

type Props = {
  operations: GetCompanyQuery["company"]["companyOperationsByCompany"]["nodes"];
};

const ViewOperations = ({
  operations
}: {
  operations: Props["operations"];
}) => {
  const { t } = useTranslation("company-page");
  return (
    operations?.length > 0 && (
      <InfoPair title={t("edit_dialog.form.fields.operationTypes")}>
        {formatCompanyOperations(
          t,
          operations.map((node) => node.operation)
        )}
      </InfoPair>
    )
  );
};

export const SetCompanyOperations = ({ operations }: Props) => {
  const { t } = useTranslation("company-page");

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
        {Object.entries(OPERATION_TYPES).map(([, operationType], idx) => {
          const defaultValue = operations.some(
            (o) => o.operation === operationType
          );
          return (
            <Grid item xs={6} key={`${operationType}-${idx}`}>
              <Checkbox
                name={`operationTypes.${operationType}`}
                label={capitalize(t(`operationTypes.${operationType}`))}
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
