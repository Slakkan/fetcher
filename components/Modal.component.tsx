"use client"
import { Dispatch, FunctionComponent, MouseEventHandler, PropsWithChildren, SetStateAction, useEffect, useMemo, useState } from "react";
import { createPortal } from 'react-dom'
import styles from "./Modal.module.scss"

interface ModalProps {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const Modal: FunctionComponent<PropsWithChildren<ModalProps>> = ({ children, isOpen, setIsOpen }) => {
    const [container, setContainer] = useState<HTMLDivElement>()
    
    const onBackdropClick: MouseEventHandler<HTMLDivElement> = (e) => {
        if(e.target === e.currentTarget) {
            setIsOpen(false)
        }
    }
    
    const getModalClass = useMemo(() => {
        const base = styles.modal
        const open = styles["modal--open"]
        return `${base} ${isOpen ? open : ""}`
    }, [isOpen])
    

    useEffect(() => {
        const modalsContainer = document.querySelector<HTMLDivElement>("#modals")
        if(modalsContainer) {
            setContainer(modalsContainer)
        }
    },[])

    if(!container) return <></>

    return createPortal(
        <div id="modal" className={getModalClass} onClick={onBackdropClick}>
            <div className={styles.modal__container + " p-4 box"}>
                {children}
            </div>
        </div>
        , container)
}

export default Modal