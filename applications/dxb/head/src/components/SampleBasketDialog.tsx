import {
  Button,
  ClickableAction,
  Icon,
  Typography
} from "@bmi-digital/components";
import {
  ArrowForward as ArrowForwardIcon,
  Close,
  Delete as DeleteIcon
} from "@material-ui/icons";
import classnames from "classnames";
import React from "react";
import { microCopy } from "../constants/microCopies";
import {
  ACTION_TYPES,
  Sample,
  useBasketContext
} from "../contexts/SampleBasketContext";
import { useSiteContext } from "./Site";
import { useStyles } from "./styles/SampleBasketDialogStyles";

const SampleBasketDialog = ({
  title,
  basketAction,
  maximumSamples,
  toggleCart
}: {
  title?: string;
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

  const classes = useStyles();

  return title && productsInBasket.length > 0 ? (
    <div className={classnames(classes.cartDrawer, "cart-drawer")}>
      <div className={classnames("pad", "pad-b-24")}>
        <Button
          accessibilityLabel={getMicroCopy(microCopy.DIALOG_CLOSE)}
          className={classes.closeButton}
          isIconButton
          onClick={toggleCart}
        >
          <Icon source={Close} />
        </Button>
        <Typography variant="h3" hasUnderline>
          {title}
        </Typography>

        <div className={classnames(classes.cartInfo, "cart-info")}>
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

      <div className={classes.productList}>
        {productsInBasket.map((product) => (
          <div key={product.code} className={classnames(classes.row, "row")}>
            <div className={classes.imageContainer}>
              <img src={product.image} className={classes.cartImage} />
            </div>
            <div className={classes.infoContainer}>
              <Typography variant="h6" className="product-title">
                {product.name}
              </Typography>
              <Typography variant="h6" className="product-color">
                {product.colour}
              </Typography>
              <Typography className="product-size">
                {product.measurements}
              </Typography>
            </div>
            <div className={classes.buttonContainer}>
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
      <div className={classnames(classes.cartActions, "pad")}>
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

export default SampleBasketDialog;
