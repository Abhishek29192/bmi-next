import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@bmi/button";
import { GetCompanyQuery } from "../../../../../graphql/generated/operations";
import AccessControl from "../../../../../lib/permissions/AccessControl";
import { EditCompanyDialog } from "../Dialog";
import styles from "./styles.module.scss";

export const EditCompanyButton = ({
  company
}: {
  company: GetCompanyQuery["company"];
}) => {
  const [isEditDialogOpen, setEditDialogOpen] = useState(true);
  const { t } = useTranslation(["common", "company-page"]);

  return (
    <div className={styles.editButtonContainer}>
      <AccessControl
        dataModel="company"
        action="edit"
        extraData={{
          companyMemberIds: company.companyMembers.nodes.map(
            (m) => m.account.id
          )
        }}
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
      <EditCompanyDialog
        company={company}
        isOpen={isEditDialogOpen}
        onCloseClick={() => setEditDialogOpen(false)}
      />
    </div>
  );
};
