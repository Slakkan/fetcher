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
    className?: string,
    icon?: {
        src: string,
        alt: string,
        width: number,
        height: number
    }
}

const Button: FunctionComponent<ButtonProps> = ({ text, isSecondary, icon, onClick, size = "medium", isDisabled, className = "" }) => {

    const getButtonClass = useMemo(() => {
        const base = styles.button
        const secondary = styles["button--secondary"]
        const small = 'px-2 py-1'
        const medium = 'px-3 py-2'
        const isSmall = size === "small"
        return `${base} ${isSecondary ? secondary : ""} ${className} ${isSmall ? small : medium}`
    }, [className, isSecondary, size])

    return (
        <button tabIndex={className.includes("dummy") ? -1 : 0} className={getButtonClass} onClick={onClick} disabled={isDisabled}>
            {text && <span>{text}</span>}
            {icon && <Image priority={true} {...icon} alt={icon.alt} />}
        </button>
    )
}

export default Button