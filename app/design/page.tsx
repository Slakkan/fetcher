"use client"
import { NextPage } from "next";
import { useCallback, useEffect, useMemo, useState } from "react";

import styles from "./Design.module.scss"
import Button from "../../components/Button.component";
import InputText, { InputTextValidation } from "../../components/inputs/Input-Text.component";
import Modal from "../../components/Modal.component";
import { DefaultButton, getDefaultButton, getValuesFromSnapshot } from "../../utils/ui-utils";
import { authClient, dbClient } from "../../utils/firebase-client";
import { ref, push, orderByChild, query, equalTo, onValue, get, limitToFirst } from "firebase/database";
import { Block } from "../../models/Block.model";
import { checkForErrors, isObjectNotEmpty } from "../../utils/validators";
import Card from "../../components/Card.component";
import { onAuthStateChanged, Unsubscribe } from "firebase/auth";
import Loading from "../../components/Loading.component";
import { Project } from "../../models/Project";
import Dialog from "../../components/Dialog.component";
import Link from "next/link";
import { InputErrors } from "../../models/Input.model";
import InputCheckbox from "../../components/inputs/Input-Checkbox.component";

const Blocks: NextPage = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [data, setData] = useState<Block & Record<string, any> | {}>({})
    const [dataErrors, setDataErrors] = useState<InputErrors[]>([])
    const [openProjectId, setOpenProjectId] = useState("")
    const [openProject, setOpenProject] = useState<Project>()
    const [blocks, setBlocks] = useState<Block[]>([])
    const [blockKeys, setBlockKeys] = useState<string[]>([])
    const [blocksLoaded, setBlocksLoaded] = useState(false)
    const [userLoaded, setUserLoaded] = useState(false)
    const copyTarget = useMemo(() => isObjectNotEmpty(data) && data["isCustomKeyName"] ? "" : "name", [data])

    const nameValidations = useMemo(() => [InputTextValidation.isRequired], [])
    const keyValidations = useMemo(() => [InputTextValidation.isRequired, InputTextValidation.isValidKey], [])

    const onNewHandler = useCallback(() => {
        setIsOpen(true)
    }, [])

    useEffect(() => {
        // clear data each time the user closes the modal
        if (!isOpen) setData({});
    }, [isOpen])

    // Listens for openProject changes
    useEffect(() => {
        const unsubscribe: Unsubscribe[] = []
        const unsubscribeAuth = onAuthStateChanged(authClient, () => {
            setUserLoaded(true)
            if (authClient.currentUser) {
                const { uid } = authClient.currentUser
                const unsubscribeOpenProject = onValue(ref(dbClient, `users/${uid}/openProject`), (snapshot) => {
                    setOpenProjectId(snapshot.val())
                })
                unsubscribe.push(unsubscribeOpenProject)
            }
        })
        unsubscribe.push(unsubscribeAuth)
        return () => unsubscribe.forEach(unsub => unsub())
    })

    // get latest blocks for user
    useEffect(() => {
        if (!openProjectId) return;
        get(ref(dbClient, `projects/${openProjectId}`)).then(snapshot => setOpenProject(snapshot.val()))
        const blockQuery = query(ref(dbClient, "blocks"), orderByChild("project"), equalTo(openProjectId), limitToFirst(15))
        const unsubscribe = onValue(blockQuery, (snapshot) => {
            const [blockKeys, blocks] = getValuesFromSnapshot<Block>(snapshot)
            setBlockKeys(blockKeys)
            setBlocks(blocks)
            setBlocksLoaded(true)
        })
        return unsubscribe
    }, [openProjectId])

    const onCreateHandler = useCallback(async () => {
        if (!isObjectNotEmpty(data)) return;
        if (!authClient.currentUser) return;
        if (checkForErrors(dataErrors)) return;

        const { name, keyName } = data;

        await push(ref(dbClient, "blocks"), {
            name,
            keyName,
            project: openProjectId,
            fields: []
        })

        setIsOpen(false)
    }, [data, dataErrors, openProjectId])

    return (<>
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <h3 className="text-align--center mt-0 mb-5">Design new Block</h3>
            <div className="row justify-content-center my-2 my-md-0">
                <div className="col-2 py-2 py-md-0">
                    <label className="weight--bold text-align--end" htmlFor="block-name">Name:</label>
                </div>
                <div className="col-6 col-sm-5 col-lg-4">
                    <InputText id="block-name" keyName="name" validations={nameValidations} data={data} setData={setData} setDataErrors={setDataErrors} autocomplete="off" />
                </div>
                <div className="col-4"></div>
            </div>
            <div className="row justify-content-center my-2 my-md-0">
                <div className="col-2 py-2 py-md-0">
                    <label className="weight--bold text-align--end" htmlFor="block-key">Key:</label>
                </div>
                <div className="col-6 col-sm-5 col-lg-4">
                    <InputText id="block-key" keyName="keyName" validations={keyValidations} data={data} setData={setData} setDataErrors={setDataErrors} autocomplete="off" copyTarget={copyTarget} disabled={!!copyTarget} />
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
        {!blocksLoaded && userLoaded && !authClient.currentUser && (
            <Dialog>
                <h3>Woof! Woof! <br />
                    You have to be logged in to use this page, woof!</h3>
            </Dialog>
        )}
        {!blocksLoaded && userLoaded && authClient.currentUser && (
            <div className="loading-container my-5">
                <Loading size="big" />
            </div>
        )}
        {blocksLoaded && (
            <div className={styles.blocks + " container"}>
                <div className="row mb-3">
                    <div className="col-12 d-flex justify-content-between align-items-center">
                        <h2>{openProject!.name}</h2>
                        <Button {...getDefaultButton(DefaultButton.ADD)} onClick={onNewHandler} />
                    </div>
                </div>
                {blocks.length !== 0 && (
                    <>
                        <div className="row">
                            <div className="col-6 weight--bold">Name</div>
                            <div className="col-6 weight--bold">Key</div>
                        </div>
                        {blocks.map(({ name, keyName }, index) => <Link key={blockKeys[index]} className="no-underline my-2" href={`/design/${blockKeys[index]}`}><Card values={[name, keyName]} /></Link>)}
                    </>
                )}
            </div>
        )}
    </>
    )
}

export default Blocks


