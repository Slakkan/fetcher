"use client"
import { FunctionComponent, MouseEventHandler, useMemo } from "react";
import Image from "next/image"

import styles from "./Button.module.scss"

export interface ButtonProps {
    text?: string,
    isSecondary?: boolean,
    onClick: MouseEventHandler,
    icon?: {
        src: string,
        alt: string,
        width: number,
        height: number
    }
}

const Button: FunctionComponent<ButtonProps> = ({ text, isSecondary,icon, onClick }) => {

    const getButtonClass = useMemo(() => {
        const base = styles.button
        const secondary = styles["button--secondary"]
        return `${base} ${isSecondary ? secondary : ""} px-3 py-1 box`
    },[isSecondary])

    return (
        <div className={getButtonClass} onClick={onClick}>
            {text && <span>{text}</span>}
            {icon && <Image priority={true} {...icon} alt={icon.alt} />}
        </div>
    )
}

export default Button