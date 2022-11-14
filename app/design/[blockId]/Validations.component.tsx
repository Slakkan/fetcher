import { Dispatch, FunctionComponent, KeyboardEventHandler, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { InputErrors } from "../../../models/Input.model";
import { DefaultButton, getDefaultButton } from "../../../utils/ui-utils";
import { isObjectNotEmpty } from "../../../utils/validators";
import Button from "../../../components/Button.component";
import InputCheckbox from "../../../components/inputs/Input-Checkbox.component";
import InputText, { InputTextValidation } from "../../../components/inputs/Input-Text.component";
import InputDropdown from "../../../components/inputs/Input-Dropdown.component";

interface ValidationsProps {
    data: Record<string, any>,
    setData: Dispatch<SetStateAction<Record<string, any>>>,
    setDataErrors: Dispatch<SetStateAction<InputErrors[]>>,
}

const Validations: FunctionComponent<ValidationsProps> = ({ data, setData, setDataErrors }) => {
    const clearBadgeInput = useRef<() => void>(() => { })
    const [badges, setBadges] = useState<string[]>(data.badges ?? [])
    const maxLengthValidations = useMemo(() => [InputTextValidation.isNumber, InputTextValidation.isClamped], [])
    const isNumberValidation = useMemo(() => data.isInteger ? [InputTextValidation.isNumber, InputTextValidation.isInteger] : [InputTextValidation.isNumber], [data.isInteger])

    const onEnterKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
        if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
            const value = e.target.value
            clearBadgeInput.current()
            setBadges(prev => [...prev, value])
        }
    }, [])

    const onBadgeAdd = () => {
        setBadges(prev => [...prev, (data as Record<string, any>)["addSpecificValue"]])
        clearBadgeInput.current()
    }

    const onBadgeRemove = (removedIndex: number) => {
        setBadges(prev => prev.filter((badge, index) => index !== removedIndex))
    }

    useEffect(() => {
        setData(prev => ({ ...prev, badges }))
    }, [badges, setData])

    return (
        <div className="mt-3 nowrap">
            <div className="row pb-3">
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
                        <InputText id="max-length" keyName="maxLength" initialValue="255" clampMin={0} clampMax={255} data={data} setData={setData} setDataErrors={setDataErrors} validations={maxLengthValidations} autocomplete="off" disabled={data.isMaxLength} />
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
                        <InputText id="match-regexp" keyName="matchRegexp" data={data} setData={setData} setDataErrors={setDataErrors} autocomplete="off" disabled={!data.isMatchRegexp} />
                    </div>
                    <div className="col-2 col-sm-4 col-md-4"></div>
                </div>
            )}

            {data.type === "text" && (
                <div className="row align-items-start">
                    <div className="col-5 col-sm-4 col-md-3">
                        <InputCheckbox keyName="isSpecific" data={data} setData={setData} id="is-specific">
                            <span className="me-2">Accept only:</span>
                        </InputCheckbox>
                    </div>
                    <div className="col-5 col-sm-4 col-md-4">
                        <InputText id="add-specific-value" keyName="addSpecificValue" onKeyDown={onEnterKeyDown} data={data} setData={setData} setDataErrors={setDataErrors} clearInput={clearBadgeInput} autocomplete="off" disabled={!data.isSpecific} />
                    </div>
                    <div className="col-2 col-sm-4 col-md-4">
                        <Button {...getDefaultButton(DefaultButton.ADD, 19)} onClick={onBadgeAdd} size="small" isDisabled={!data.isSpecific} />
                    </div>
                    {data.isSpecific && <div className="badge__container">
                        {badges.map((badge, index) => <div key={badge + "-" + index} onClick={() => onBadgeRemove(index)} className="badge me-2 mb-2">{badge}</div>)}
                    </div>}
                </div>
            )}

            {data.type === "number" && (
                <div className="row pb-3">
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
                    <div className="col-6 mb-2">
                        <InputCheckbox keyName="isGreater" data={data} setData={setData} id="is-greater">
                            <span>Greater than?</span>
                        </InputCheckbox>
                    </div>
                    <div className="col-6">
                        <InputCheckbox keyName="isLower" data={data} setData={setData} id="is-lower">
                            <span>Lower than?</span>
                        </InputCheckbox>
                    </div>
                    <div className="col-6 d-flex align-items-center">
                        <span className="text-align--center me-2 mb-3">Value</span>
                        <div className="me-2 mb-3">
                            <InputDropdown valueList={[">", "≥"]} keyName="greaterOrEqual" data={data} setData={setData} disabled={!data.isGreater} />
                        </div>
                        <div className="col-4 col-md-3 me-2">
                            <InputText id="higher-than" keyName="greaterThan" initialValue="0.00" data={data} setData={setData} setDataErrors={setDataErrors} validations={isNumberValidation} autocomplete="off" disabled={!data.isGreater} />
                        </div>

                    </div>

                    <div className="col-6 d-flex align-items-center">
                        <span className="text-align--center me-2 mb-3">Value</span>
                        <div className="me-2 mb-3">
                            <InputDropdown valueList={["<", "≤"]} keyName="lowerOrEqual" data={data} setData={setData} disabled={!data.isLower} />
                        </div>
                        <div className="col-4 col-md-3 me-2">
                            <InputText id="lower-than" keyName="lowerThan" initialValue="0.00" data={data} setData={setData} setDataErrors={setDataErrors} validations={isNumberValidation} autocomplete="off" disabled={!data.isLower} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Validations