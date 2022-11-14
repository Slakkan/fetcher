"use client"
import { ChangeEventHandler, Dispatch, FocusEventHandler, FunctionComponent, KeyboardEventHandler, MutableRefObject, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";

import styles from "./Input-Text.module.scss"
import useDebounce from "../../hooks/useDebounce";
import { isClamped, isNumber, isObjectNotEmpty, isValidPropertyName } from "../../utils/validators";
import { InputErrors } from "../../models/Input.model";
import { transformToCamelCase } from "../../utils/ui-utils";

interface InputTextProps {
    keyName: string,
    initialValue?: string,
    data: Record<string, any>,
    setData: Dispatch<SetStateAction<Record<string, any>>>,
    setDataErrors: Dispatch<SetStateAction<InputErrors[]>>,
    clearInput?: MutableRefObject<() => void>,
    onKeyDown?: KeyboardEventHandler<HTMLInputElement>,
    id?: string,
    validations?: InputTextValidation[],
    clampMax?: number,
    clampMin?: number,
    autocomplete?: "on" | "off",
    copyTarget?: string,
    disabled?: boolean,
}

export enum InputTextValidation {
    isRequired,
    isNumber,
    isInteger,
    isClamped,
    isValidKey
}

const InputText: FunctionComponent<InputTextProps> = ({ keyName, initialValue = "", data, setData, setDataErrors, clearInput, onKeyDown, validations, clampMin = 0, clampMax = 255, id = "", autocomplete = "on", copyTarget, disabled = false }) => {
    const isFirstRender = useRef(true)
    const [value, setValue] = useState<string>(data[keyName] ?? initialValue)
    const [debouncedValue, setDebouncedValue] = useDebounce(value, 200)
    const [inputErrors, setInputErrors] = useState<InputErrors>({ keyName, errors: [] })
    const [showErrors, setShowErrors] = useState(false)
    const [showErrorsDebounced] = useDebounce(showErrors, 200)
    const inputElement = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!isFirstRender.current) {
            isFirstRender.current = false
            const dataHasKey = Object.hasOwn(data, keyName)
            if (dataHasKey) throw new Error(`The data object has another input with keyName: ${keyName} assigned`);
            if (!keyName) throw new Error("The prop keyName can't be empty");
            if (keyName === "errors") throw new Error("The prop keyName can't be named errors");
            if (!isValidPropertyName(keyName)) throw new Error("The prop keyName has to be a valid JavaScript property string");
        }
    }, [data, keyName])

    useEffect(() => {
        if (clearInput) {
            clearInput.current = () => { setValue("") }
        }
    }, [clearInput, setData])

    const getInputType = useMemo(() => {
        if (validations && validations.includes(InputTextValidation.isInteger)) setValue((prev) => {
            return Math.floor(+prev).toString()
        });

        if (validations && validations.includes(InputTextValidation.isNumber)) {
            return "number"
        } else {
            return "text"
        }
    }, [validations])

    const validate = useCallback((value: string) => {
        const newErrors: string[] = []
        let error: string
        validations?.forEach(validation => {
            switch (validation) {
                case InputTextValidation.isRequired:
                    error = "This value is required"
                    if (!value) newErrors.push(error);
                    break;
                case InputTextValidation.isNumber:
                    error = "This value has to be a number"
                    if (!isNumber(value)) newErrors.push(error);
                    break;
                case InputTextValidation.isInteger:
                    error = "This value has to be an integer number"
                    if (value.toString().includes(".")) newErrors.push(error);
                    break;
                case InputTextValidation.isClamped:
                    error = `The value has to be between ${clampMin} and ${clampMax}`
                    if (!isClamped(clampMin, + value, clampMax)) newErrors.push(error);
                    break;
                case InputTextValidation.isValidKey:
                    error = `${value} is not a valid property name`
                    if (value && !isValidPropertyName(value)) newErrors.push(error);
                    break;
            }
        })
        setInputErrors((prev) => ({ ...prev, errors: newErrors }))
    }, [clampMax, clampMin, validations])

    useEffect(() => {
        setDataErrors(prev => {
            const index = prev.findIndex(dataErrors => dataErrors.keyName === keyName)
            if (index === -1) {
                return [...prev, inputErrors]
            } else {
                const newArray = prev.filter(dataErrors => dataErrors.keyName !== keyName)
                return [...newArray, inputErrors]
            }
        })
    }, [inputErrors, keyName, setDataErrors])

    const onInputChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
        setValue(target.value)
    }

    useEffect(() => {
        if (!inputErrors.errors.length) {
            setShowErrors(false)
        }
    }, [inputErrors.errors])

    const onBlurHandler: FocusEventHandler<HTMLInputElement> = ({ target }) => {
        setDebouncedValue(target.value)
        validate(target.value)
        setShowErrors(true)
    }

    useEffect(() => {
        validate(debouncedValue);
        setData(prev => ({ ...prev, [keyName]: debouncedValue }))
    }, [debouncedValue, setData, keyName, validate])

    useEffect(() => {
        if (copyTarget && isObjectNotEmpty(data) && data[copyTarget]) {
            setValue(() => transformToCamelCase(data[copyTarget]))
        }
    }, [copyTarget, data])

    useEffect(() => {
        if (!disabled && inputElement.current) {
            inputElement.current.focus()
        }
    }, [disabled])

    return (
        <div className="mb-3" style={{ position: "relative" }}>
            <input ref={inputElement} className={styles.input + " ps-2"} value={value} id={id} type={getInputType} onChange={onInputChange} onBlur={onBlurHandler} onKeyDown={onKeyDown} autoComplete={autocomplete} disabled={disabled} />
            {showErrorsDebounced && <span className={styles.input__errors + " hint weight--bold"}>{inputErrors.errors.join(", ")}</span>}
        </div>
    )
}

export default InputText