import Button from "@bmi-digital/components/button";
import IconButton from "@bmi-digital/components/icon-button";
import ArrowForwardIcon from "@bmi-digital/components/icon/ArrowForward";
import Close from "@bmi-digital/components/icon/Close";
import DeleteIcon from "@bmi-digital/components/icon/Delete";
import Typography from "@bmi-digital/components/typography";
import { replaceSpaces } from "@bmi-digital/components/utils";
import { microCopy } from "@bmi/microcopies";
import NextLink from "next/link";
import React from "react";
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
  basketUrl,
  maximumSamples,
  toggleCart
}: {
  title?: string | null;
  basketUrl?: string;
  maximumSamples: number | null;
  toggleCart?: () => void;
}) => {
  const {
    basketState: { products: productsInBasket },
    basketDispatch
  } = useBasketContext();

  const { getMicroCopy } = useSiteContext();

  const removeFromBasket = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    payload: Sample
  ) => {
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
          onClick={toggleCart}
          data-testid={"shopping-cart-dialog-close-button"}
        >
          <Close />
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
              <IconButton
                accessibilityLabel={getMicroCopy(
                  microCopy.PDP_OVERVIEW_REMOVE_SAMPLE
                )}
                variant="text"
                onClick={(event) => removeFromBasket(event, product)}
                data-testid={`shopping-cart-dialog-remove-product-${replaceSpaces(
                  product.name
                )}`}
              >
                <DeleteIcon />
              </IconButton>
            </ProductButtonContainer>
          </Product>
        ))}
      </ProductList>
      <CartActions data-testid={"shopping-cart-dialog-actions"}>
        <Button
          component={NextLink}
          href={basketUrl}
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
