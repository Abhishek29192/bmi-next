import React from "react";
import classnames from "classnames";
import PureChip from "@bmi/chip";
import { ClickableAction, withClickable } from "@bmi/clickable";
import DefaultThumbnail from "@bmi/thumbnail";
import Typography from "@bmi/typography";
import styles from "./ProductOverviewPane.module.scss";

const Chip = withClickable((props) => {
  let MarkupComponent: React.ElementType | undefined = undefined;

  if (props.href) {
    MarkupComponent = "a";
  }

  if (props.to && props.component) {
    MarkupComponent = props.component;
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
  type?: "chips" | "thumbnails";
  variants: Variant[];
  component?: React.ComponentType<any>; // TODO
};

export type Props = {
  name: string;
  brandLogo?: SVGImport;
  nobb: string | null;
  nobbLabel: string;
  attributes?: Attribute[];
  children?: React.ReactNode;
  thumbnailComponent?: React.ComponentType<any>; // TODO
};

const renderThumbnailAttribute = (
  name: string,
  variants: Variant[],
  key: string,
  component?: React.ComponentType<any> // TODO
) => {
  const Thumbnail = component || DefaultThumbnail;
  const activeColor = variants.find(({ isSelected }) => isSelected);

  if (!activeColor) {
    /* istanbul ignore next */
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error(
        "ProductOverview.renderThumbnailAttributes: At least one colour should be selected"
      );
    }

    return null;
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

  if (!attribute.variants.length) {
    return null;
  }

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
    return renderThumbnailAttribute(
      name,
      attribute.variants,
      key,
      attribute.component
    );
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
  nobb,
  nobbLabel,
  brandLogo: BrandLogo,
  thumbnailComponent,
  attributes,
  children
}: Props) => {
  return (
    <div className={styles["ProductOverview"]}>
      {BrandLogo && <BrandLogo className={styles["brand-logo"]} />}
      <Typography className={styles["heading"]} variant="h3" component="h1">
        {name}
      </Typography>
      {nobb === null ? (
        <ul className={styles["attributes"]}>
          {[
            {
              name: nobbLabel,
              variants: []
            },
            ...(attributes?.map((attribute) =>
              attribute.type === "thumbnails"
                ? { ...attribute, component: thumbnailComponent }
                : attribute
            ) || [])
          ].map(renderAttribute)}
        </ul>
      ) : (
        <ul className={styles["attributes"]}>
          {[
            {
              name: nobbLabel,
              variants: [
                {
                  label: nobb
                }
              ]
            },
            ...(attributes?.map((attribute) =>
              attribute.type === "thumbnails"
                ? { ...attribute, component: thumbnailComponent }
                : attribute
            ) || [])
          ].map(renderAttribute)}
        </ul>
      )}
      {children}
    </div>
  );
};

export default ProductOverviewPane;
