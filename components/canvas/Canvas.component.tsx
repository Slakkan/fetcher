"use client"

import { FunctionComponent, TouchEvent, useCallback, useEffect, useMemo, useRef, useState, Dispatch, SetStateAction } from "react"
import styles from "./Canvas.module.scss"

export enum Colors {
    "$primary" = "#ffb96a",
    "$secondary" = "#534c4c",
    "$off-white" = "#f1f1f1",
    "$error" = "#e91616"
}

type Coordinate = [number, number]
type DrawingRectCoordinates = { x: number, y: number, width: number, height: number, scale: [number, number] }
type RectCoordinates = { startRow: number, startCol: number, endRow: number, endCol: number }

export type SavedRectangle = { id: string, rect: RectCoordinates }


interface CanvasProps {
    id: string,
    savedRectangles: SavedRectangle[],
    setSavedRectangles: Dispatch<SetStateAction<SavedRectangle[]>>,
}


const Canvas: FunctionComponent<CanvasProps> = ({ id, savedRectangles, setSavedRectangles }) => {
    const canvasRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)
    const eventsRef = useRef<SVGRectElement>(null)
    const [canvasWidth, setCanvasWidth] = useState(0)
    const unit = useMemo(() => canvasWidth / 13, [canvasWidth])
    const padding = useMemo(() => unit / 24, [unit])
    const canvasViewBox = useMemo(() => `${unit / 2} ${unit / 2} ${canvasWidth - unit} ${canvasWidth - unit}`, [canvasWidth, unit])
    const [dragOrigin, setDragOrigin] = useState<Coordinate | null>(null)
    const [dragEnd, setDragEnd] = useState<Coordinate | null>(null)
    const [dragRectangleCoords, setDragRectangleCoords] = useState<DrawingRectCoordinates | null>(null)
    const [rectTransformOrigin, setRectTransformOrigin] = useState("0px 0px")
    const [focusedRectangleIndex, setFocusedRectangleIndex] = useState<number>(-1)
    const [editingRectangleIndex, setEditingRectangleIndex] = useState<number>(-1)

    const saveRectangle = useCallback((newRect: RectCoordinates) => {
        const isValidRect = newRect.startCol !== newRect.endCol && newRect.startRow !== newRect.endRow
        if (isValidRect) {
            setSavedRectangles((prev) => [...prev, { id: id + Math.random(), rect: newRect }])
        }
    }, [id, setSavedRectangles])

    const editRectangle = useCallback((newRect: RectCoordinates) => {
        const isValidRect = newRect.startCol !== newRect.endCol && newRect.startRow !== newRect.endRow
        if (isValidRect) {
            setSavedRectangles((prev) => {
                const others = prev.filter((rect, index) => index !== editingRectangleIndex)
                return [...others, { ...prev[editingRectangleIndex], rect: newRect }]
            })
        }
    }, [editingRectangleIndex, setSavedRectangles])

    const getOffsetFromTouch: (touchEvent: TouchEvent<SVGRectElement | SVGCircleElement>) => [number, number] = (touchEvent) => {
        if (!svgRef.current) return [0, 0]
        var rect = svgRef.current.getBoundingClientRect();
        return [
            touchEvent.changedTouches[0].clientX - rect.left,
            touchEvent.changedTouches[0].clientY - rect.top,
        ];
    }

    const getPointer = useCallback((offsetX: number, offsetY: number) => {
        const pointerX = offsetX + Math.floor(unit / 2)
        const pointerY = offsetY + Math.floor(unit / 2)

        const factorX = 1 - ((canvasWidth + unit - pointerX) / (canvasWidth))

        const factorY = 1 - ((canvasWidth + unit - pointerY) / (canvasWidth))

        return [pointerX - unit * factorX, pointerY - unit * factorY] as Coordinate
    }, [canvasWidth, unit])

    const getClosestPoint = useCallback((offsetX: number, offsetY: number) => {
        const [pointerX, pointerY]: Coordinate = getPointer(offsetX, offsetY)
        const closestPoint: Coordinate = [Math.round(pointerY / unit), Math.round(pointerX / unit)]

        return closestPoint
    }, [getPointer, unit])

    const getRectCoordinates: (offsetX: number, offsetY: number) => RectCoordinates = useCallback((offsetX, offsetY) => {
        const [originRow, originCol] = dragOrigin!
        const [originX, originY] = [originCol * unit, originRow * unit]

        const closestPoint = getClosestPoint(offsetX, offsetY)
        const [closestRow, closestCol] = closestPoint

        const [pointerX, pointerY] = getPointer(offsetX, offsetY);

        let startRow = originRow
        let startCol = originCol
        let endRow = closestRow
        let endCol = closestCol

        if (pointerY - originY < 0) {
            startRow = closestRow
            endRow = originRow
        }

        if (pointerX - originX < 0) {
            startCol = closestCol
            endCol = originCol
        }

        return { startRow, startCol, endRow, endCol } as RectCoordinates
    }, [dragOrigin, getClosestPoint, getPointer, unit])

    const getCollisions: (newRect: RectCoordinates) => [boolean, RectCoordinates] = useCallback((newRect) => {
        const [originRow, originCol] = dragOrigin!

        const collisions: RectCoordinates[] = []
        savedRectangles.forEach((savedRect, index) => {
            if (editingRectangleIndex === index) return;

            let collisionStartRow = newRect.startRow
            let collisionStartCol = newRect.startCol
            let collisionEndRow = newRect.endRow
            let collisionEndCol = newRect.endCol


            const isLeft = originCol <= savedRect.rect.startCol
            const isRight = originCol >= savedRect.rect.endCol
            const isTop = originRow <= savedRect.rect.startRow
            const isBottom = originRow >= savedRect.rect.endRow

            const isTopLeftQuadrant = isTop && isLeft
            const isTopQuadrant = isTop && !isLeft && !isRight
            const isTopRightQuadrant = isTop && isRight

            const isLeftQuadrant = isLeft && !isTop && !isBottom
            const isInsideQuadrant = !isLeft && !isRight && !isTop && !isBottom
            const isRightQuadrant = isRight && !isTop && !isBottom

            const isBottomLeftQuadrant = isBottom && isLeft
            const isBottomQuadrant = isBottom && !isLeft && !isRight
            const isBottomRightQuadrant = isBottom && isRight

            if (isTopLeftQuadrant && newRect.endCol > savedRect.rect.startCol && newRect.endRow > savedRect.rect.startRow) {
                collisionEndRow = savedRect.rect.startRow
            }

            if (isTopQuadrant && newRect.endRow > savedRect.rect.startRow) {
                collisionEndRow = savedRect.rect.startRow
            }

            if (isTopRightQuadrant && newRect.startCol < savedRect.rect.endCol && newRect.startRow < savedRect.rect.endRow) {
                collisionEndRow = savedRect.rect.startRow
            }


            if (isLeftQuadrant && newRect.endCol > savedRect.rect.startCol) {
                collisionEndCol = savedRect.rect.startCol
            }

            if (isInsideQuadrant) {
                collisionEndRow = collisionStartRow
                collisionEndCol = collisionStartCol
            }

            if (isRightQuadrant && newRect.startCol < savedRect.rect.endCol) {
                collisionStartCol = savedRect.rect.endCol
            }

            if (isBottomLeftQuadrant && newRect.endCol > savedRect.rect.startCol && newRect.startRow < savedRect.rect.endRow) {
                collisionStartRow = savedRect.rect.endRow
            }

            if (isBottomQuadrant && newRect.startRow < savedRect.rect.endRow) {
                collisionStartRow = savedRect.rect.endRow
            }

            if (isBottomRightQuadrant && newRect.startCol < savedRect.rect.endCol && newRect.startRow < savedRect.rect.endRow) {
                collisionStartRow = savedRect.rect.endRow
            }

            if (collisionStartCol > collisionEndCol) {
                [collisionEndCol, collisionStartCol] = [collisionStartCol, collisionStartCol]
            }

            if (collisionStartRow > collisionEndRow) {
                [collisionStartRow, collisionEndRow] = [collisionEndRow, collisionStartRow]
            }

            const hasCollisions = collisionStartRow !== newRect.startRow || collisionStartCol !== newRect.startCol || collisionEndRow !== newRect.endRow || collisionEndCol !== newRect.endCol

            if (hasCollisions) {
                collisions.push({ startRow: collisionStartRow, startCol: collisionStartCol, endRow: collisionEndRow, endCol: collisionEndCol })
            }
        })

        if (!collisions.length) {
            return [false, newRect]
        }

        const biggestRect = { ...newRect }

        let highestStartRow = collisions[0].startRow
        let highestStartCol = collisions[0].startCol;
        let lowestEndRow = collisions[0].endRow
        let lowestEndCol = collisions[0].endCol;

        collisions.forEach(collision => {
            if (collision.startRow > highestStartRow) {
                highestStartRow = collision.startRow
            }
            if (collision.startCol > highestStartCol) {
                highestStartCol = collision.startCol
            }
            if (collision.endRow < lowestEndRow) {
                lowestEndRow = collision.endRow
            }
            if (collision.endCol < lowestEndCol) {
                lowestEndCol = collision.endCol
            }
        })

        biggestRect.startRow = highestStartRow
        biggestRect.startCol = highestStartCol
        biggestRect.endRow = lowestEndRow
        biggestRect.endCol = lowestEndCol

        return [true, biggestRect]
    }, [dragOrigin, editingRectangleIndex, savedRectangles])

    const onDown: (offsetX: number, offsetY: number) => void = useCallback((offsetX, offsetY) => {
        setDragRectangleCoords(null)

        const closestPoint = getClosestPoint(offsetX, offsetY)

        setDragOrigin(closestPoint)

        const [row, col] = closestPoint
        setRectTransformOrigin(`${col * unit}px ${row * unit}px`)

    }, [getClosestPoint, unit])


    const onMove: (offsetX: number, offsetY: number) => void = useCallback((offsetX, offsetY) => {
        if (dragOrigin && !dragEnd) {
            const [originRow, originCol] = dragOrigin
            const [originX, originY] = [originCol * unit, originRow * unit]

            const [pointerX, pointerY] = getPointer(offsetX, offsetY)

            const newRect = getRectCoordinates(offsetX, offsetY)
            const [hasCollisions, biggestRect] = getCollisions(newRect)

            if (hasCollisions) {
                return setDragRectangleCoords({ x: biggestRect.startCol * unit, y: biggestRect.startRow * unit, width: (biggestRect.endCol - biggestRect.startCol) * unit, height: (biggestRect.endRow - biggestRect.startRow) * unit, scale: [1, 1] })
            }

            let scaleX = 1
            if (pointerX - originX < 0) {
                scaleX = -1
            }

            let scaleY = 1
            if (pointerY - originY < 0) {
                scaleY = -1
            }

            const width = Math.abs(pointerX - originX)
            const height = Math.abs(pointerY - originY)

            setDragRectangleCoords({ x: originX, y: originY, width, height, scale: [scaleX, scaleY] })
        }
    }, [dragEnd, dragOrigin, getCollisions, getPointer, getRectCoordinates, unit])

    const onUp: (offsetX: number, offsetY: number) => void = useCallback((offsetX, offsetY) => {
        if (dragOrigin) {
            const newRect: RectCoordinates = getRectCoordinates(offsetX, offsetY)
            const [hasCollisions, biggestRect] = getCollisions(newRect)

            if (editingRectangleIndex === -1) {
                if (hasCollisions) {
                    saveRectangle(biggestRect)
                } else {
                    saveRectangle(newRect)
                }
            } else {
                if (hasCollisions) {
                    editRectangle(biggestRect)
                } else {
                    editRectangle(newRect)
                }
            }

            setDragRectangleCoords(null);
            setDragOrigin(null)
            setDragEnd(null)
            setEditingRectangleIndex(-1)
        }

    }, [dragOrigin, editRectangle, editingRectangleIndex, getCollisions, getRectCoordinates, saveRectangle])

    const generateGrid = useMemo(() => {
        const circles: JSX.Element[] = []
        for (let col = 1; col <= 12; col++) {
            for (let row = 1; row <= 12; row++) {
                const transformOrigin = `${col * unit}px ${row * unit}px`
                circles.push(<circle className={styles.canvas__anchor} key={`row:${row}-col:${col}`} onTouchStart={() => onDown(col * unit, row * unit)} onTouchMove={(e) => onMove(...getOffsetFromTouch(e))} onTouchEnd={() => onDown(col * unit, row * unit)} onMouseDown={() => onDown(col * unit, row * unit)} onMouseUp={() => onUp(col * unit, row * unit)} cx={col * unit} cy={row * unit} style={{ transformOrigin }} r={unit / 20} fill={Colors.$secondary} />)
            }
        }
        return circles
    }, [onDown, onMove, onUp, unit])

    const getExpandHandlesClass = useCallback((index: number) => {
        const base = styles.canvas__handle
        const selected = styles["canvas__handle--selected"]

        const isSelected = index === focusedRectangleIndex

        return `${base} ${isSelected ? selected : ""}`
    }, [focusedRectangleIndex])

    const onExpand: (index: number, origin: Coordinate, savedRectangle: SavedRectangle, scale: [number, number]) => void = useCallback((index, origin, savedRectangle, scale) => {
        setEditingRectangleIndex(index)

        const width = (savedRectangle.rect.endCol - savedRectangle.rect.startCol) * unit
        const height = (savedRectangle.rect.endRow - savedRectangle.rect.startRow) * unit
        setDragRectangleCoords({ x: origin[1] * unit, y: origin[0] * unit, width, height, scale })

        setDragOrigin(origin)

        const [row, col] = origin
        setRectTransformOrigin(`${col * unit}px ${row * unit}px`)

    }, [unit])

    const onEditBlur = useCallback(() => {
        setEditingRectangleIndex(-1)
        setFocusedRectangleIndex(-1);
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        let observer: ResizeObserver | undefined
        if (canvas && !observer) {
            observer = new ResizeObserver((e) => {
                const { width } = e[0].contentRect
                setCanvasWidth(width)
            })

            observer.observe(canvas)
        }
        return () => observer?.disconnect()
    }, [])

    useEffect(() => console.log(savedRectangles), [savedRectangles])


    return (
        <div ref={canvasRef} className={styles.canvas + " d-flex flex-column px-md-3 py-5"} style={{ flexGrow: 1 }}>
            <svg ref={svgRef} className={styles.canvas__svg} viewBox={canvasViewBox} width={canvasWidth} height={canvasWidth}>
                <rect ref={eventsRef} fill="transparent" onTouchMove={(e) => onMove(...getOffsetFromTouch(e))} onTouchStart={(e) => onDown(...getOffsetFromTouch(e))} onTouchEnd={(e) => onUp(...getOffsetFromTouch(e))} onMouseMove={(e) => onMove(e.nativeEvent.offsetX, e.nativeEvent.offsetY)} onMouseDown={(e) => onDown(e.nativeEvent.offsetX, e.nativeEvent.offsetY)} onMouseUp={(e) => onUp(e.nativeEvent.offsetX, e.nativeEvent.offsetY)} x={0} y={0} width={canvasWidth} height={canvasWidth} />
                {dragRectangleCoords && <rect className={styles.canvas__drawrect} style={{ transform: `scale(${dragRectangleCoords!.scale[0]},${dragRectangleCoords!.scale[1]})`, transformOrigin: rectTransformOrigin }} fill="white" rx={unit / 10} x={dragRectangleCoords!.x} y={dragRectangleCoords!.y} width={dragRectangleCoords!.width} height={dragRectangleCoords!.height} />}
                <g>
                    {generateGrid}
                </g>
                <g>
                    {savedRectangles.map((savedRect, index) =>
                        <g key={`${savedRect.id}-${index}`} tabIndex={0} style={{ outline: "none", opacity: editingRectangleIndex === index ? 0 : 1 }} onFocus={() => setFocusedRectangleIndex(index)} onBlur={onEditBlur}>
                            <rect className={styles.canvas__rect} tabIndex={0} fill="white" rx={unit / 10} x={savedRect.rect.startCol * unit + padding} y={savedRect.rect.startRow * unit + padding} width={((savedRect.rect.endCol - savedRect.rect.startCol) * unit - 2 * padding)} height={(savedRect.rect.endRow - savedRect.rect.startRow) * unit - 2 * padding} />
                            <rect className={getExpandHandlesClass(index)} onTouchEnd={(e) => onUp(...getOffsetFromTouch(e))} onTouchMove={(e) => onMove(...getOffsetFromTouch(e))} onTouchStart={() => onExpand(index, [savedRect.rect.endRow, savedRect.rect.endCol], savedRect, [-1, -1])} onMouseDown={() => onExpand(index, [savedRect.rect.endRow, savedRect.rect.endCol], savedRect, [-1, -1])} fill={Colors.$primary} x={savedRect.rect.startCol * unit - unit / 10} y={savedRect.rect.startRow * unit - unit / 10} width={unit / 5} height={unit / 5} />
                            <rect className={getExpandHandlesClass(index)} onTouchEnd={(e) => onUp(...getOffsetFromTouch(e))} onTouchMove={(e) => onMove(...getOffsetFromTouch(e))} onTouchStart={() => onExpand(index, [savedRect.rect.startRow, savedRect.rect.endCol], savedRect, [-1, 1])} onMouseDown={() => onExpand(index, [savedRect.rect.startRow, savedRect.rect.endCol], savedRect, [-1, 1])} fill={Colors.$primary} x={savedRect.rect.startCol * unit - unit / 10} y={savedRect.rect.endRow * unit - unit / 5 + unit / 10} width={unit / 5} height={unit / 5} />
                            <rect className={getExpandHandlesClass(index)} onTouchEnd={(e) => onUp(...getOffsetFromTouch(e))} onTouchMove={(e) => onMove(...getOffsetFromTouch(e))} onTouchStart={() => onExpand(index, [savedRect.rect.endRow, savedRect.rect.startCol], savedRect, [1, -1])} onMouseDown={() => onExpand(index, [savedRect.rect.endRow, savedRect.rect.startCol], savedRect, [1, -1])} fill={Colors.$primary} x={savedRect.rect.endCol * unit - unit / 5 + unit / 10} y={savedRect.rect.startRow * unit - unit / 10} width={unit / 5} height={unit / 5} />
                            <rect className={getExpandHandlesClass(index)} onTouchEnd={(e) => onUp(...getOffsetFromTouch(e))} onTouchMove={(e) => onMove(...getOffsetFromTouch(e))} onTouchStart={() => onExpand(index, [savedRect.rect.startRow, savedRect.rect.startCol], savedRect, [1, 1])} onMouseDown={() => onExpand(index, [savedRect.rect.startRow, savedRect.rect.startCol], savedRect, [1, 1])} fill={Colors.$primary} x={savedRect.rect.endCol * unit - unit / 5 + unit / 10} y={savedRect.rect.endRow * unit - unit / 5 + unit / 10} width={unit / 5} height={unit / 5} />
                        </g>
                    )}
                </g>
            </svg>
        </div>
    )
}

export default Canvas