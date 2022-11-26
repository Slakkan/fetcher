"use client"
import { FunctionComponent, MouseEventHandler, PropsWithChildren, useCallback, useRef, useState } from "react"
import useWindowSize from "../hooks/useWidth"
import { isOverflown } from "../utils/ui-utils"
import PopUp, { PopUpPosition } from "./Pop-Up.component"

import styles from "./Text-Ellipsis.module.scss"

interface TextEllipsisProps {
    onClick?: MouseEventHandler
}

const TextEllipsis: FunctionComponent<PropsWithChildren<TextEllipsisProps>> = ({ onClick, children }) => {
    const ref = useRef<HTMLDivElement>(null)
    const [isHovering, setIsHovering] = useState(false)

    const [isOverflowing, setIsOverflowing] = useState(false)

    const updateConditions = useCallback((isHovering: boolean) => {
        setIsOverflowing(isOverflown(ref.current!))
        setIsHovering(isHovering)
    }, [])

    return (
        <div className={styles.text} onMouseEnter={() => updateConditions(true)} onMouseLeave={() => updateConditions(false)}>
            <div ref={ref} className={styles.text__ellipsis} onClick={onClick}>
                {children}
            </div>
            <PopUp className="color--secondary p-2" position={PopUpPosition.BOTTOM} isOpen={isHovering && isOverflowing}>{children}</PopUp>
        </div>
    )
}

export default TextEllipsis