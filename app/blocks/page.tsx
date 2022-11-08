"use client"
import { NextPage } from "next";
import { useCallback, useMemo, useRef, useState } from "react";

import styles from "./Blocks.module.scss"
import Button from "../../components/Button.component";
import InputText, { InputTextValidation } from "../../components/Input-Text.component";
import Modal from "../../components/Modal.component";
import { DefaultButton, getDefaultButton } from "../../utils/ui-utils";

const Blocks: NextPage = () => {
    const data = useRef({})
    const [isOpen, setIsOpen] = useState(false)

    const nameValidations = useMemo(() => [InputTextValidation.isRequired], [])
    const keyValidations = useMemo(() => [InputTextValidation.isRequired, InputTextValidation.isValidKey], [])

    const onNewHandler = useCallback(() => {
        setIsOpen(true)
    }, [])

    const onCreateHandler = useCallback(() => {

    }, [])

    return (
        <div className="container">
            <div className="d-flex justify-content-end my-4">
                <Button {...getDefaultButton(DefaultButton.ADD)} onClick={onNewHandler} />
                <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
                    <div className={styles.blocks__modal}>
                        <div className="d-flex flex-column">
                        <h3 className="d-flex justify-content-center m-0 mb-5">Create new Block</h3>
                            <div className="d-flex justify-content-between mb-3">
                                <label className="weight--bold pe-3" htmlFor="block-name">Name:</label>
                                <InputText id="block-name" keyName="name" validations={nameValidations} data={data.current} autocomplete="off" />
                            </div>
                            <div className="d-flex justify-content-between">
                                <label className="weight--bold pe-3" htmlFor="block-name">Key:</label>
                                <InputText id="block-key" keyName="keyName" validations={keyValidations} data={data.current} autocomplete="off" />
                            </div>
                        </div>
                        <div className="d-flex justify-content-around col-12">
                            <Button text="cancel" isSecondary={true} onClick={() => setIsOpen(false)} />
                            <Button text="create block" onClick={onCreateHandler} />
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default Blocks


