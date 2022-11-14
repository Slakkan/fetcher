import { FunctionComponent, useCallback } from "react"

import styles from "./Card.module.scss"

export interface CardProps {
    values: any[]
    columnsSize?: number[]
}

const Card: FunctionComponent<CardProps> = ({ values, columnsSize = [] }) => {

    const getColumnClass = useCallback((index: number) => {
        const base = styles.card__column
        if (columnsSize.length) {
            return `${base} col-${columnsSize[index]}`
        } else {
            const number = Math.floor(12 / values.length)
            return `${base} col-${number}`
        }
    }, [columnsSize, values.length])

    return (
        <div className={styles.card + " row g-0 box p-3"}>
            {values.map((value, index) => (
                <div key={index} className={getColumnClass(index)} >
                    {value}
                </div>
            ))}
        </div>
    )
}

export default Card
