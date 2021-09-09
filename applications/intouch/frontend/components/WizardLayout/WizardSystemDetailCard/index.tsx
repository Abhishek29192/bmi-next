import React from "react";
import { useTranslation } from "next-i18next";
import Typography from "@bmi/typography";
import Card, { CardContent, CardHeader } from "@bmi/card";
import Table from "@bmi/table";
import Icon from "@bmi/icon";
import { Delete } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import { Product } from "@bmi/intouch-api-types";
import styles from "./styles.module.scss";

export type WizardSystemDetailCardProp = {
  name: string;
  description: string;
  products: Product[];
  onDeleteClick?: () => void;
};

export const WizardSystemDetailCard = ({
  name,
  description,
  products,
  onDeleteClick
}: WizardSystemDetailCardProp) => {
  const { t } = useTranslation("common");

  return (
    <Card className={styles.main}>
      <CardHeader
        action={
          onDeleteClick && (
            <IconButton onClick={onDeleteClick} data-testid="system-delete">
              <Icon source={Delete} color="primary" />
            </IconButton>
          )
        }
        title={name}
      />
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary">
          {description}
        </Typography>
        <div className={styles.footer}>
          {products.length > 0 && (
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Cell>{t("Products")}</Table.Cell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {products.map(({ id, name, family, brand }) => (
                  <Table.Row
                    key={`product-${id}`}
                    data-testid="system-product-item"
                  >
                    <Table.Cell>{`${name} - ${family} - ${brand}`}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
