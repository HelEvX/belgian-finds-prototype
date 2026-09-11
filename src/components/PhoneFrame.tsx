import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";

type PhoneFrameProps = {
  screenKey: number;
  children: ReactNode;
  navigation: ReactNode;
};

export function PhoneFrame({ screenKey, children, navigation }: PhoneFrameProps) {
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const dragStartScrollTop = useRef(0);

  useEffect(() => {
    mobileScrollRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [screenKey]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const scrollElement = mobileScrollRef.current;
    const target = event.target as HTMLElement;

    if (!scrollElement) {
      return;
    }

    if (target.closest("button, a, input, textarea, select, label")) {
      return;
    }

    dragStartY.current = event.clientY;
    dragStartScrollTop.current = scrollElement.scrollTop;

    scrollElement.setPointerCapture(event.pointerId);
    scrollElement.classList.add("is-dragging");
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const scrollElement = mobileScrollRef.current;

    if (!scrollElement || dragStartY.current === null) {
      return;
    }

    const distanceDragged = event.clientY - dragStartY.current;

    scrollElement.scrollTop = dragStartScrollTop.current - distanceDragged;
  };

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    const scrollElement = mobileScrollRef.current;

    dragStartY.current = null;

    if (!scrollElement) {
      return;
    }

    if (scrollElement.hasPointerCapture(event.pointerId)) {
      scrollElement.releasePointerCapture(event.pointerId);
    }

    scrollElement.classList.remove("is-dragging");
  };

  return (
    <div className="phone-column">
      <div className="phone-frame">
        <div className="phone-speaker" />

        <div className="phone-screen">
          <div className="mobile-status-bar">
            <span>9:41</span>
            <span>● ● ●</span>
          </div>

          <div className="scroll-hint" aria-hidden="true">
            <span>↕</span>
            <span>Drag or scroll inside the app</span>
          </div>

          <div
            ref={mobileScrollRef}
            className="mobile-app"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerCancel={stopDragging}>
            {children}
          </div>

          {navigation}
        </div>
      </div>
    </div>
  );
}
