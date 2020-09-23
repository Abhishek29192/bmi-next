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
import styles from "./Carousel.module.scss";

const SwipeableViewsComponent = virtualize(autoPlay(SwipeableViews));

type Props = {
  // TODO: This is API design for future Carousel implementations.
  // theme?: "default";
  // controls?: "arrows" | "slide";
  children: React.ReactNode;
  slidesPerPage?: number;
  initialPage?: number;
  isSwipeDisabled?: boolean;
  onPageChange?: (activePage: number) => void;
  hasOpacityAnimation?: boolean;
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
);

type SlideProps = {
  children: React.ReactNode;
  className?: string;
};

const CarouselContext = createContext<{
  activePage: number;
  total: number;
  setActivePage?: Dispatch<SetStateAction<number>>;
}>({
  activePage: 0,
  total: 0
});

const CarouselSlide = ({ children, className }: SlideProps) => {
  return (
    <div className={classnames(styles["slide"], className)}>{children}</div>
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

const handleSwiping = (
  wrapperElement: HTMLElement,
  index: number,
  type: "move" | "end"
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
    nextSlide.style.opacity = "" + currentSwipe;
    // @ts-ignore It's a HTMLElement
    nextSlide.style.transitionDuration = "0s";
  }
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
  const { activePage, setActivePage, total } = useContext(CarouselContext);
  /* istanbul ignore next */
  if (process.env.NODE_ENV === "development" && type === "arrows") {
    // eslint-disable-next-line no-console
    console.warn(
      "Carousel.Controls: Sorry, the only controls type available at the moment is slide."
    );
  }

  return (
    <SlideControls
      current={getPageFromAbsoluteIndex(activePage, total)}
      total={total}
      onNextClick={() => setActivePage(activePage + 1)}
      onPrevClick={() => setActivePage(activePage - 1)}
      {...rest}
    />
  );
};

const Carousel = ({
  children,
  slidesPerPage = 1,
  initialPage = 0,
  isSwipeDisabled,
  onPageChange,
  hasOpacityAnimation,
  ...autoPlayProps
}: Props) => {
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<number>(initialPage);
  const wrapper = useRef<HTMLDivElement>(null);

  const arrayChildren = React.Children.toArray(children);
  let firstSlideIndex: number;
  let lastSlideIndex: number = 0;
  const slides = useMemo(
    () =>
      arrayChildren.filter((child, index) => {
        const isSlide =
          isValidElement(child) && child.type && child.type === CarouselSlide;

        if (isSlide) {
          firstSlideIndex =
            firstSlideIndex !== undefined ? firstSlideIndex : index;
          lastSlideIndex = Math.max(lastSlideIndex, index);
        }

        return isSlide;
      }),
    [arrayChildren]
  );
  const totalPages = Math.ceil(slides.length / slidesPerPage);
  const pageSlides = useMemo(
    () =>
      Array.from(new Array(totalPages)).map((_, pageNumber) => {
        return slides.slice(
          pageNumber * slidesPerPage,
          pageNumber * slidesPerPage + slidesPerPage
        );
      }),
    [totalPages]
  );

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

  return (
    <CarouselContext.Provider
      value={{
        activePage,
        setActivePage,
        total: totalPages
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
        className={styles["wrapper"]}
      >
        {arrayChildren.slice(0, firstSlideIndex)}
        <div
          className={classnames(styles["Carousel"], {
            [styles["Carousel--opacity"]]: hasOpacityAnimation,
            [styles["Carousel--swipable"]]: !isSwipeDisabled
          })}
          ref={wrapper}
        >
          <SwipeableViewsComponent
            hysteresis={0.25}
            autoplay={Boolean(autoPlayProps.hasAutoPlay) && !hasUserInteracted}
            interval={
              autoPlayProps.hasAutoPlay
                ? autoPlayProps.autoPlayInterval
                : undefined
            }
            slideRenderer={slideRenderer}
            index={activePage}
            disabled={isSwipeDisabled}
            onChangeIndex={handleStepChange}
            slideClassName="Carousel__slide--global"
            // @ts-ignore TS doesn't get this variable when `autoPlay` util wraps it.
            onSwitching={(index: number, type: "move" | "end") => {
              if (!wrapper.current || !hasOpacityAnimation) {
                return;
              }

              handleSwiping(wrapper.current, index, type);
            }}
            // TODO: Check if this is right with George (swipe only on phones)
            // enableMouseEvents={process.env.NODE_ENV === "development"}
            enableMouseEvents
          />
        </div>
        {arrayChildren.slice(lastSlideIndex + 1)}
      </div>
    </CarouselContext.Provider>
  );
};

Carousel.Slide = CarouselSlide;
Carousel.Controls = CarouselControls;

export default Carousel;
