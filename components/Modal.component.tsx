"use client"
import React, { Dispatch, FunctionComponent, MouseEventHandler, PropsWithChildren, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from 'react-dom'

import styles from "./Modal.module.scss"

interface ModalProps {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    tabs?: string[],
    selectedTab?: string,
    setSelectedTab?: Dispatch<SetStateAction<string>>
}

const Modal: FunctionComponent<PropsWithChildren<ModalProps>> = ({ children, isOpen, setIsOpen, tabs, selectedTab, setSelectedTab }) => {
    const [container, setContainer] = useState<HTMLBodyElement>()
    const modal = useRef<HTMLDivElement>(null)

    const onBackdropClick: MouseEventHandler<HTMLDivElement> = (e) => {
        if (e.target === e.currentTarget) {
            setIsOpen(false)
        }
    }

    useEffect(() => {
        const modalsContainer = document.body! as HTMLBodyElement;
        setContainer(modalsContainer)
    }, [])

    const getTabClass = useCallback((tab: string) => {
        const base = styles.modal__tab
        const active = styles["modal__tab--active"]
        const isActive = tab === selectedTab
        return `${base} ${isActive ? active : ""} col-3 py-2`
    }, [selectedTab])

    useEffect(() => {
        if (isOpen && modal.current && container) {
            modal.current.focus();
            container.style.minHeight = (Math.max(modal.current.clientHeight + 150, container.clientHeight) - 1) + "px"
        } else if (!isOpen && container) {
            container.style.minHeight = "inherit"
        }
    }, [container, isOpen])

    if (!container) return <></>

    return createPortal(
        <>
            {isOpen &&
                <div id="modal" className={styles.modal} onMouseDown={onBackdropClick}>
                    <div ref={modal} tabIndex={0} className={styles.modal__container + " p-4 p-md-5 box"}>
                        {tabs && setSelectedTab && (
                            <div className={styles.modal__tabs}>
                                {tabs.map((tab) => <button className={getTabClass(tab)} onClick={() => setSelectedTab(tab)} key={tab}>{tab}</button>)}
                            </div>
                        )}
                        {children}
                    </div>
                </div>
            }
        </>
        , container);
}

export default Modal;
