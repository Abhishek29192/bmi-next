import {
  Button,
  ClickableAction,
  Icon,
  replaceSpaces,
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
  title?: string | null;
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

  return (
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
          <Product
            key={product.code}
            data-testid={"shopping-cart-dialog-product"}
          >
            <ImageContainer>
              <CartImage src={product.image} />
            </ImageContainer>
            <InfoContainer>
              <ProductTitle
                variant="h6"
                data-testid={`shopping-cart-dialog-product-title-${replaceSpaces(
                  product.name
                )}`}
              >
                {product.name}
              </ProductTitle>
              <ProductColour
                variant="h6"
                data-testid={`shopping-cart-dialog-product-colour-${replaceSpaces(
                  product.colour
                )}`}
              >
                {product.colour}
              </ProductColour>
              <ProductSize
                data-testid={`shopping-cart-dialog-product-size-${replaceSpaces(
                  product.measurements
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
                data-testid={`shopping-cart-dialog-remove-product-${replaceSpaces(
                  product.name
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
  );
};

export default SampleBasketDialog;
