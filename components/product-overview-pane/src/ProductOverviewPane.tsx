import React from "react";
import classnames from "classnames";
import PureChip from "@bmi/chip";
import { ClickableAction, withClickable } from "@bmi/clickable";
import Thumbnail from "@bmi/thumbnail";
import Button from "@bmi/button";
import Typography from "@bmi/typography";
import styles from "./ProductOverviewPane.module.scss";

const Chip = withClickable((props) => {
  let MarkupComponent: React.ElementType;

  if (props.href) {
    MarkupComponent = "a";
  }

  if (props.to && props.linkComponent) {
    MarkupComponent = props.linkComponent;
  }

  return <PureChip {...props} component={MarkupComponent} />;
});

type Variant = {
  /** Not a ReactNode to support alt text */
  label: string;
  isSelected?: boolean;
  action?: ClickableAction;
  thumbnail?: string;
};

type Attribute = {
  name: string;
} & (
  | {
      type?: "chips";
      variants: Omit<Variant, "thumbnail">[];
    }
  | {
      type: "thumbnails";
      variants: Variant[];
    }
);

export type Props = {
  name: React.ReactNode;
  brandLogo?: SVGImport;
  nnob: React.ReactNode;
  attributes?: Attribute[];
  printButtonLabel?: React.ReactNode;
};

const renderThumbnailAttribute = (
  name: string,
  variants: Variant[],
  key: string
) => {
  const activeColor = variants.find(({ isSelected }) => isSelected);

  /* istanbul ignore next */
  if (!activeColor && process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.error(
      "ProductOverview.renderThumbnailAttributes: At least one colour should be selected"
    );
  }

  return (
    <li key={key}>
      <span className={styles["term"]}>{name}</span>
      {activeColor && (
        <span className={styles["definition"]}>{activeColor.label}</span>
      )}
      <div className={styles["variants"]}>
        {variants.map(({ label, thumbnail, action }, index) => (
          <span className={styles["variant"]} key={`${key}-variant-${index}`}>
            <Thumbnail
              action={action}
              imageSource={thumbnail}
              altText={label}
              color="#ffffff"
              state={activeColor.label === label ? "selected" : "enabled"}
            />
          </span>
        ))}
      </div>
    </li>
  );
};

const renderAttribute = ({ name, ...attribute }: Attribute, index: number) => {
  const key = `attribute-${index}`;

  if (attribute.variants.length === 1) {
    return (
      <li key={key}>
        <span className={styles["term"]}>{name}</span>
        <span className={styles["definition"]}>
          {attribute.variants[0].label}
        </span>
      </li>
    );
  }

  if (attribute.type === "thumbnails") {
    return renderThumbnailAttribute(name, attribute.variants, key);
  }

  return (
    <li key={key}>
      <span className={styles["term"]}>{name}</span>
      <div
        className={classnames(styles["variants"], styles["variants--spaced"])}
      >
        {attribute.variants.map(({ label, action, isSelected }, index) => (
          <span className={styles["variant"]} key={`${key}-variant-${index}`}>
            <Chip
              type="selectable"
              isSelected={isSelected}
              action={action}
              disabled={!isSelected && !action}
            >
              {label}
            </Chip>
          </span>
        ))}
      </div>
    </li>
  );
};

const ProductOverviewPane = ({
  name,
  nnob,
  brandLogo: BrandLogo,
  attributes,
  printButtonLabel = "Send/print this page"
}: Props) => {
  return (
    <div className={styles["ProductOverview"]}>
      {BrandLogo && <BrandLogo className={styles["brand-logo"]} />}
      <Typography className={styles["heading"]} variant="h3" component="h1">
        {name}
      </Typography>
      <ul className={styles["attributes"]}>
        {[
          {
            name: "NNOB",
            variants: [
              {
                label: nnob
              }
            ]
          },
          ...attributes
        ].map(renderAttribute)}
      </ul>
      <Button className={styles["print-button"]}>{printButtonLabel}</Button>
    </div>
  );
};

export default ProductOverviewPane;
