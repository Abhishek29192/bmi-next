import useDimensions, { DimensionObject } from "@bmi-digital/use-dimensions";
import {
  Pagination as MuiPagination,
  PaginationItem,
  PaginationProps
} from "@material-ui/lab";
import classnames from "classnames";
import React, { useEffect, useState } from "react";
import Button from "../button/Button";
import Icon from "../icon";
import { useStyles } from "./styles";
import DoubleLeftArrow from "./svgs/arrow-left-double.svg";
import DoubleRightArrow from "./svgs/arrow-right-double.svg";
import Ellipsis from "./svgs/ellipsis.svg";

const MAX_ITEM_COUNT = 11;

const Pagination = (props: { page: number } & PaginationProps) => {
  const classes = useStyles();
  const [maxAvailablePageSpaces, setMaxAvailablePageSpaces] =
    useState(MAX_ITEM_COUNT);

  const [ref, dimensions] = useDimensions();

  useEffect(() => {
    if (!("width" in dimensions)) {
      return;
    }

    setMaxAvailablePageSpaces(
      Math.min(
        Math.floor((dimensions as DimensionObject).width! / 48),
        MAX_ITEM_COUNT
      )
    );
  }, [dimensions]);

  const isReducedMode = maxAvailablePageSpaces < MAX_ITEM_COUNT;
  const hideAllPages = maxAvailablePageSpaces <= 2;

  const showFirstLastButton =
    maxAvailablePageSpaces > 4 &&
    !!props.count &&
    props.count > maxAvailablePageSpaces - 2;

  let siblingCount = 1;
  if (props.count && maxAvailablePageSpaces - 2 >= props.count) {
    siblingCount = props.count;
  } else if (isReducedMode) {
    const availablePageItemCount = showFirstLastButton
      ? maxAvailablePageSpaces - 4
      : maxAvailablePageSpaces - 2;
    siblingCount = Math.floor((availablePageItemCount - 1) / 2);
  }

  return (
    <MuiPagination
      ref={ref}
      color="primary"
      renderItem={(item) => {
        if (item.type === "page") {
          if (hideAllPages) {
            return null;
          }

          // NOTE: extra logic to control sibling counts since material UI has a bug around boundary and failed to control sibling count equals supplied `siblingCount`
          if (
            isReducedMode &&
            !(
              props.page -
                siblingCount -
                Math.max(siblingCount - ((props.count || 0) - props.page), 0) <=
                item.page &&
              item.page <=
                props.page +
                  siblingCount +
                  Math.max(siblingCount - props.page + 1, 0)
            )
          ) {
            return null;
          }
        }

        if (item.type === "start-ellipsis" || item.type === "end-ellipsis") {
          if (isReducedMode) {
            return null;
          }

          return (
            <div
              className={classnames(
                classes.root,
                "MuiPaginationItem-root",
                "MuiPaginationItem-ellipsis",
                {
                  "Mui-disabled": item.disabled
                }
              )}
            >
              <Icon source={Ellipsis} style={{ fontSize: 16 }} />
            </div>
          );
        }

        if (item.type === "first" || item.type === "last") {
          return (
            <Button
              isIconButton
              className={classnames(
                classes.root,
                classes[item.type],
                "MuiPaginationItem-root",
                "MuiPaginationItem-page",
                {
                  "Mui-disabled": item.disabled
                }
              )}
              {...item}
            >
              <Icon
                source={
                  { first: DoubleLeftArrow, last: DoubleRightArrow }[item.type]
                }
                style={{ fontSize: 16 }}
              />
            </Button>
          );
        }

        return (
          <PaginationItem
            className={classnames(
              classes.root,
              "MuiPaginationItem-root",
              "MuiPaginationItem-textPrimary"
            )}
            {...item}
          />
        );
      }}
      // NOTE: material UI has a bug and unfortunately setting boundaryCount = 0 will not behave as expected
      boundaryCount={1}
      showFirstButton={showFirstLastButton}
      showLastButton={showFirstLastButton}
      siblingCount={siblingCount}
      {...props}
    />
  );
};

export default Pagination;
