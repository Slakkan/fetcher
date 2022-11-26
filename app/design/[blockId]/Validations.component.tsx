import { Dispatch, FunctionComponent, KeyboardEvent, KeyboardEventHandler, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { InputErrors } from "../../../models/Input.model";
import { DefaultButton, getDefaultButton } from "../../../utils/ui-utils";
import Button from "../../../components/Button.component";
import InputCheckbox from "../../../components/inputs/Input-Checkbox.component";
import InputText, { InputTextValidation } from "../../../components/inputs/Input-Text.component";
import InputDropdown from "../../../components/inputs/Input-Dropdown.component";
import { EditField } from "../../../models/Block.model";
interface ValidationsProps {
    data: EditField,
    setData: Dispatch<SetStateAction<EditField>>,
    dataErrors: InputErrors[],
    setDataErrors: Dispatch<SetStateAction<InputErrors[]>>,
}

const Validations: FunctionComponent<ValidationsProps> = ({ data, setData, dataErrors, setDataErrors }) => {
    const clearBadgeInput = useRef<() => void>(() => { })
    const [allowedValues, setAllowedValues] = useState<string[]>(data.allowedValues ?? [])
    const maxLengthValidations = useMemo(() => [InputTextValidation.isNumber, InputTextValidation.isClamped], [])
    const isNumberValidation = useMemo(() => data.isInteger ? [InputTextValidation.isNumber, InputTextValidation.isInteger] : [InputTextValidation.isNumber], [data.isInteger])

    const onEnterKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
        if (e.key === "Enter" && e.target instanceof HTMLInputElement && e.target.value.trim()) {
            const value = e.target.value.trim()
            clearBadgeInput.current()
            setAllowedValues(prev => [...prev, value])
        }
    }, [])

    const onBadgeAdd = () => {
        setAllowedValues(prev => [...prev, (data as Record<string, any>)["addAllowedValue"].trim()])
        clearBadgeInput.current()
    }

    const onBadgeRemove = (removedIndex: number) => {
        setAllowedValues(prev => prev.filter((badge, index) => index !== removedIndex))
    }

    useEffect(() => {
        setData(prev => ({ ...prev, allowedValues }))
    }, [allowedValues, setData])

    useEffect(() => {
        if (data.isInteger && !Number.isInteger(data.greaterThan)) {
            setData(prev => ({ ...prev, greaterThan: Math.floor(prev.greaterThan!) }))
        }
        if (data.isInteger && !Number.isInteger(data.lowerThan)) {
            setData(prev => ({ ...prev, lowerThan: Math.floor(prev.lowerThan!) }))
        }

        if (!data.isInteger && Number.isInteger(data.greaterThan)) {
            setData(prev => ({ ...prev, greaterThan: prev.greaterThan!.toFixed(2) as any }))
        }

        if (!data.isInteger && Number.isInteger(data.lowerThan)) {
            setData(prev => ({ ...prev, lowerThan: prev.lowerThan!.toFixed(2) as any }))
        }
    }, [data.greaterThan, data.isInteger, data.lowerThan, setData])

    const onBadgeEnterKeydown = useCallback((e: KeyboardEvent, index: number) => {
        if (e.key === "Enter" && e.target instanceof HTMLDivElement) {
            onBadgeRemove(index)
        }
    }, [])

    return (
        <div className="mt-3 nowrap">
            <div className="row mb-4">
                <div className="col-5 col-sm-4 col-md-3">
                    <InputCheckbox keyName="isRequired" data={data} setData={setData} id="is-required">
                        <span>Is required?</span>
                    </InputCheckbox>
                </div>
                <div className="col-5 col-sm-4 col-md-4"></div>
                <div className="col-2 col-sm-4  col-md-4"></div>
            </div>

            {data.type === "text" && (
                <div className="row">
                    <div className="col-5 col-sm-4 col-md-3">
                        <InputCheckbox keyName="isMaxLength" data={data} setData={setData} id="is-max-length">
                            <span className="me-2">Max length:</span>
                        </InputCheckbox>
                    </div>
                    <div className="col-5 col-sm-4 col-md-4">
                        <InputText keyName="maxLength" formKeyName="Validations" initialValue="255" clampMin={0} clampMax={255} data={data} setData={setData} dataErrors={dataErrors} setDataErrors={setDataErrors} validations={maxLengthValidations} autocomplete="off" disabled={!data.isMaxLength} />
                    </div>
                    <div className="col-2 col-sm-4 col-md-4"></div>
                </div>
            )}

            {data.type === "text" && (
                <div className="row">
                    <div className="col-5 col-sm-4 col-md-3">
                        <InputCheckbox keyName="isMatchRegexp" data={data} setData={setData} id="is-match-regexp">
                            <span className="me-2">Match RegExp:</span>
                        </InputCheckbox>
                    </div>
                    <div className="col-5 col-sm-4 col-md-4">
                        <InputText keyName="matchRegexp" formKeyName="Validations" data={data} setData={setData} dataErrors={dataErrors} setDataErrors={setDataErrors} autocomplete="off" disabled={!data.isMatchRegexp} />
                    </div>
                    <div className="col-2 col-sm-4 col-md-4"></div>
                </div>
            )}

            {data.type === "text" && (
                <div className="row align-items-start">
                    <div className="col-5 col-sm-4 col-md-3">
                        <InputCheckbox keyName="isAllowedValues" data={data} setData={setData} id="is-allowed-values">
                            <span className="me-2">Accept only:</span>
                        </InputCheckbox>
                    </div>
                    <div className="col-5 col-sm-4 col-md-4">
                        <InputText keyName="addAllowedValue" formKeyName="Validations" onKeyDown={onEnterKeyDown} data={data} setData={setData} dataErrors={dataErrors} setDataErrors={setDataErrors} clearInput={clearBadgeInput} autocomplete="off" disabled={!data.isAllowedValues} />
                    </div>
                    <div className="col-2 col-sm-4 col-md-4">
                        <Button {...getDefaultButton(DefaultButton.ADD, 19)} onClick={onBadgeAdd} size="small" isDisabled={!data.isAllowedValues} />
                    </div>
                    {data.isAllowedValues && <div className="badge__container">
                        {allowedValues.map((badge, index) => <div key={badge + "-" + index} tabIndex={0} onKeyDown={(e) => onBadgeEnterKeydown(e, index)} onClick={() => onBadgeRemove(index)} className="badge me-2 mb-2">{badge}</div>)}
                    </div>}
                </div>
            )}

            {data.type === "number" && (
                <div className="row mb-4">
                    <div className="col-5 col-sm-4 col-md-3">
                        <InputCheckbox keyName="isInteger" data={data} setData={setData} id="is-integer">
                            <span>Is integer?</span>
                        </InputCheckbox>
                    </div>
                    <div className="col-5 col-sm-4 col-md-4"></div>
                    <div className="col-2 col-sm-4  col-md-4"></div>
                </div>
            )}

            {data.type === "number" && (
                <div className="row">
                    <div className="col-4 mb-4">
                        <InputCheckbox keyName="isGreater" data={data} setData={setData} id="is-greater">
                            <span>Greater than?</span>
                        </InputCheckbox>
                    </div>
                    <div className="col-8 d-flex align-items-center">
                        <span className="text-align--center me-2 mb-4">Value</span>
                        <div className="me-2 mb-4">
                            <InputDropdown valueList={[">", "≥"]} keyName="greaterOrEqual" data={data} setData={setData} disabled={!data.isGreater} />
                        </div>
                        <div className="col-4 col-md-3 me-2">
                            <InputText keyName="greaterThan" formKeyName="Validations" initialValue="0.00" data={data} setData={setData} dataErrors={dataErrors} setDataErrors={setDataErrors} validations={isNumberValidation} autocomplete="off" disabled={!data.isGreater} />
                        </div>
                    </div>

                    <div className="col-4 mb-4">
                        <InputCheckbox keyName="isLower" data={data} setData={setData} id="is-lower">
                            <span>Lower than?</span>
                        </InputCheckbox>
                    </div>
                    <div className="col-8 d-flex align-items-center">
                        <span className="text-align--center me-2 mb-4">Value</span>
                        <div className="me-2 mb-4">
                            <InputDropdown valueList={["<", "≤"]} keyName="lowerOrEqual" data={data} setData={setData} disabled={!data.isLower} />
                        </div>
                        <div className="col-4 col-md-3 me-2">
                            <InputText keyName="lowerThan" formKeyName="Validations" initialValue="0.00" data={data} setData={setData} dataErrors={dataErrors} setDataErrors={setDataErrors} validations={isNumberValidation} autocomplete="off" disabled={!data.isLower} />
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}

export default Validations