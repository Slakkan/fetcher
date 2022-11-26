"use client"
import { FunctionComponent, useCallback, useContext, useEffect, useMemo, useState } from "react";

import Button from "../../components/Button.component";
import InputText, { InputTextValidation } from "../../components/inputs/Input-Text.component";
import Modal from "../../components/Modal.component";
import { DefaultButton, getDefaultButton, getValuesFromSnapshot } from "../../utils/ui-utils";
import { authClient, dbClient } from "../../utils/firebase-client";
import { ref, push, orderByChild, query, equalTo, onValue, get, limitToFirst, remove, Unsubscribe } from "firebase/database";
import { Block } from "../../models/Block.model";
import { checkForErrors } from "../../utils/validation-utils";
import Card from "../../components/Card.component";
import Loading from "../../components/Loading.component";
import Dialog from "../../components/Dialog.component";
import Link from "next/link";
import { InputErrors } from "../../models/Input.model";
import InputCheckbox from "../../components/inputs/Input-Checkbox.component";
import Image from "next/image";
import PopUp, { PopUpPosition } from "../../components/Pop-Up.component";
import useKebab from "../../hooks/useKebab";
import { useRouter } from "next/navigation";
import { FirebaseContext } from "../../components/Firebase-Provider.component";

const Blocks: FunctionComponent = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
    const [isRemovingIndex, setIsRemovingIndex] = useState<number | undefined>()
    const [openKebabIndex, onKebabClick] = useKebab()
    const [data, setData] = useState<Record<string, any>>({})
    const [dataErrors, setDataErrors] = useState<InputErrors[]>([])
    const [blocks, setBlocks] = useState<Block[]>([])
    const [blockKeys, setBlockKeys] = useState<string[]>([])
    const [blocksLoaded, setBlocksLoaded] = useState(false)
    const copyTarget = useMemo(() => data["isCustomKeyName"] ? "" : "name", [data])
    const router = useRouter()
    const { openProjectId, isNotLoggedIn } = useContext(FirebaseContext)
    const [dataFetchErrors, setDataFetchErrors] = useState<string>("")

    const nameValidations = useMemo(() => [InputTextValidation.isRequired], [])
    const keyValidations = useMemo(() => [InputTextValidation.isRequired, InputTextValidation.isValidKey], [])

    const onNewHandler = useCallback(() => {
        setIsOpen(true)
    }, [])

    useEffect(() => {
        // clear data each time the user closes the modal
        if (!isOpen) setData({});
    }, [isOpen])


    // get latest blocks for user
    useEffect(() => {
        if (!openProjectId) return;
        let unsubscribe: Unsubscribe | undefined
        const blockQuery = query(ref(dbClient, "blocks"), orderByChild("project"), equalTo(openProjectId), limitToFirst(1000))
        unsubscribe = onValue(blockQuery, (snapshot) => {
            const [blockKeys, blocks] = getValuesFromSnapshot<Block>(snapshot)
            setBlockKeys(blockKeys)
            setBlocks(blocks)
            setBlocksLoaded(true)
        }, (error) => {
            setDataFetchErrors(error.message)
        })
        return unsubscribe
    }, [openProjectId])

    const onCreateHandler = useCallback(async () => {
        if (!authClient.currentUser) return;
        if (checkForErrors(dataErrors)) return;

        const { name, keyName } = data;

        await push(ref(dbClient, "blocks"), {
            name,
            keyName,
            project: openProjectId,
        })

        setIsOpen(false)
    }, [data, dataErrors, openProjectId])

    const onEditHandler = useCallback((index: number) => {
        router.push(`/design/${blockKeys[index]}`)
    }, [blockKeys, router])

    const onRemoveHandler = useCallback((removedIndex: number) => {
        setIsRemovingIndex(removedIndex)
        setIsRemoveModalOpen(true)
    }, [])

    const onRemoveConfirm = useCallback(() => {
        const uid = blockKeys[isRemovingIndex!]
        setIsRemovingIndex(undefined)
        setIsRemoveModalOpen(false)
        remove(ref(dbClient, `blocks/${uid}`))
    }, [blockKeys, isRemovingIndex])

    return (<div className={"container content-container background--white py-5 px-sm-4 p-md-5"}>
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <h3 className="text-align--center mt-0 mb-5">Design new Block</h3>
            <div className="row justify-content-center my-2 my-md-0">
                <div className="col-2 py-2 py-md-0">
                    <label className="weight--bold text-align--end" htmlFor="block-name">Name:</label>
                </div>
                <div className="col-6 col-sm-5 col-lg-4">
                    <InputText keyName="name" validations={nameValidations} data={data} setData={setData} dataErrors={dataErrors} setDataErrors={setDataErrors} autocomplete="off" />
                </div>
                <div className="col-4"></div>
            </div>
            <div className="row justify-content-center my-2 my-md-0">
                <div className="col-2 py-2 py-md-0">
                    <label className="weight--bold text-align--end" htmlFor="block-key">Key:</label>
                </div>
                <div className="col-6 col-sm-5 col-lg-4">
                    <InputText keyName="keyName" validations={keyValidations} data={data} setData={setData} dataErrors={dataErrors} setDataErrors={setDataErrors} autocomplete="off" copyTarget={copyTarget} disabled={!!copyTarget} validateDisabled={true} />
                </div>
                <div className="col-4">
                    <InputCheckbox keyName="isCustomKeyName" data={data} setData={setData} id="keyname-checkbox">
                        <span className="hint">custom key?</span>
                    </InputCheckbox>
                </div>
            </div>
            <div className="d-flex align-items-end justify-content-around col-12 pt-3">
                <Button text="Cancel" isSecondary={true} onClick={() => setIsOpen(false)} />
                <Button text="Create Block" onClick={onCreateHandler} />
            </div>
        </Modal>
        {isNotLoggedIn && !blocksLoaded && (
            <Dialog>
                <h3>Woof! Woof! <br />
                    You have to be logged in to use this page, woof!
                </h3>
            </Dialog>
        )}
        {!isNotLoggedIn && !blocksLoaded && (
            <div className="loading-container my-5">
                <Loading size="big" />
            </div>
        )}
        {blocksLoaded && dataFetchErrors && (
            <Dialog>
                <h3>Awoo? <br />
                    Seems something went wrong, woof! <br /> <br />
                </h3>
                <a href={`mailto:tompasoft@gmail.com?subject=Fetcher%20bug&body=${dataFetchErrors}`}>Click here and let us know</a>
            </Dialog>
        )}
        {blocksLoaded && !dataFetchErrors && (
            <>
                <div className="col-12 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-end">
                        <Image className="me-3" src="/icons/blocks.svg" alt="blocks.svg" width={48} height={48} />
                        <h2 className="weight--normal m-0">Blocks design</h2>
                    </div>
                    <Button {...getDefaultButton(DefaultButton.ADD)} onClick={onNewHandler} />
                </div>
                {blocks.length === 0 && (
                    <Dialog>
                        <h3 className="">Woof! Woof! <br />
                            You have no blocks... <br /> <br />
                            You can create some with the plus button, woof!</h3>
                    </Dialog>
                )}
                {blocks.length !== 0 && (
                    <>
                        <div className="d-flex justify-content-end">
                        </div>
                        <div className="d-flex align-items-end">
                            <div className="row m-0 p-3 pb-0 me-3" style={{ flexGrow: 1 }}>
                                <div className="col-6 col-md-3 weight--bold">Name</div>
                                <div className="col-6 col-md-3 weight--bold">Key</div>
                                <div className="d-none d-md-block col-6 weight--bold">Fields</div>
                            </div>
                            <Button className="dummy mt-2 d-none d-md-block" {...getDefaultButton(DefaultButton.REMOVE, 26)} />
                            <Button className="dummy mt-2 d-none d-md-block" {...getDefaultButton(DefaultButton.EDIT, 26)} />
                            <Button className="dummy d-block d-md-none" {...getDefaultButton(DefaultButton.KEBAB, 26)} />
                        </div>
                        <div className="background--alternating">
                            {blocks.map(({ name, keyName, fields }, index) => (
                                <div key={blockKeys[index]} className="d-flex align-items-start my-4">
                                    <Link className="no-underline me-3" style={{ flexGrow: 1, width: 0 }} href={`/design/${blockKeys[index]}`}>
                                        <Card values={[name, keyName, (fields ?? []).map(field => field.name).join(", ")]} columnsSize={[3, 3, 6]} columnsSizeMobile={[6, 6]} />
                                    </Link>
                                    <Button className="d-none d-md-block me-2" {...getDefaultButton(DefaultButton.REMOVE, 26)} onClick={() => onRemoveHandler(index)} />
                                    <Button className="d-none d-md-block" {...getDefaultButton(DefaultButton.EDIT, 26)} onClick={() => onEditHandler(index)} />
                                    <div className="d-block d-md-none" style={{ position: "relative" }}>
                                        <Button className="d-block d-md-none" {...getDefaultButton(DefaultButton.KEBAB, 24)} onClick={(e) => onKebabClick(e, index)} />
                                        <PopUp className="d-flex p-2" position={PopUpPosition.LEFT} isOpen={index === openKebabIndex} autoFocus={true}>
                                            <Button className="me-2" size="small" {...getDefaultButton(DefaultButton.REMOVE, 21)} onClick={() => onRemoveHandler(index)} />
                                            <Button className="m-0" size="small" {...getDefaultButton(DefaultButton.EDIT, 21)} onClick={() => onEditHandler(index)} />
                                        </PopUp>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <Modal isOpen={isRemoveModalOpen} setIsOpen={setIsRemoveModalOpen} >
                    {isRemovingIndex !== undefined && (
                        <>
                            <div className="row justify-content-center">
                                <h3 className="col-12 text-align--center mb-3">Are you sure you want to delete the following field: </h3>
                            </div>
                            <div className="row justify-content-center">
                                <div className="col-2">name: </div>
                                <div className="col-6 ellipsis nowrap">{blocks[isRemovingIndex].name}</div>
                            </div>
                            <div className="row justify-content-center">
                                <div className="col-2">key: </div>
                                <div className="col-6 ellipsis nowrap">{blocks[isRemovingIndex].keyName}</div>
                            </div>
                        </>
                    )}
                    <div className="d-flex align-items-end justify-content-around col-12 pt-3" style={{ flexGrow: 0 }}>
                        <Button text="Cancel" isSecondary={true} onClick={() => setIsRemoveModalOpen(false)} />
                        <Button text="Remove Field" onClick={onRemoveConfirm} />
                    </div>
                </Modal>
            </>
        )}
    </div>
    )
}

export default Blocks


