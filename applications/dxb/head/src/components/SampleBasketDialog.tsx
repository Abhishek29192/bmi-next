import { Button, Icon, Typography } from "@bmi/components";
import {
  ArrowForward as ArrowForwardIcon,
  Close,
  Delete as DeleteIcon
} from "@material-ui/icons";
import classnames from "classnames";
import { ClickableAction } from "components/src/anchor-link";
import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { microCopy } from "../constants/microCopies";
import {
  ACTION_TYPES,
  Sample,
  useBasketContext
} from "../contexts/SampleBasketContext";
import { Data } from "./SampleBasketBase";
import { useSiteContext } from "./Site";
import styles from "./styles/SampleBasketDialog.module.scss";

const PureSampleBasketDialog = ({
  data,
  basketAction,
  maximumSamples,
  toggleCart
}: {
  data?: Data;
  basketAction?: ClickableAction;
  maximumSamples?: number;
  toggleCart?: () => void;
}) => {
  const {
    basketState: { products: productsInBasket },
    basketDispatch
  } = useBasketContext();

  const { getMicroCopy } = useSiteContext();

  const removeFromBasket = (event: Event, payload: Sample) => {
    event.stopPropagation();
    basketDispatch({
      type: ACTION_TYPES.BASKET_REMOVE,
      payload
    });
  };

  return productsInBasket.length > 0 ? (
    <div className={styles["cart-drawer"]}>
      <div
        className={classnames(styles["cart-drawer--pad"], styles["pad-b-24"])}
      >
        <Button
          accessibilityLabel={getMicroCopy(microCopy.DIALOG_CLOSE)}
          className={styles["close-button"]}
          isIconButton
          onClick={toggleCart}
        >
          <Icon source={Close} />
        </Button>
        <Typography variant="h3" hasUnderline>
          {data.title}
        </Typography>

        <div className={styles["cart-info"]}>
          <p>
            {productsInBasket.length < maximumSamples
              ? getMicroCopy(
                  microCopy.PDP_OVERVIEW_SAMPLE_DIALOG_MESSAGE
                ).replace(":N", `${maximumSamples}`)
              : getMicroCopy(
                  microCopy.PDP_OVERVIEW_SAMPLE_LIMIT_REACHED_MESSAGE
                )}
          </p>
          <p>
            {getMicroCopy(
              microCopy.PDP_OVERVIEW_SAMPLE_DELIVERY_DIALOG_MESSAGE
            )}
          </p>
        </div>
      </div>

      {/*Product List */}

      <div className={styles["product-list"]}>
        {productsInBasket.map((product) => (
          <div key={product.code} className={styles["row"]}>
            <div className={styles["image-container"]}>
              <img src={product.image} className={styles["cart-image"]} />
            </div>
            <div className={styles["info-container"]}>
              <Typography variant="h6" className={styles["product-title"]}>
                {product.name}
              </Typography>
              <Typography variant="h6" className={styles["product-color"]}>
                {product.colour}
              </Typography>
              <Typography className={styles["product-size"]}>
                {product.measurements}
              </Typography>
            </div>
            <div className={styles["button-container"]}>
              <Button
                accessibilityLabel={getMicroCopy(
                  microCopy.PDP_OVERVIEW_REMOVE_SAMPLE
                )}
                variant="text"
                isIconButton
                onClick={(event: Event) => removeFromBasket(event, product)}
              >
                <Icon source={DeleteIcon} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div
        className={classnames(
          styles["cart-actions"],
          styles["cart-drawer--pad"]
        )}
      >
        <Button action={basketAction} endIcon={<ArrowForwardIcon />}>
          {getMicroCopy(microCopy.PDP_OVERVIEW_COMPLETE_SAMPLE_ORDER)}
        </Button>
        <Button variant="outlined" onClick={() => toggleCart()}>
          {getMicroCopy(microCopy.PDP_OVERVIEW_CONTINUE_BROWSING)}
        </Button>
      </div>
    </div>
  ) : null;
};

export default function SampleBasketDialog(props: {
  maximumSamples?: number;
  basketAction?: ClickableAction;
  toggleCart?: () => void;
}) {
  const data = useStaticQuery(graphql`
    query {
      contentfulSampleBasketSection {
        title
        ...SampleBasketSectionFragment
      }
    }
  `);
  return (
    <PureSampleBasketDialog
      data={data.contentfulSampleBasketSection}
      {...props}
    />
  );
}
