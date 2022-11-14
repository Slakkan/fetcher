"use client"
import Image from "next/image"
import Link from "next/link"
import { FunctionComponent, KeyboardEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react"

import styles from "./Design-Edit.module.scss"
import Button from "../../../components/Button.component"
import { DefaultButton, getDefaultButton } from "../../../utils/ui-utils"
import { get, ref } from "firebase/database"
import { dbClient } from "../../../utils/firebase-client"
import { Block, Field } from "../../../models/Block.model"
import Loading from "../../../components/Loading.component"
import Modal from "../../../components/Modal.component"
import InputText, { InputTextValidation } from "../../../components/inputs/Input-Text.component"
import InputFrame from "../../../components/inputs/Input-Frame.component"
import { InputErrors } from "../../../models/Input.model"
import InputCheckbox from "../../../components/inputs/Input-Checkbox.component"
import { isObjectNotEmpty } from "../../../utils/validators"
import InputRadio from "../../../components/inputs/Input-Radio.component"
import InputList from "../../../components/inputs/Input-List.component"
import InputDropdown from "../../../components/inputs/Input-Dropdown.component"
import Types from "./Types.component"
import Validations from "./Validations.component"
import Display from "./Display.component"

const EditBlock: FunctionComponent<{ params: { blockId: string } }> = ({ params }) => {
    const [data, setData] = useState<Field & Record<string, any> | {}>({})
    const [dataErrors, setDataErrors] = useState<InputErrors[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [block, setBlock] = useState<Block>()
    const modalTabs = useMemo(() => ["Types", "Validations", "Display"], [])
    const [selectedTab, setSelectedTab] = useState<string>("Types");


    useEffect(() => {
        get(ref(dbClient, `blocks/${params.blockId}`)).then(snapshot => setBlock(snapshot.val()))
    })

    const onNewHandler = () => {
        setIsOpen(true)
    }

    return (
        <>
            <Modal isOpen={isOpen} setIsOpen={setIsOpen} tabs={modalTabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab}>
                {selectedTab === "Types" && (
                    <Types data={data} setData={setData} setDataErrors={setDataErrors} />
                )}
                {selectedTab === "Validations" && (
                    <Validations data={data} setData={setData} setDataErrors={setDataErrors} />
                )}
                {selectedTab === "Display" && (
                    <Display data={data} setData={setData} />
                )}
            </Modal>
            {!block && (
                <div className="loading-container">
                    <Loading size="big" />
                </div>
            )}
            {block && (
                <div className="container">
                    <div className="row">
                        <div className="col-12 d-flex justify-content-between align-items-center">
                            <div className={styles.editor__navigation}>
                                <h3 className="weight--normal"><Link className="link" href="/design">Design</Link></h3>
                                <Image className="mt-1 mx-2" src="/icons/angle-right-solid.svg" alt=">" width={14} height={22} />
                                <h3 className="weight--normal"><Link className="link" href={`/design/${params.blockId}`}>{block.name}</Link></h3>
                            </div>
                            <Button {...getDefaultButton(DefaultButton.ADD)} onClick={onNewHandler} />
                        </div>
                    </div>
                </div>

            )}
        </>
    )
}

export default EditBlock