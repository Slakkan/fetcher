"use client"
import { ChangeEventHandler, FocusEventHandler, FunctionComponent, useCallback, useEffect, useState } from "react";

import styles from "./Input-Text.module.scss"
import useDebounce from "../hooks/useDebounce";
import { isValidPropertyName } from "../utils/validators";

interface InputTextProps {
    keyName: string,
    data: Record<string, any>,
    id?: string,
    autocomplete?: "on" | "off",
    validations?: InputTextValidation[]
}

export enum InputTextValidation {
    isRequired,
    isValidKey
}

const InputText: FunctionComponent<InputTextProps> = ({ keyName, data, id = "", validations, autocomplete = "on" }) => {
    const [value, setValue] = useState("")
    const [errors, setErrors] = useState<string[]>([])
    const [showErrors, setShowErrors] = useState(false)
    const debouncedValue = useDebounce(value)

    const validate = useCallback((value: string) => {
        const errors: string[] = []
        let error: string
        validations?.forEach(validation => {
            switch (validation) {
                case InputTextValidation.isRequired:
                    error = "This value is required"
                    if (!value) errors.push(error);
                    break;
                case InputTextValidation.isValidKey:
                    error = `${value} is not a valid property name`
                    if (value && !isValidPropertyName(value)) errors.push(error);
                    break;
            }
        })
        setErrors(errors)
    }, [validations])

    const onInputChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
        setValue(target.value)
    }

    useEffect(() => {
        validate(debouncedValue)
        data[keyName] = debouncedValue
    }, [debouncedValue, data, keyName, validate])

    return (
        <div className="mb-3" style={{ position: "relative" }}>
            <input className={styles.input} id={id} type="text" onChange={onInputChange} onBlur={() => setShowErrors(true)} autoComplete={autocomplete} />
            {showErrors && <span className={styles.input__errors + " hint weight--bold"}>{errors.join(", ")}</span>}
        </div>)
}

export default InputText