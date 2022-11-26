"use client"
import Image from "next/image"
import { FunctionComponent, KeyboardEventHandler, useCallback, useContext, useEffect, useMemo, useState } from "react"

import Button from "../../../components/Button.component"
import { DefaultButton, getDefaultButton } from "../../../utils/ui-utils"
import { get, onValue, ref, update } from "firebase/database"
import { dbClient } from "../../../utils/firebase-client"
import { Block, EditField, Field, FieldType, FieldValidations } from "../../../models/Block.model"
import Loading from "../../../components/Loading.component"
import Modal from "../../../components/Modal.component"
import { InputErrors } from "../../../models/Input.model"
import Types from "./Types.component"
import Validations from "./Validations.component"
import Display from "./Display.component"
import { checkForErrors, convertValidationsToTextList, removeNullOrUndefinedProperties } from "../../../utils/validation-utils"
import Card from "../../../components/Card.component"
import PopUp, { PopUpPosition } from "../../../components/Pop-Up.component"
import useKebab from "../../../hooks/useKebab"
import { convertDisplayToSavedData, getDefaultDisplay, mapDisplayIntoComponent } from "../../../utils/display.utils"
import Dialog from "../../../components/Dialog.component"
import Pagination from "../../../components/Pagination.component"
import { FirebaseContext } from "../../../components/Firebase-Provider.component"



const EditBlock: FunctionComponent<{ params: { blockId: string } }> = ({ params }) => {
    const [data, setData] = useState<EditField>({} as EditField)
    const [dataErrors, setDataErrors] = useState<InputErrors[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number>()
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
    const [removingIndex, setRemovingIndex] = useState<number>()
    const [block, setBlock] = useState<Block>()
    const modalTabs = useMemo(() => ["Types", "Validations", "Display"], [])
    const [selectedTab, setSelectedTab] = useState<string>("Types");
    const [isEditLoading, setIsEditLoading] = useState(false)
    const [keyNameBlackList, setKeyNameBlacklist] = useState<string[]>([])
    const [openKebabIndex, onKebabClick] = useKebab()
    const [previousType, setPreviousType] = useState<FieldType | undefined>()
    const { isNotLoggedIn } = useContext(FirebaseContext)
    const [dataFetchErrors, setDataFetchErrors] = useState("")

    const getKeynameBlacklist = useCallback((block: Block, keyName: string) => {
        const { fields = [] } = block
        const notThisField = fields.filter(field => field.keyName !== keyName)
        const blackList = notThisField.map(field => field.keyName)


        return blackList
    }, [])

    useEffect(() => {
        const unsubscribe = onValue(ref(dbClient, `blocks/${params.blockId}`), (snapshot) => {
            setBlock(snapshot.val())
        }, (error) => {
            setDataFetchErrors(error.message)
        })
        return unsubscribe
    }, [params.blockId])

    useEffect(() => {
        if (!isOpen && isEditMode) {
            setIsEditMode(false)
            setData({} as EditField)
            setDataErrors([])
        }
    }, [isEditMode, isOpen])

    const getFieldFromData: () => Field = useCallback(() => {
        const { name, keyName, type } = data

        const { allowedValues } = data.isAllowedValues ? data : { allowedValues: undefined }
        const { matchRegexp } = data.isMatchRegexp ? data : { matchRegexp: undefined }
        const { maxLength } = data.isMaxLength ? data : { maxLength: undefined }
        const { greaterThan } = data.isGreater ? data : { greaterThan: undefined }
        const { lowerThan } = data.isLower ? data : { lowerThan: undefined }

        const display = data.display ?? getDefaultDisplay(type)

        let validations: FieldValidations = {}
        if (type === FieldType.text) {
            const { isRequired, isMaxLength, isMatchRegexp, isAllowedValues } = data
            validations = { isRequired, isMaxLength, isMatchRegexp, isAllowedValues }
        } else if (type === FieldType.number) {
            const { isRequired, isInteger, isGreater, isLower } = data
            validations = { isRequired, isInteger, isGreater, isLower }
        } else if (type === FieldType.boolean) {
            const { isRequired } = data
            validations = { isRequired }
        } else if (type === FieldType.media) {
            const { isRequired } = data
            validations = { isRequired }
        } else if (type === FieldType.block) {
            const { isRequired } = data
            validations = { isRequired }
        }

        Object.entries(validations).forEach(([key, value]) => {
            (validations as Record<string, any>)[key] = !!value
        })

        const newField: Field = {
            name,
            keyName,
            type,
            validations,
            display,
            allowedValues,
            matchRegexp,
            maxLength,
            greaterThan,
            lowerThan
        }

        return removeNullOrUndefinedProperties(newField)
    }, [data])

    const onNewHandler = () => {
        const keyNameBlacklist = getKeynameBlacklist(block!, "")
        setPreviousType(FieldType.text)
        setKeyNameBlacklist(keyNameBlacklist)
        setIsOpen(true)
    }

    const onEditHandler = useCallback(async (index: number) => {
        setIsEditLoading(true)
        const snapshot = await get(ref(dbClient, `blocks/${params.blockId}/fields/${index}`))
        const savedField: Field = snapshot.val()
        setEditingIndex(index)
        setIsEditMode(true)
        setIsOpen(true)

        setPreviousType(savedField.type)

        const savedDataDisplay = convertDisplayToSavedData(savedField)

        const savedData = { ...savedDataDisplay, ...savedField.validations, }

        const keyNameBlacklist = getKeynameBlacklist(block!, savedField.keyName)
        setKeyNameBlacklist(keyNameBlacklist)
        setData(savedData)
        setIsEditLoading(false)
    }, [block, getKeynameBlacklist, params.blockId])

    const navigateToTabWithErrors = useCallback(() => {
        const formsWithErrors: string[] = []

        const newDataErrors = [...dataErrors]

        dataErrors.forEach((dataError, index) => {
            if (dataError.errors.length && dataError.formKeyName) {
                formsWithErrors.push(dataError.formKeyName)
                newDataErrors[index].showErrors = true
            }
        })

        setDataErrors(newDataErrors)

        if (formsWithErrors.includes("Types")) {
            setSelectedTab("Types")
        } else if (formsWithErrors.includes("Validations")) {
            setSelectedTab("Validations")
        } else if (formsWithErrors.includes("display")) {
            setSelectedTab("display")
        }
    }, [dataErrors])

    const onSaveHandler = useCallback(() => {
        if (checkForErrors(dataErrors)) return navigateToTabWithErrors();

        const newField = getFieldFromData()
        const newBlock: Block = { ...block! }
        newBlock.fields! = newBlock.fields!.map((field, index) => {
            if (index === editingIndex) {
                return newField
            } else {
                return field
            }
        })

        update(ref(dbClient, `blocks/${params.blockId}`), newBlock)
        setIsOpen(false)
        setSelectedTab("Types")
    }, [block, dataErrors, editingIndex, getFieldFromData, navigateToTabWithErrors, params.blockId])

    const onCreateHandler = useCallback(() => {
        if (checkForErrors(dataErrors)) return navigateToTabWithErrors();

        const newField = getFieldFromData()
        const { fields = [] } = block as Block
        fields.push(newField)

        update(ref(dbClient, `blocks/${params.blockId}`), { fields })
        setIsOpen(false)
        setData({} as EditField)
        setDataErrors([])
        setSelectedTab("Types")
    }, [block, dataErrors, getFieldFromData, navigateToTabWithErrors, params.blockId])

    const onRemoveHandler = useCallback((removedIndex: number) => {
        setRemovingIndex(removedIndex)
        setIsRemoveModalOpen(true)
    }, [])

    const onRemoveConfirm = useCallback(() => {
        setRemovingIndex(undefined)
        setIsRemoveModalOpen(false)
        const newBlock: Block = { ...block! }
        newBlock.fields = newBlock.fields!.filter((field, index) => index !== removingIndex)
        update(ref(dbClient, `blocks/${params.blockId}`), newBlock)
    }, [block, params.blockId, removingIndex])

    const onEnterKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
        if (e.key === "Enter" && e.target instanceof HTMLDivElement) {
            const child = e.target.children[0] as HTMLDivElement
            child.click()
        }
    }, [])


    useEffect(() => {
        setPreviousType(data.type)
    }, [data.type])


    useEffect(() => {
        if (previousType && data.type && data.type !== previousType) {
            setData((prev) => {
                return ({ name: prev.name, keyName: prev.keyName, type: prev.type } as EditField)
            })
        }
    }, [data, previousType])

    return (
        <>
            <Modal isOpen={isOpen} setIsOpen={setIsOpen} tabs={modalTabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab}>
                {isEditLoading && <Loading />}
                {block && selectedTab === "Types" && (
                    <Types data={data} setData={setData} dataErrors={dataErrors} setDataErrors={setDataErrors} block={block} keyNameBlackList={keyNameBlackList} />
                )}
                {!isEditLoading && selectedTab === "Validations" && (
                    <Validations data={data} setData={setData} dataErrors={dataErrors} setDataErrors={setDataErrors} />
                )}
                {!isEditLoading && selectedTab === "Display" && (
                    <Display data={data} setData={setData} dataErrors={dataErrors} setDataErrors={setDataErrors} />
                )}
                {!isEditLoading && (
                    <div className="d-flex align-items-end justify-content-around col-12 pt-3">
                        <Button text="Cancel" isSecondary={true} onClick={() => setIsOpen(false)} />
                        {!isEditMode && <Button text="Create Field" onClick={onCreateHandler} />}
                        {isEditMode && <Button text="Save Field" onClick={onSaveHandler} />}
                    </div>)}
            </Modal>
            {!block && isNotLoggedIn && (
                <Dialog>
                    <h3>Woof! Woof! <br />
                        You have to be logged in to use this page, woof!</h3>
                </Dialog>
            )}
            {!block && !isNotLoggedIn && !dataFetchErrors && (
                <div className="loading-container my-5">
                    <Loading size="big" />
                </div>
            )}
            {!block && !isNotLoggedIn && dataFetchErrors && (
                <Dialog>
                    <h3>Awoo? <br />
                        Seems something went wrong, woof! <br /> <br />
                    </h3>
                    <a href={`mailto:tompasoft@gmail.com?subject=Fetcher%20bug&body=${dataFetchErrors}`}>Click here and let us know</a>
                </Dialog>
            )}
            {block && (
                <div className="container content-container background--white py-5 px-sm-4 p-md-5">
                    <div className="row mb-3">
                        <div className="col-12 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-end">
                                <Image className="me-3" src="/icons/fields.svg" alt="Fields.svg" width={48} height={48} />
                                <h2 className="weight--normal m-0">Fields design</h2>
                            </div>
                            <Button {...getDefaultButton(DefaultButton.ADD)} onClick={onNewHandler} />
                        </div>
                    </div>
                    {!block.fields && (
                        <Dialog>
                            <h3>Woof! Woof! <br />
                                You have no fields... <br /> <br />
                                You can create some with the plus button, woof!</h3>
                        </Dialog>
                    )}
                    {block.fields && block.fields.length !== 0 && (
                        <>
                            <div className="d-flex align-items-end">
                                <div className="row p-3 pb-0 m-0 me-3" style={{ flexGrow: 1 }}>
                                    <div className="col-4 col-md-3 weight--bold">Name</div>
                                    <div className="col-4 col-md-3 weight--bold">Key</div>
                                    <div className="col-4 col-md-3 weight--bold">Type</div>
                                    <div className="d-none d-md-block col-md-3 weight--bold">Display</div>
                                </div>
                                <Button className="dummy d-none d-md-block" {...getDefaultButton(DefaultButton.REMOVE, 26)} />
                                <Button className="dummy d-none d-md-block" {...getDefaultButton(DefaultButton.EDIT, 26)} />
                                <Button className="dummy d-block d-md-none" {...getDefaultButton(DefaultButton.KEBAB, 26)} />
                            </div>
                            <Pagination itemsPerPage={5}>
                                {block.fields.map((field, index) => {
                                    const { name, keyName, type, display, validations } = field
                                    return (
                                        <div key={keyName} className="d-flex align-items-start my-3" onKeyDown={onEnterKeyDown}>
                                            <Card className="me-3" titles={["Name", "Key", "Type", "Display", "Validations", "Result"]} values={[name, keyName, type, display, convertValidationsToTextList(validations, field), () => mapDisplayIntoComponent(field)]} columnsSize={[3, 3, 3, 3, 6, 6]} columnsSizeMobile={[4, 4, 4, 4, 8, 12]} />
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
                                    )
                                }
                                )}
                            </Pagination>
                            <Modal isOpen={isRemoveModalOpen} setIsOpen={setIsRemoveModalOpen} >
                                {removingIndex !== undefined && (
                                    <>
                                        <div className="row justify-content-center">
                                            <h3 className="col-12 text-align--center mb-3">Are you sure you want to delete the following field: </h3>
                                        </div>
                                        <div className="row justify-content-center">
                                            <div className="col-2">name: </div>
                                            <div className="col-6 ellipsis nowrap">{block.fields[removingIndex].name}</div>
                                        </div>
                                        <div className="row justify-content-center">
                                            <div className="col-2">key: </div>
                                            <div className="col-6 ellipsis nowrap">{block.fields[removingIndex].keyName}</div>
                                        </div>
                                        <div className="row justify-content-center">
                                            <div className="col-2">type: </div>
                                            <div className="col-6 ellipsis nowrap">{block.fields[removingIndex].type}</div>
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
        </>
    )
}

export default EditBlock