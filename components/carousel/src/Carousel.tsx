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
import styles from "./Carousel.module.scss";
import { withWidth, WithWidth } from "@material-ui/core";

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
} & (
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
) &
  WithWidth;

type SlideProps = {
  children: React.ReactNode;
  className?: string;
};

const CarouselContext = createContext<{
  activePage: number;
  total: number;
  setActivePage?: Dispatch<SetStateAction<number>>;
  scroll?: Props["scroll"];
  slidesPerPage?: number;
  totalSlides: number;
}>({
  activePage: 0,
  total: 0,
  totalSlides: 0
});

const CarouselSlide = ({ children, className }: SlideProps) => {
  const { slidesPerPage, totalSlides } = useContext(CarouselContext);

  return (
    <div
      className={classnames(styles["slide"], className)}
      style={{
        width: `${100 / (Math.max(slidesPerPage, totalSlides) || 1)}%`
      }}
    >
      {children}
    </div>
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

const usePrevious = (value) => {
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
  const activeSlide: HTMLElement = wrapperElement.querySelector(
    ".Carousel__slide--global[aria-hidden='false']"
  );
  const nextSlide =
    index >= 3
      ? activeSlide.nextElementSibling
      : activeSlide.previousElementSibling;

  if (type === "end") {
    Array.from(
      wrapperElement.querySelectorAll(".Carousel__slide--global")
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

const CarouselControls = ({
  type = "slide",
  ...rest
}: {
  type?: "arrows" | "slide";
} & Omit<
  SlideControlsProps,
  "current" | "total" | "onNextClick" | "onPrevClick"
>) => {
  const { activePage, setActivePage, total, scroll = "infinite" } = useContext(
    CarouselContext
  );

  if (type === "slide") {
    // TODO: Handle finite scroll.
    return (
      <SlideControls
        current={getPageFromAbsoluteIndex(activePage, total)}
        total={total}
        onNextClick={() => setActivePage(activePage + 1)}
        onPrevClick={() => setActivePage(activePage - 1)}
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
          onClick={() => setActivePage(activePage - 1)}
        />
      )}
      {(activePage < total - 1 || scroll === "infinite") && (
        <ArrowControl
          direction="right"
          onClick={() => setActivePage(activePage + 1)}
        />
      )}
    </>
  );
};

type DotAnnotationComponents = {
  Slide: typeof CarouselSlide;
  Controls: typeof CarouselControls;
};

const Carousel = ({
  children,
  slidesPerPage = 1,
  initialPage = 0,
  isSwipeDisabled,
  onPageChange,
  hasOpacityAnimation,
  width: currentBreakpoint,
  scroll = "infinite",
  ...autoPlayProps
}: Props) => {
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<number>(initialPage);
  const wrapper = useRef<HTMLDivElement>(null);
  const arrayChildren = React.Children.toArray(children);
  const isArrowCarousel = useMemo(
    () =>
      !!arrayChildren.find(
        (child) =>
          isValidElement(child) &&
          child?.type === CarouselControls &&
          child.props.type === "arrows"
      ),
    [arrayChildren]
  );
  hasOpacityAnimation = hasOpacityAnimation || isArrowCarousel;
  let firstSlideIndex: number;
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
  const pageSlides = useMemo(
    () =>
      Array.from(new Array(totalPages)).map((_, pageNumber) => {
        return slides.slice(
          pageNumber * finalSlidesPerPage,
          pageNumber * finalSlidesPerPage + finalSlidesPerPage
        );
      }),
    [totalPages]
  );
  const previousTotalPages = usePrevious(totalPages);

  useEffect(() => {
    handleStepChange(
      Math.floor(mapRange(activePage, 0, previousTotalPages, 0, totalPages))
    );
  }, [finalSlidesPerPage]);

  useEffect(() => {
    if (initialPage !== activePage) {
      setActivePage(initialPage);
    }
  }, [initialPage]);

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
          children: pageSlides.map((pageSlide, key) => {
            return (
              <div className={styles["page"]} key={key}>
                {pageSlide}
              </div>
            );
          })
        }
      : { slideRenderer };

  const CarouselComponent =
    scroll === "finite"
      ? AutoPlaySwipeableViews
      : InfiniteSwipeableViewsComponent;

  return (
    <CarouselContext.Provider
      value={{
        activePage,
        setActivePage,
        total: totalPages,
        scroll,
        slidesPerPage: finalSlidesPerPage,
        totalSlides: slides.length
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
          [styles["wrapper--shrinked"]]: isArrowCarousel && totalPages > 1
        })}
      >
        {arrayChildren.slice(0, firstSlideIndex)}
        <div
          className={classnames(styles["Carousel"], {
            [styles["Carousel--opacity"]]: hasOpacityAnimation,
            [styles["Carousel--swipable"]]:
              !isSwipeDisabled && !isArrowCarousel,
            [styles["Carousel--show-off-screen"]]:
              isArrowCarousel && totalPages > 1
          })}
          ref={wrapper}
        >
          <CarouselComponent
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
