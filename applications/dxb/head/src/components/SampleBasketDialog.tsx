import {
  Button,
  ClickableAction,
  Icon,
  Typography
} from "@bmi-digital/components";
import { ArrowForward as ArrowForwardIcon } from "@bmi-digital/components/icon";
import { Close, Delete as DeleteIcon } from "@mui/icons-material";
import React from "react";
import { microCopy } from "../constants/microCopies";
import {
  ACTION_TYPES,
  Sample,
  useBasketContext
} from "../contexts/SampleBasketContext";
import { useSiteContext } from "./Site";
import {
  CartActions,
  CartImage,
  CartInfo,
  CloseButton,
  ImageContainer,
  InfoContainer,
  Product,
  ProductButtonContainer,
  ProductColour,
  ProductList,
  ProductSize,
  ProductTitle,
  StyledBasketDialogContainer,
  TopContainer
} from "./styles/SampleBasketDialogStyles";

const SampleBasketDialog = ({
  title,
  basketAction,
  maximumSamples,
  toggleCart
}: {
  title?: string;
  basketAction?: ClickableAction;
  maximumSamples: number | null;
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

  return title && productsInBasket.length > 0 ? (
    <StyledBasketDialogContainer data-testid={"shopping-cart-dialog"}>
      <TopContainer data-testid={"shopping-cart-dialog-header-container"}>
        <CloseButton
          accessibilityLabel={getMicroCopy(microCopy.DIALOG_CLOSE)}
          isIconButton
          onClick={toggleCart}
          data-testid={"shopping-cart-dialog-close-button"}
        >
          <Icon source={Close} />
        </CloseButton>
        <Typography
          variant="h3"
          hasUnderline
          data-testid={"shopping-cart-dialog-title"}
        >
          {title}
        </Typography>

        <CartInfo data-testid={"shopping-cart-dialog-info"}>
          <p>
            {productsInBasket.length < (maximumSamples || 0)
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
        </CartInfo>
      </TopContainer>

      {/*Product List */}

      <ProductList data-testid={"shopping-cart-dialog-product-list"}>
        {productsInBasket.map((product) => (
          <Product key={product.code}>
            <ImageContainer>
              <CartImage src={product.image} />
            </ImageContainer>
            <InfoContainer>
              <ProductTitle
                variant="h6"
                data-testid={`shopping-cart-dialog-product-title-${product.name.replace(
                  / /g,
                  "-"
                )}`}
              >
                {product.name}
              </ProductTitle>
              <ProductColour
                variant="h6"
                data-testid={`shopping-cart-dialog-product-colour-${product.colour?.replace(
                  / /g,
                  "-"
                )}`}
              >
                {product.colour}
              </ProductColour>
              <ProductSize
                data-testid={`shopping-cart-dialog-product-size-${product.measurements?.replace(
                  / /g,
                  "-"
                )}`}
              >
                {product.measurements}
              </ProductSize>
            </InfoContainer>
            <ProductButtonContainer>
              <Button
                accessibilityLabel={getMicroCopy(
                  microCopy.PDP_OVERVIEW_REMOVE_SAMPLE
                )}
                variant="text"
                isIconButton
                onClick={(event: Event) => removeFromBasket(event, product)}
                data-testid={`shopping-cart-dialog-remove-product-${product.name.replace(
                  / /g,
                  "-"
                )}`}
              >
                <Icon source={DeleteIcon} />
              </Button>
            </ProductButtonContainer>
          </Product>
        ))}
      </ProductList>
      <CartActions data-testid={"shopping-cart-dialog-actions"}>
        <Button
          action={basketAction}
          endIcon={<ArrowForwardIcon />}
          data-testid={"shopping-cart-dialog-complete-order-button"}
        >
          {getMicroCopy(microCopy.PDP_OVERVIEW_COMPLETE_SAMPLE_ORDER)}
        </Button>
        {toggleCart && (
          <Button
            variant="outlined"
            onClick={() => toggleCart()}
            data-testid={"shopping-cart-dialog-continue-browsing-button"}
          >
            {getMicroCopy(microCopy.PDP_OVERVIEW_CONTINUE_BROWSING)}
          </Button>
        )}
      </CartActions>
    </StyledBasketDialogContainer>
  ) : null;
};

export default SampleBasketDialog;
