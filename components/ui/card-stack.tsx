"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export type CardStackItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc?: string;
  href?: string;
  ctaLabel?: string;
  tag?: string;
};

export type CardStackProps<T extends CardStackItem> = {
  items: T[];

  /** Selected index on mount */
  initialIndex?: number;

  /** How many cards are visible around the active (odd recommended, 3 for compact) */
  maxVisible?: number;

  /** Card sizing */
  cardWidth?: number;
  cardHeight?: number;

  /** How much cards overlap each other (0..0.8). Higher = more overlap */
  overlap?: number;

  /** Total fan angle (deg). Higher = wider arc */
  spreadDeg?: number;

  /** 3D / depth feel */
  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;

  /** Active emphasis */
  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;

  /** Motion - fast, snappy, lightweight */
  springStiffness?: number;
  springDamping?: number;
  springMass?: number;

  /** Behavior */
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;

  /** UI */
  showDots?: boolean;
  className?: string;

  /** Hooks */
  onChangeIndex?: (index: number, item: T) => void;
  onCardClick?: (item: T, state: { active: boolean; index: number }) => void;

  /** Custom renderer (optional) */
  renderCard?: (item: T, state: { active: boolean }) => React.ReactNode;
};

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

/** Minimal signed offset from active index to i, with wrapping (for loop behavior). */
function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;

  // consider wrapped alternative
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 3,

  cardWidth = 520,
  cardHeight = 295,

  overlap = 0.52,
  spreadDeg = 16,

  perspectivePx = 1100,
  depthPx = 70,
  tiltXDeg = 4,

  activeLiftPx = 14,
  activeScale = 1.05,
  inactiveScale = 0.90,

  springStiffness = 450,
  springDamping = 32,
  springMass = 0.45,

  loop = true,
  autoAdvance = false,
  intervalMs = 3000,
  pauseOnHover = true,

  showDots = true,
  className,

  onChangeIndex,
  onCardClick,
  renderCard,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion();
  const len = items.length;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState<number>(800);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      } else {
        setContainerWidth(window.innerWidth);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const isMobile = containerWidth < 640;
  const effectiveCardWidth = isMobile
    ? Math.min(cardWidth, Math.max(280, containerWidth - 36))
    : cardWidth;
  const effectiveCardHeight = isMobile
    ? Math.round(effectiveCardWidth * (9 / 16))
    : cardHeight;
  const effectiveSpacing = isMobile
    ? Math.round(effectiveCardWidth * 0.22)
    : Math.max(10, Math.round(effectiveCardWidth * (1 - overlap)));
  const effectiveSpreadDeg = isMobile ? Math.min(10, spreadDeg) : spreadDeg;

  const [active, setActive] = React.useState(() =>
    wrapIndex(initialIndex, len),
  );
  const [hovering, setHovering] = React.useState(false);

  // keep active in bounds if items change
  React.useEffect(() => {
    setActive((a) => wrapIndex(a, len));
  }, [len]);

  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));
  const stepDeg = maxOffset > 0 ? effectiveSpreadDeg / maxOffset : 0;

  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len) return;
    if (!canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len) return;
    if (!canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  // keyboard navigation (when container focused)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  // autoplay
  React.useEffect(() => {
    if (!autoAdvance) return;
    if (reduceMotion) return;
    if (!len) return;
    if (pauseOnHover && hovering) return;

    const id = window.setInterval(
      () => {
        if (loop || active < len - 1) next();
      },
      Math.max(700, intervalMs),
    );

    return () => window.clearInterval(id);
  }, [
    autoAdvance,
    intervalMs,
    hovering,
    pauseOnHover,
    reduceMotion,
    len,
    loop,
    active,
    next,
  ]);

  if (!len) return null;

  const activeItem = items[active]!;

  return (
    <div
      ref={containerRef}
      className={cn("w-full select-none", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Stage */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: Math.max(isMobile ? 260 : 340, effectiveCardHeight + (isMobile ? 35 : 50)) }}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {/* Ambient subtle glow */}
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto h-48 w-[60%] rounded-full bg-gradient-to-r from-red-600/10 via-accent/15 to-amber-500/10 blur-3xl opacity-60"
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 flex items-end justify-center"
          style={{
            perspective: `${perspectivePx}px`,
          }}
        >
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const off = signedOffset(i, active, len, loop);
              const abs = Math.abs(off);
              const visible = abs <= maxOffset;

              // hide far-away cards cleanly (only 3 visible: -1, 0, 1)
              if (!visible) return null;

              // fan geometry
              const rotateZ = off * stepDeg;
              const x = off * effectiveSpacing;
              const y = abs * 6;
              const z = -abs * depthPx;

              const isActive = off === 0;

              const scale = isActive ? activeScale : inactiveScale;
              const lift = isActive ? -activeLiftPx : 0;

              const rotateX = isActive ? 0 : tiltXDeg;

              const zIndex = 100 - abs;

              // Ultra-responsive light swipe gestures
              const dragProps = isActive
                ? {
                    drag: "x" as const,
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.1,
                    onDragEnd: (
                      _e: any,
                      info: { offset: { x: number }; velocity: { x: number } },
                    ) => {
                      if (reduceMotion) return;
                      const travel = info.offset.x;
                      const v = info.velocity.x;
                      const threshold = 38; // light, effortless flick

                      // swipe logic
                      if (travel > threshold || v > 220) prev();
                      else if (travel < -threshold || v < -220) next();
                    },
                  }
                : {};

              return (
                <motion.div
                  key={item.id}
                  className={cn(
                    "absolute bottom-0 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl will-change-transform select-none",
                    isActive
                      ? "cursor-pointer ring-1 ring-accent/60 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(255,30,56,0.3)]"
                      : "cursor-pointer hover:border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)] opacity-90 hover:opacity-100",
                  )}
                  style={{
                    width: effectiveCardWidth,
                    maxWidth: "min(440px, calc(100vw - 48px))",
                    height: effectiveCardHeight,
                    zIndex,
                    transformStyle: "preserve-3d",
                  }}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: y + 20,
                          x,
                          rotateZ,
                          rotateX,
                          scale,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x,
                    y: y + lift,
                    rotateZ,
                    rotateX,
                    scale,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: springStiffness,
                    damping: springDamping,
                    mass: springMass,
                    restDelta: 0.001,
                  }}
                  onClick={() => {
                    if (onCardClick) {
                      onCardClick(item, { active: isActive, index: i });
                    }
                    if (!isActive) {
                      setActive(i);
                    }
                  }}
                  {...dragProps}
                >
                  <div
                    className="h-full w-full"
                    style={{
                      transform: `translateZ(${z}px)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {renderCard ? (
                      renderCard(item, { active: isActive })
                    ) : (
                      <DefaultFanCard item={item} active={isActive} />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Sleek Centered Navigation: ( ← )  ● ● ▬ ● ●  ( → ) */}
      {showDots ? (
        <div className="mt-4 flex items-center justify-center gap-3">
          {len > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              disabled={!canGoPrev}
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-accent border border-white/20 hover:border-accent text-white flex items-center justify-center transition-colors duration-150 active:scale-95 disabled:opacity-20 disabled:pointer-events-none cursor-pointer shadow-lg"
              aria-label="Previous card"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 border border-white/10 backdrop-blur-md shadow-lg">
            {items.map((it, idx) => {
              const on = idx === active;
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => setActive(idx)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-200 cursor-pointer",
                    on
                      ? "w-7 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                      : "w-2 bg-white/30 hover:bg-white/60",
                  )}
                  aria-label={`Go to ${it.title}`}
                />
              );
            })}
          </div>

          {len > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              disabled={!canGoNext}
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-accent border border-white/20 hover:border-accent text-white flex items-center justify-center transition-colors duration-150 active:scale-95 disabled:opacity-20 disabled:pointer-events-none cursor-pointer shadow-lg"
              aria-label="Next card"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {activeItem.href ? (
            <Link
              href={activeItem.href}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-black/60 border border-white/10 hover:border-accent text-gray-400 hover:text-white flex items-center justify-center transition-colors shadow-lg"
              aria-label="Open live link"
              title="Open Live Website"
            >
              <SquareArrowOutUpRight className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function DefaultFanCard({ item }: { item: CardStackItem; active: boolean }) {
  return (
    <div className="relative h-full w-full bg-[#0a0f1d] rounded-2xl overflow-hidden border border-white/10">
      <div className="absolute inset-0">
        {item.imageSrc ? (
          <img
            src={item.imageSrc}
            alt={item.title}
            className="h-full w-full object-cover"
            draggable={false}
            loading="eager"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-end p-5">
        <div className="truncate text-lg font-semibold text-white">
          {item.title}
        </div>
        {item.description ? (
          <div className="mt-1 line-clamp-2 text-sm text-white/80">
            {item.description}
          </div>
        ) : null}
      </div>
    </div>
  );
}
