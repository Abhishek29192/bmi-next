import React from "react";
import classnames from "classnames";
import { PureChip } from "@bmi-digital/components";
import {
  ClickableAction,
  withClickable
} from "@bmi-digital/components/clickable";
import { SVGImport } from "@bmi-digital/svg-import";
import { DefaultThumbnail } from "@bmi-digital/components";
import { Typography } from "@bmi-digital/components";
import { ToolTip } from "@bmi-digital/components";
import styles from "./ProductOverviewPane.module.scss";

const Chip = withClickable((props) => <PureChip {...props} />);

type Variant = {
  /** Not a ReactNode to support alt text */
  label: string;
  availability?: boolean;
  isSelected?: boolean;
  action?: ClickableAction;
  thumbnail?: string;
};

type Attribute = {
  name: string;
  type?: "chips" | "thumbnails";
  variants: Variant[];
  unavailableMicroCopy?: string;
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
  component?: React.ComponentType<any>, // TODO
  unavailableMicroCopy?: string
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
        {variants.map(
          ({ label, isSelected, thumbnail, action, availability }, index) => (
            <div className={styles["variant"]} key={`${key}-variant-${index}`}>
              <ToolTip
                title={<div>{unavailableMicroCopy}</div>}
                placement="top"
                {...(isSelected ||
                availability ||
                !action ||
                !unavailableMicroCopy
                  ? { open: false }
                  : {})}
              >
                <div
                  className={classnames(
                    !isSelected &&
                      !availability &&
                      action &&
                      styles["unavailable-thumbnail"]
                  )}
                >
                  <Thumbnail
                    action={action}
                    imageSource={thumbnail}
                    altText={label}
                    color="#ffffff"
                    state={isSelected ? "selected" : "enabled"}
                  />
                </div>
              </ToolTip>
            </div>
          )
        )}
      </div>
    </li>
  );
};

const renderAttribute = (
  { name, unavailableMicroCopy, ...attribute }: Attribute,
  index: number
) => {
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
      attribute.component,
      unavailableMicroCopy
    );
  }

  return (
    <li key={key}>
      <span className={styles["term"]}>{name}</span>
      <div
        className={classnames(styles["variants"], styles["variants--spaced"])}
      >
        {attribute.variants.map(
          ({ label, action, isSelected, availability }, index) => {
            return (
              <div
                className={classnames(
                  styles["variant"],
                  !isSelected &&
                    !availability &&
                    action &&
                    styles["unavailable-chip"]
                )}
                key={`${key}-variant-${index}`}
              >
                <ToolTip
                  title={<div>{unavailableMicroCopy}</div>}
                  placement="top"
                  {...(isSelected ||
                  availability ||
                  !action ||
                  !unavailableMicroCopy
                    ? { open: false }
                    : {})}
                >
                  <div>
                    <Chip
                      type="selectable"
                      isSelected={isSelected}
                      action={action}
                      disabled={!isSelected && !action}
                    >
                      {label}
                    </Chip>
                  </div>
                </ToolTip>
              </div>
            );
          }
        )}
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
      <ul className={styles["attributes"]}>
        {[
          {
            name: nobbLabel,
            variants:
              nobb === null
                ? []
                : [
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
      {children}
    </div>
  );
};

export default ProductOverviewPane;
