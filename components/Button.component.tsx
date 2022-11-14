"use client"
import { FunctionComponent, MouseEventHandler, useMemo } from "react";
import Image from "next/image"

import styles from "./Button.module.scss"

export interface ButtonProps {
    text?: string,
    isSecondary?: boolean,
    isDisabled?: boolean,
    size?: "small" | "medium",
    onClick: MouseEventHandler,
    icon?: {
        src: string,
        alt: string,
        width: number,
        height: number
    }
}

const Button: FunctionComponent<ButtonProps> = ({ text, isSecondary, icon, onClick, size = "medium", isDisabled }) => {

    const getButtonClass = useMemo(() => {
        const base = styles.button
        const secondary = styles["button--secondary"]
        const small = 'px-2 py-1'
        const medium = 'px-3 py-2'
        const isSmall = size === "small"
        return `${base} ${isSecondary ? secondary : ""} ${isSmall ? small : medium}`
    }, [isSecondary, size])

    return (
        <button className={getButtonClass} onClick={onClick} disabled={isDisabled}>
            {text && <span>{text}</span>}
            {icon && <Image priority={true} {...icon} alt={icon.alt} />}
        </button>
    )
}

export default Button