import { useCallback, useMemo, useRef, useState, TouchEvent, WheelEvent, MouseEvent as ReactMouseEvent } from 'react';

interface UseImageZoomOptions {
    minScale?: number;
    maxScale?: number;
    step?: number;
    doubleTapScale?: number;
}

export function useImageZoom(options: UseImageZoomOptions = {}) {
    const { minScale = 1, maxScale = 5, step = 0.25, doubleTapScale = 2 } = options;

    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPinching, setIsPinching] = useState(false);

    const viewportRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    const pinchStartDistance = useRef<number | null>(null);
    const pinchStartScale = useRef<number>(1);
    const pinchStartPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    const isPanning = useRef(false);
    const panStartTouch = useRef<{ x: number; y: number } | null>(null);
    const panStartPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    const mousePanning = useRef(false);
    const mouseStartPoint = useRef<{ x: number; y: number } | null>(null);
    const mouseStartPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    const lastTapAt = useRef(0);
    const lastTapPoint = useRef<{ x: number; y: number } | null>(null);

    const clampScale = useCallback(
        (nextScale: number) => Math.min(maxScale, Math.max(minScale, nextScale)),
        [minScale, maxScale]
    );

    const getBounds = useCallback((nextScale: number) => {
        const viewport = viewportRef.current;
        const content = contentRef.current;
        if (!viewport || !content) {
            return { maxX: 0, maxY: 0 };
        }

        const viewportWidth = viewport.clientWidth;
        const viewportHeight = viewport.clientHeight;
        const contentWidth = content.offsetWidth * nextScale;
        const contentHeight = content.offsetHeight * nextScale;

        return {
            maxX: Math.max(0, (contentWidth - viewportWidth) / 2),
            maxY: Math.max(0, (contentHeight - viewportHeight) / 2),
        };
    }, []);

    const clampPosition = useCallback(
        (nextPosition: { x: number; y: number }, nextScale: number) => {
            const { maxX, maxY } = getBounds(nextScale);
            return {
                x: Math.min(maxX, Math.max(-maxX, nextPosition.x)),
                y: Math.min(maxY, Math.max(-maxY, nextPosition.y)),
            };
        },
        [getBounds]
    );

    const toViewportCenterCoords = useCallback((clientX: number, clientY: number) => {
        const viewport = viewportRef.current;
        if (!viewport) return { x: 0, y: 0 };
        const rect = viewport.getBoundingClientRect();
        return {
            x: clientX - rect.left - rect.width / 2,
            y: clientY - rect.top - rect.height / 2,
        };
    }, []);

    const applyZoomAtPoint = useCallback(
        (targetScale: number, focalPoint: { x: number; y: number }) => {
            setScale((prevScale) => {
                const nextScale = clampScale(targetScale);
                if (nextScale === prevScale) return prevScale;

                setPosition((prevPosition) => {
                    const ratio = nextScale / prevScale;
                    const nextPosition = {
                        x: ratio * prevPosition.x + (1 - ratio) * focalPoint.x,
                        y: ratio * prevPosition.y + (1 - ratio) * focalPoint.y,
                    };
                    return clampPosition(nextPosition, nextScale);
                });

                return nextScale;
            });
        },
        [clampScale, clampPosition]
    );

    const zoomIn = useCallback(() => {
        applyZoomAtPoint(scale + step, { x: 0, y: 0 });
    }, [applyZoomAtPoint, scale, step]);

    const zoomOut = useCallback(() => {
        applyZoomAtPoint(scale - step, { x: 0, y: 0 });
    }, [applyZoomAtPoint, scale, step]);

    const resetZoom = useCallback(() => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
        setIsPinching(false);
        pinchStartDistance.current = null;
        isPanning.current = false;
        mousePanning.current = false;
    }, []);

    const handleTouchStart = useCallback(
        (e: TouchEvent) => {
            if (e.touches.length === 2) {
                const [first, second] = [e.touches[0], e.touches[1]];
                const dx = first.clientX - second.clientX;
                const dy = first.clientY - second.clientY;
                pinchStartDistance.current = Math.hypot(dx, dy);
                pinchStartScale.current = scale;
                pinchStartPosition.current = position;
                isPanning.current = false;
                setIsPinching(true);
                return;
            }

            if (e.touches.length === 1 && scale > 1) {
                isPanning.current = true;
                panStartTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                panStartPosition.current = position;
            }
        },
        [position, scale]
    );

    const handleTouchMove = useCallback(
        (e: TouchEvent) => {
            if (e.touches.length === 2 && pinchStartDistance.current !== null) {
                e.preventDefault();

                const [first, second] = [e.touches[0], e.touches[1]];
                const dx = first.clientX - second.clientX;
                const dy = first.clientY - second.clientY;
                const distance = Math.hypot(dx, dy);
                const rawScale = pinchStartScale.current * (distance / pinchStartDistance.current);
                const nextScale = clampScale(rawScale);
                const centerX = (first.clientX + second.clientX) / 2;
                const centerY = (first.clientY + second.clientY) / 2;
                const focalPoint = toViewportCenterCoords(centerX, centerY);

                const ratio = nextScale / pinchStartScale.current;
                const nextPosition = {
                    x: ratio * pinchStartPosition.current.x + (1 - ratio) * focalPoint.x,
                    y: ratio * pinchStartPosition.current.y + (1 - ratio) * focalPoint.y,
                };

                setScale(nextScale);
                setPosition(clampPosition(nextPosition, nextScale));
                return;
            }

            if (e.touches.length === 1 && isPanning.current && panStartTouch.current) {
                e.preventDefault();
                const touch = e.touches[0];
                const dx = touch.clientX - panStartTouch.current.x;
                const dy = touch.clientY - panStartTouch.current.y;
                setPosition(clampPosition({
                    x: panStartPosition.current.x + dx,
                    y: panStartPosition.current.y + dy,
                }, scale));
            }
        },
        [clampPosition, clampScale, scale, toViewportCenterCoords]
    );

    const handleTouchEnd = useCallback(
        (e: TouchEvent) => {
            if (e.touches.length < 2) {
                pinchStartDistance.current = null;
                setIsPinching(false);
            }

            if (e.touches.length === 0) {
                isPanning.current = false;
                panStartTouch.current = null;

                const now = Date.now();
                const changedTouch = e.changedTouches?.[0];
                if (!changedTouch) return;

                const point = { x: changedTouch.clientX, y: changedTouch.clientY };
                const prevPoint = lastTapPoint.current;
                const isDoubleTap =
                    now - lastTapAt.current < 280 &&
                    !!prevPoint &&
                    Math.hypot(point.x - prevPoint.x, point.y - prevPoint.y) < 24;

                if (isDoubleTap) {
                    const focus = toViewportCenterCoords(point.x, point.y);
                    const nextTarget = scale > 1 ? 1 : Math.min(maxScale, Math.max(doubleTapScale, 1.5));
                    applyZoomAtPoint(nextTarget, focus);
                }

                lastTapAt.current = now;
                lastTapPoint.current = point;
            }
        },
        [applyZoomAtPoint, doubleTapScale, maxScale, scale, toViewportCenterCoords]
    );

    const handleWheel = useCallback(
        (e: WheelEvent) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -step : step;
            const focus = toViewportCenterCoords(e.clientX, e.clientY);
            applyZoomAtPoint(scale + delta, focus);
        },
        [applyZoomAtPoint, scale, step, toViewportCenterCoords]
    );

    const handleMouseDown = useCallback(
        (e: ReactMouseEvent<HTMLDivElement>) => {
            if (scale <= 1) return;
            mousePanning.current = true;
            mouseStartPoint.current = { x: e.clientX, y: e.clientY };
            mouseStartPosition.current = position;
        },
        [position, scale]
    );

    const handleMouseMove = useCallback(
        (e: ReactMouseEvent<HTMLDivElement>) => {
            if (!mousePanning.current || !mouseStartPoint.current) return;
            const dx = e.clientX - mouseStartPoint.current.x;
            const dy = e.clientY - mouseStartPoint.current.y;
            setPosition(
                clampPosition(
                    {
                        x: mouseStartPosition.current.x + dx,
                        y: mouseStartPosition.current.y + dy,
                    },
                    scale
                )
            );
        },
        [clampPosition, scale]
    );

    const handleMouseUp = useCallback(() => {
        mousePanning.current = false;
        mouseStartPoint.current = null;
    }, []);

    const transformStyle = useMemo(
        () => ({
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
            transformOrigin: 'center center' as const,
            transition: isPinching || isPanning.current || mousePanning.current ? 'none' : 'transform 0.18s ease',
        }),
        [position.x, position.y, scale, isPinching]
    );

    return {
        scale,
        position,
        setScale,
        setPosition,
        viewportRef,
        contentRef,
        isPinching,
        transformStyle,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handleWheel,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        zoomIn,
        zoomOut,
        resetZoom,
        minScale,
        maxScale,
    };
}
