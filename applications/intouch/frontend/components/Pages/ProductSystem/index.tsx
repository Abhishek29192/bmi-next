import React from "react";
import { useTranslation } from "next-i18next";
import Tabs from "@bmi/tabs";
import { ProductsAndSystemsQuery } from "../../../graphql/generated/operations";
import ImportTab from "./ImportTab";
import ListTab from "./ListTab";
import styles from "./styles.module.scss";

type ProductsAndSystemProps = {
  products: ProductsAndSystemsQuery["products"];
  systems: ProductsAndSystemsQuery["systems"];
};

const ProductsAndSystems = ({ products, systems }: ProductsAndSystemProps) => {
  const { t } = useTranslation("admin-products-systems");

  return (
    <Tabs initialValue="one">
      <Tabs.TabPanel
        className={styles.tab}
        heading={t("bulkImport")}
        index="one"
      >
        <ImportTab />
      </Tabs.TabPanel>
      <Tabs.TabPanel heading={t("products")} index="two">
        <ListTab type="product" items={products} />
      </Tabs.TabPanel>
      <Tabs.TabPanel heading={t("system")} index="three">
        <ListTab type="system" items={systems} />
      </Tabs.TabPanel>
    </Tabs>
  );
};

export default ProductsAndSystems;
