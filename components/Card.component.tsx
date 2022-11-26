"use client"
import Image from "next/image"
import { FunctionComponent, MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react"
import useWindowSize from "../hooks/useWidth"

import styles from "./Card.module.scss"
import TextEllipsis from "./Text-Ellipsis.component"

type CardValue = string | (() => JSX.Element)
export interface CardProps {
    values: CardValue[]
    titles?: string[]
    columnsSize?: number[]
    columnsSizeMobile?: number[]
    className?: string
}

const Card: FunctionComponent<CardProps> = ({ values, columnsSize = [], columnsSizeMobile = [], titles = [], className = "" }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [currentColumnSize, setCurrentColumnSize] = useState(columnsSize)
    const [windowsWidth] = useWindowSize()
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isExpanded) {
            setTimeout(() => { if (ref.current) ref.current!.blur() }, 200)
        }
    }, [isExpanded])

    useEffect(() => {
        if (windowsWidth < 768) {
            columnsSizeMobile.length ? setCurrentColumnSize(columnsSizeMobile) : setCurrentColumnSize(columnsSize)
        } else {
            setCurrentColumnSize(columnsSize)
        }
    }, [columnsSize, columnsSizeMobile, windowsWidth])

    const hasColumnOverflow = useMemo(() => {
        if (currentColumnSize.length) {
            const total = currentColumnSize.reduce((prev, current) => prev + current)
            return total > 12
        }

        return values.length >= 6
    }, [currentColumnSize, values.length])

    const getRowClassName = useMemo(() => {
        const base = styles.card
        const expanded = styles["card--expanded"]
        return `${base} ${isExpanded ? expanded : ""} ${className} row box p-3 m-0`
    }, [className, isExpanded])

    const getColumnClass = useCallback((index: number) => {
        const base = styles.card__column
        if (currentColumnSize.length) {
            return `${base} col-${currentColumnSize[index]} mb-3`
        } else {
            const number = Math.max((Math.floor(12 / values.length)), 3)
            return `${base} col-${number} mb-3`
        }
    }, [currentColumnSize, values.length])

    const onCardClick: MouseEventHandler = useCallback(({ type, isTrusted, target, currentTarget }) => {
        if (type === "click" && isTrusted === false && hasColumnOverflow) {
            setIsExpanded(prev => !prev)
        }
        if (type === "mousedown" && target === currentTarget && hasColumnOverflow) {
            setIsExpanded(prev => !prev)
        }
    }, [hasColumnOverflow])

    const renderCards = useCallback((values: CardValue[]) => {
        return values.map((value, index) => {
            if (typeof value === "string") {
                return (
                    <div key={index} className={getColumnClass(index)} >
                        {isExpanded && titles.length !== 0 && (<>
                            <div className="weight--bold mb-1">
                                {titles[index]}
                            </div>
                            <TextEllipsis onClick={() => setIsExpanded(prev => !prev)}>
                                {value}
                            </TextEllipsis>
                        </>)}
                        {!isExpanded && <div className="nowrap ellipsis">{value}</div>}
                    </div>
                )
            } else if (typeof value === "function") {
                return (
                    <div key={index} className={getColumnClass(index)} >
                        {isExpanded && titles.length !== 0 && <div className="weight--bold mb-1">{titles[index]}</div>}
                        {isExpanded && <div className={styles.card__component}>
                            {value()}
                        </div>}
                    </div>
                )
            }
        })

    }, [getColumnClass, isExpanded, titles])


    return (
        <div className={getRowClassName} ref={ref} onMouseDown={onCardClick} onClick={onCardClick} tabIndex={hasColumnOverflow ? 0 : -1}>
            {renderCards(values)}
            {hasColumnOverflow && <Image className={styles.card__chevron + " p-0 m-2"} onMouseDown={onCardClick} src={`/icons/chevron-${isExpanded ? "up" : "down"}-solid.svg`} width={24} height={24} alt={isExpanded ? "^" : "v"} />}
        </div>
    )
}

export default Card
