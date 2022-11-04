import React from "react";
import { GetProjectQuery } from "../../../../graphql/generated/operations";
import styles from "./styles.module.scss";
import ProductGuaranteeCard from "./ProductGuaranteeCard";

type ProductGuaranteesProps = {
  guarantees: GetProjectQuery["project"]["guarantees"]["nodes"];
};

export const ProductGuarantee = ({ guarantees }: ProductGuaranteesProps) => {
  return (
    <div className={styles.body}>
      {guarantees.map((guarantee) => (
        <ProductGuaranteeCard
          key={guarantee.id}
          product={guarantee.productByProductBmiRef}
          guaranteeFileUrl={guarantee.signedFileStorageUrl}
          guaranteeStatus={guarantee.status}
        />
      ))}
    </div>
  );
};
