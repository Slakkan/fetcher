"use client"
import { ChangeEventHandler, Dispatch, FocusEventHandler, KeyboardEventHandler, MutableRefObject, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";

import styles from "./Input-Text.module.scss"
import useDebounce from "../../hooks/useDebounce";
import { isClamped, isNumber, isValidPropertyName } from "../../utils/validation-utils";
import { InputErrors } from "../../models/Input.model";
import { isMobile, transformToCamelCase } from "../../utils/ui-utils";
import useWindowSize from "../../hooks/useWidth";

export type HasKeyname = { [keyName: string]: any }
interface InputTextProps<T extends HasKeyname> {
    keyName: string,
    formKeyName?: string,
    initialValue?: string,
    data: T,
    setData: Dispatch<SetStateAction<T>>,
    dataErrors: InputErrors[],
    setDataErrors: Dispatch<SetStateAction<InputErrors[]>>,
    clearInput?: MutableRefObject<() => void>,
    onKeyDown?: KeyboardEventHandler<HTMLInputElement>,
    validations?: InputTextValidation[],
    blackList?: string[],
    blackListErrorMessage?: string,
    clampMax?: number,
    clampMin?: number,
    autocomplete?: "on" | "off",
    copyTarget?: string,
    disabled?: boolean,
    validateDisabled?: boolean,
    autoFocus?: boolean,
    notFocusWithTab?: boolean,
}

export enum InputTextValidation {
    isRequired,
    isNumber,
    isInteger,
    isClamped,
    isValidKey,
    isBlackList
}

const InputText = <T extends HasKeyname,>({ keyName, formKeyName = "", initialValue = "", data, setData, dataErrors, setDataErrors, clearInput, onKeyDown, validations, blackList, blackListErrorMessage, clampMin = 0, clampMax = 255, autocomplete = "on", copyTarget, disabled = false, validateDisabled = false, autoFocus, notFocusWithTab = false }: InputTextProps<T>) => {
    const isFirstRender = useRef(true)
    const [value, setValue] = useState<string>(data[keyName] !== undefined ? data[keyName] : initialValue)
    const [debouncedValue, setDebouncedValue] = useDebounce(value, 200)
    const dataError = useMemo(() => {
        const err = dataErrors.find(dataError => dataError.keyName === keyName)
        return err ? ({ ...err }) : undefined
    }, [dataErrors, keyName])
    const [showErrors, setShowErrors] = useState(dataError ? dataError.showErrors : false)
    const [inputErrors, setInputErrors] = useState<InputErrors>(dataError ? dataError : { keyName, formKeyName, errors: [] })
    const [showErrorsDebounced] = useDebounce(showErrors, 200)
    const inputElement = useRef<HTMLInputElement>(null)
    const [, windowHeight] = useWindowSize()


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
            clearInput.current = () => { setValue(() => "") }
        }
    }, [clearInput, setData])

    const getInputType = useMemo(() => {
        if (validations && validations.includes(InputTextValidation.isInteger)) {
            setValue((prev) => {
                return Math.floor(+prev).toString()
            })
        };

        if (validations && validations.includes(InputTextValidation.isNumber)) {
            return "number"
        } else {
            return "text"
        }
    }, [validations])


    const validate = useCallback((value: string) => {
        if (disabled && !validateDisabled) return;
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
                case InputTextValidation.isBlackList:
                    error = blackListErrorMessage ?? `${value} is not allowed`
                    if (blackList && blackList.includes(value)) newErrors.push(error);
                    break;
            }
        })

        setInputErrors((prev) => ({ ...prev, errors: newErrors }))
    }, [blackList, blackListErrorMessage, clampMax, clampMin, disabled, validateDisabled, validations])

    useEffect(() => {
        setDataErrors(prev => {
            const index = prev.findIndex(dataError => dataError.keyName === keyName)
            if (index === -1) {
                return [...prev, inputErrors]
            } else {
                const newArray = prev.filter(dataError => dataError.keyName !== keyName)
                return [...newArray, inputErrors]
            }
        })
    }, [inputErrors, keyName, setDataErrors])

    const onInputChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
        setValue(target.value)
    }

    useEffect(() => {
        if (disabled) {
            setInputErrors((prev) => ({ ...prev, errors: new Array(), showErrors: false }))
        } else if (inputElement.current) {
            validate(inputElement.current.value)
        }
    }, [disabled, validate])

    useEffect(() => {
        if (!inputErrors.errors.length && !inputErrors.showErrors) {
            setShowErrors(false)
        }
    }, [inputErrors.errors, inputErrors.showErrors])

    const onBlurHandler: FocusEventHandler<HTMLInputElement> = ({ target }) => {
        setDebouncedValue(target.value)
        validate(target.value)
        setShowErrors(true)
    }

    // Refresh displayed value from data obtained via copyTarget
    useEffect(() => {
        if (copyTarget) {
            setValue(data[keyName])
            if (inputElement.current) {
                inputElement.current.value = data[keyName]
            }
        }
    }, [copyTarget, data, initialValue, keyName, setData])

    useEffect(() => {
        validate(debouncedValue);
        setData(prev => ({ ...prev, [keyName]: debouncedValue }))

    }, [debouncedValue, setData, keyName, validate])

    useEffect(() => {
        const handler = () => setShowErrors(true)
        let element: Element | null = null;
        if (copyTarget) {
            element = document.querySelector<HTMLInputElement>("#" + copyTarget)
            element!.addEventListener("blur", handler)
        }
        return () => element?.removeEventListener("blur", handler)
    }, [copyTarget, keyName])

    useEffect(() => {
        if (copyTarget && value !== data[copyTarget]) {
            setValue(() => transformToCamelCase(data[copyTarget] ?? ""))
        }
    }, [copyTarget, data, value])

    useEffect(() => {
        if (autoFocus && !isMobile() && windowHeight > 700 && inputElement.current && isFirstRender.current) {
            inputElement.current.focus()
        }
    }, [autoFocus, windowHeight])


    return (
        <div className="mb-4" style={{ position: "relative" }}>
            <input id={keyName} ref={inputElement} tabIndex={notFocusWithTab ? -1 : undefined} className={styles.input + " ps-2"} value={value} type={getInputType} onChange={onInputChange} onBlur={onBlurHandler} onKeyDown={onKeyDown} autoComplete={autocomplete} disabled={disabled} />
            {showErrorsDebounced && <span className={styles.input__errors + " hint weight--bold"}>{inputErrors.errors.join(", ")}</span>}
        </div>
    )
}

export default InputText