"use client"
import { Dispatch, FocusEventHandler, FunctionComponent, PropsWithChildren, SetStateAction, useEffect, useMemo, useRef } from "react"
import useDebounce from "../hooks/useDebounce"

import styles from "./Pop-Up.module.scss"

interface PopUpProps {
    position?: PopUpPosition,
    isOpen: boolean,
    setIsOpen?: Dispatch<SetStateAction<boolean>>
    className?: string
    onBlur?: FocusEventHandler
    autoFocus?: boolean
}

export enum PopUpPosition {
    RIGHT = "right",
    LEFT = "left",
    TOP = "top",
    BOTTOM = "bottom",
    BOTTOM_RIGHT = "bottom-right"
}

const PopUp: FunctionComponent<PropsWithChildren<PopUpProps>> = ({ position = PopUpPosition.RIGHT, isOpen, setIsOpen, children, className = "", autoFocus = false, onBlur = () => { } }) => {
    const ref = useRef<HTMLDivElement>(null)
    const [isOpenDebounced] = useDebounce(isOpen, 200)

    useEffect(() => {
        const handler = (e: globalThis.MouseEvent) => {
            if (isOpenDebounced && setIsOpen && e.target instanceof HTMLElement && ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        window.addEventListener("click", handler);
        return () => window.removeEventListener("click", handler);
    }, [isOpenDebounced, setIsOpen]);


    useEffect(() => {
        if (ref.current && isOpen && autoFocus) {
            ref.current.focus()
        }
    }, [autoFocus, isOpen])

    const getPopupClass = useMemo(() => {
        const base = styles.popup
        const open = styles["popup--open"] + " " + className
        const popPosition = styles[`popup--${position}`]
        return `${base} ${isOpen ? open : ""} ${popPosition} box`
    }, [className, isOpen, position])

    return (
        <div ref={ref} className={getPopupClass} onBlur={onBlur} tabIndex={0}>
            {children}
        </div>
    )
}

export default PopUp