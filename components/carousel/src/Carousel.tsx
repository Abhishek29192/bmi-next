import React, {
  useState,
  useMemo,
  useEffect,
  useContext,
  createContext,
  Dispatch,
  SetStateAction,
  isValidElement,
  useRef
} from "react";
import SwipeableViews from "react-swipeable-views";
import { virtualize, autoPlay } from "react-swipeable-views-utils";
import { mod } from "react-swipeable-views-core";
import classnames from "classnames";
import SlideControls, {
  Props as SlideControlsProps
} from "@bmi/slide-controls";
import ArrowControl from "@bmi/arrow-control";
import { withWidth, WithWidth } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import styles from "./Carousel.module.scss";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
const InfiniteSwipeableViewsComponent = virtualize(autoPlay(SwipeableViews));

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";
const BREAKPOINTS: Breakpoint[] = ["xs", "sm", "md", "lg", "xl"];

type Props = {
  children: React.ReactNode;
  slidesPerPage?:
    | number
    | (Partial<Record<Breakpoint, number>> & Record<"xs", number>);
  initialPage?: number;
  isSwipeDisabled?: boolean;
  onPageChange?: (activePage: number) => void;
  hasOpacityAnimation?: boolean;
  scroll?: "infinite" | "finite";
  hasGutter?: boolean;
  disableAnimateHeight?: boolean;
} & WithWidth &
  (
    | {
        hasAutoPlay?: false;
      }
    | {
        hasAutoPlay: true;
        /** Only available for hasAutoPlay=true */
        autoPlayInterval?: number;
        /** Only available for hasAutoPlay=true */
        pauseAutoPlayOnHover?: boolean;
      }
  );

type SlideProps = {
  children: React.ReactNode;
  className?: string;
};

type Context = {
  activePage: number;
  total: number;
  setActivePage?: Dispatch<SetStateAction<number>>;
  scroll?: Props["scroll"];
  slidesPerPage?: number;
  totalSlides: number;
  currentBreakpoint: Breakpoint;
};

type DotAnnotationComponents = {
  Slide: typeof CarouselSlide;
  Controls: typeof CarouselControls;
};

type ArrayChildren = Array<
  Exclude<React.ReactNode, boolean | null | undefined>
>;

const CarouselContext = createContext<Context>({
  activePage: 0,
  total: 0,
  totalSlides: 0,
  currentBreakpoint: "lg"
});

const mapRange = (
  input: number,
  inputStart: number,
  inputEnd: number,
  outputStart: number,
  outputEnd: number
): number => {
  return (
    outputStart +
    ((outputEnd - outputStart) / (inputEnd - inputStart)) * (input - inputStart)
  );
};

const usePrevious = (value: number) => {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

const handleSwiping = (
  wrapperElement: HTMLElement,
  index: number,
  type: "move" | "end",
  minimumOpacity: number = 0
) => {
  const activeSlide: HTMLElement | null = wrapperElement.querySelector(
    ".Carousel__slide--global[aria-hidden='false']"
  );

  if (!activeSlide) {
    return;
  }

  const nextSlide =
    index >= 3
      ? activeSlide.nextElementSibling
      : activeSlide.previousElementSibling;

  if (type === "end") {
    Array.from(
      wrapperElement.querySelectorAll<HTMLElement>(".Carousel__slide--global")
    ).forEach((slideElement: HTMLElement) => {
      slideElement.style.removeProperty("opacity");
      slideElement.style.removeProperty("transition-duration");
    });

    return;
  }

  const toFixed = (number: number) => Math.round(Math.abs(number) * 1e2) / 1e2;
  const currentSwipe = toFixed(index - 3);

  activeSlide.style.opacity = "" + toFixed(1 - currentSwipe);
  activeSlide.style.transitionDuration = "0s";

  if (nextSlide) {
    // @ts-ignore It's a HTMLElement
    nextSlide.style.opacity = "" + Math.max(minimumOpacity, currentSwipe);
    // @ts-ignore It's a HTMLElement
    nextSlide.style.transitionDuration = "0s";
  }
};

const calculateSlidesPerPage = (
  currentBreakpoint: Breakpoint,
  slidesPerPage: Props["slidesPerPage"]
): number => {
  if (!slidesPerPage) {
    return 0;
  }

  if (typeof slidesPerPage === "number") {
    return slidesPerPage;
  }

  return (
    BREAKPOINTS.reduceRight((found, breakpoint, index) => {
      if (found) {
        return found;
      }

      if (index <= BREAKPOINTS.findIndex((brk) => brk === currentBreakpoint)) {
        return slidesPerPage[breakpoint] || 0;
      }

      return 0;
    }, 0) || 1
  );
};

export const getPageFromAbsoluteIndex = (
  index: number,
  total: number
): number => {
  if (index < 0) {
    return ((-(total - 1) * index) % total) + 1;
  }

  return (index % total) + 1;
};

const CarouselSlide = ({ children, className }: SlideProps) => {
  const { slidesPerPage, totalSlides, currentBreakpoint } =
    useContext(CarouselContext);

  const breakpointToSlidesMap = {
    xl: 3,
    lg: 3,
    md: 2,
    sm: 1,
    xs: 1
  };

  return (
    <div
      className={classnames(styles["slide"], className)}
      style={{
        width: `${
          100 /
          (slidesPerPage
            ? totalSlides < slidesPerPage
              ? breakpointToSlidesMap[currentBreakpoint]
              : slidesPerPage
            : 1)
        }%`
      }}
    >
      {children}
    </div>
  );
};

const CarouselControls = ({
  type = "slide",
  ...rest
}: {
  type?: "arrows" | "slide";
} & Omit<
  SlideControlsProps,
  "current" | "total" | "onNextClick" | "onPrevClick"
>) => {
  const {
    activePage,
    setActivePage,
    total,
    scroll = "infinite"
  } = useContext(CarouselContext);

  if (type === "slide") {
    // TODO: Handle finite scroll.
    return (
      <SlideControls
        current={getPageFromAbsoluteIndex(activePage, total)}
        total={total}
        onNextClick={() => setActivePage && setActivePage(activePage + 1)}
        onPrevClick={() => setActivePage && setActivePage(activePage - 1)}
        {...rest}
      />
    );
  }

  if (
    typeof document !== "undefined" &&
    "ontouchstart" in document.documentElement
  ) {
    return null;
  }

  return (
    <>
      {(activePage > 0 || scroll === "infinite") && (
        <ArrowControl
          direction="left"
          onClick={() => setActivePage && setActivePage(activePage - 1)}
        />
      )}
      {(activePage < total - 1 || scroll === "infinite") && (
        <ArrowControl
          direction="right"
          onClick={() => setActivePage && setActivePage(activePage + 1)}
        />
      )}
    </>
  );
};

const checkArrowControls = (arrayChildren: ArrayChildren) =>
  !!arrayChildren.find(
    (child) =>
      isValidElement(child) &&
      child?.type === CarouselControls &&
      child.props.type === "arrows"
  );

const mapPagesToSlides = (pageSlides: ArrayChildren) =>
  pageSlides.map((pageSlide, key) => {
    return (
      <div className={styles["page"]} key={key}>
        {pageSlide}
      </div>
    );
  });

const Carousel = ({
  children,
  slidesPerPage = 1,
  initialPage = 0,
  isSwipeDisabled,
  onPageChange,
  hasOpacityAnimation,
  width: currentBreakpoint,
  scroll = "infinite",
  hasGutter,
  disableAnimateHeight = false,
  ...autoPlayProps
}: Props) => {
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<number>(initialPage);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const wrapper = useRef<HTMLDivElement>(null);
  const arrayChildren = React.Children.toArray(children);
  const isArrowCarousel = checkArrowControls(arrayChildren);

  const CarouselComponent =
    scroll === "finite"
      ? AutoPlaySwipeableViews
      : InfiniteSwipeableViewsComponent;

  let firstSlideIndex: number = 0;
  let lastSlideIndex: number = 0;

  const slides = useMemo(
    () =>
      arrayChildren.filter((child, index) => {
        const isSlide = isValidElement(child) && child?.type === CarouselSlide;

        if (isSlide) {
          firstSlideIndex =
            firstSlideIndex !== undefined ? firstSlideIndex : index;
          lastSlideIndex = Math.max(lastSlideIndex, index);
        }

        return isSlide;
      }),
    [arrayChildren]
  );
  const finalSlidesPerPage = useMemo(
    () => calculateSlidesPerPage(currentBreakpoint, slidesPerPage),
    [currentBreakpoint, slidesPerPage]
  );

  const totalPages = Math.ceil(slides.length / finalSlidesPerPage);
  const previousTotalPages = usePrevious(totalPages);

  const pageSlides = Array.from(new Array(totalPages)).map((_, pageNumber) => {
    return slides.slice(
      pageNumber * finalSlidesPerPage,
      pageNumber * finalSlidesPerPage + finalSlidesPerPage
    );
  });

  hasOpacityAnimation = hasOpacityAnimation || isArrowCarousel;

  const handleStepChange = (page: number) => {
    setActivePage(page);

    if (onPageChange) {
      onPageChange(page);
    }
  };

  const slideRenderer = ({ index, key }: { index: number; key: any }) => {
    return (
      <div className={styles["page"]} key={key}>
        {pageSlides[mod(index, totalPages)]}
      </div>
    );
  };

  const extraProps =
    scroll === "finite"
      ? {
          children: mapPagesToSlides(pageSlides)
        }
      : { slideRenderer };

  useEffect(() => {
    if (previousTotalPages !== totalPages) {
      // NOTE: Navigates to the active page when the slides per page settings change.
      handleStepChange(
        Math.floor(mapRange(activePage, 0, previousTotalPages, 0, totalPages))
      );
    }
  }, [finalSlidesPerPage, pageSlides]);

  useEffect(() => {
    if (initialPage !== activePage) {
      setActivePage(initialPage);
    }
  }, [initialPage]);

  return (
    <CarouselContext.Provider
      value={{
        activePage,
        setActivePage,
        total: totalPages,
        scroll,
        slidesPerPage: finalSlidesPerPage,
        totalSlides: slides.length,
        currentBreakpoint
      }}
    >
      <div
        onMouseOver={() => {
          if (
            autoPlayProps.hasAutoPlay &&
            autoPlayProps.pauseAutoPlayOnHover &&
            !hasUserInteracted
          ) {
            setHasUserInteracted(true);
          }
        }}
        onMouseOut={() => {
          if (
            autoPlayProps.hasAutoPlay &&
            autoPlayProps.pauseAutoPlayOnHover &&
            hasUserInteracted
          ) {
            setHasUserInteracted(false);
          }
        }}
        className={classnames(styles["wrapper"], {
          [styles["wrapper--show-off-screen"]!]:
            isArrowCarousel && totalPages > 1,
          [styles["wrapper--with-gutter"]!]: hasGutter
        })}
      >
        {arrayChildren.slice(0, firstSlideIndex)}
        <div
          data-testid={hasUserInteracted ? "carousel-interacted" : "carousel"}
          className={classnames(styles["Carousel"], {
            [styles["Carousel--opacity"]!]: hasOpacityAnimation,
            [styles["Carousel--swipable"]!]:
              !isSwipeDisabled && !isArrowCarousel,
            [styles["Carousel--with-gutter"]!]: hasGutter
          })}
          ref={wrapper}
        >
          <CarouselComponent
            animateHeight={disableAnimateHeight ? false : isMobile}
            hysteresis={0.25}
            autoplay={Boolean(autoPlayProps.hasAutoPlay) && !hasUserInteracted}
            interval={
              autoPlayProps.hasAutoPlay
                ? autoPlayProps.autoPlayInterval
                : undefined
            }
            index={activePage}
            disabled={isSwipeDisabled}
            onChangeIndex={handleStepChange}
            slideClassName="Carousel__slide--global"
            // @ts-ignore TS doesn't get this variable when `autoPlay` util wraps it.
            onSwitching={(index: number, type: "move" | "end") => {
              if (!wrapper.current || !hasOpacityAnimation) {
                return;
              }

              handleSwiping(
                wrapper.current,
                index,
                type,
                isArrowCarousel ? 0.35 : 0
              );
            }}
            enableMouseEvents={!isArrowCarousel}
            {...extraProps}
          />
        </div>
        {arrayChildren.slice(lastSlideIndex + 1)}
      </div>
    </CarouselContext.Provider>
  );
};

Carousel.Slide = CarouselSlide;
Carousel.Controls = CarouselControls;

// NOTE: Unfortunately this is necessary as the higher order component won't
// understand the dot annotation Components of the Carousel.
export default withWidth({
  // NOTE: Need this for testing in the domjs enviornment.
  initialWidth: "lg"
})(Carousel) as React.ComponentType<Partial<Props>> & DotAnnotationComponents;
