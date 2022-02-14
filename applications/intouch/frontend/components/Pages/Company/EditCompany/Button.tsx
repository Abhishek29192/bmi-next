import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@bmi-digital/components/button";
import { GetCompanyQuery } from "../../../../graphql/generated/operations";
import AccessControl from "../../../../lib/permissions/AccessControl";
import { EditCompanyDialog, OnCompanyUpdateSuccess } from "./Dialog";
import styles from "./styles.module.scss";

type EditCompanyButtonProps = {
  company: GetCompanyQuery["company"];
  onCompanyUpdateSuccess?: OnCompanyUpdateSuccess;
  mapsApiKey: string;
};

export const EditCompanyButton = ({
  onCompanyUpdateSuccess,
  mapsApiKey,
  company
}: EditCompanyButtonProps) => {
  const { t } = useTranslation(["common", "company-page"]);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <div className={styles.editButtonContainer}>
      <AccessControl
        dataModel="company"
        action="edit"
        extraData={{ companyId: company.id }}
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
        onCompanyUpdateSuccess={onCompanyUpdateSuccess}
        mapsApiKey={mapsApiKey}
      />
    </div>
  );
};
