"use client"
import { Dispatch, KeyboardEventHandler, PropsWithChildren, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image"

import styles from './Input-Checkbox.module.scss';
import { HasKeyname } from "./Input-Text.component";

interface InputCheckboxProps<T extends HasKeyname> {
    id: string,
    keyName: string,
    className?: string,
    data: T,
    setData: Dispatch<SetStateAction<T>>,
    defaultValue?: boolean,
    disabled?: boolean
}

const InputCheckbox = <T extends HasKeyname,>({ id, keyName, className = "", data, setData, defaultValue = false, children, disabled = false }: PropsWithChildren<InputCheckboxProps<T>>) => {
    const [value, setValue] = useState<boolean>(data[keyName] ?? defaultValue)

    useEffect(() => {
        setData(prev => {
            return { ...prev, [keyName]: value }
        })
    }, [keyName, setData, value])

    const onEnterKeyDown: KeyboardEventHandler<HTMLButtonElement> = useCallback((e) => {
        if (e.key === "Enter" && e.target instanceof HTMLButtonElement) {
            setValue(prev => !prev)
        }
    }, [])

    const getLabelClassName = useMemo(() => {
        const base = styles.checkbox__label
        const checked = styles["checkbox__label--checked"]
        const isChecked = value

        return `${base} ${isChecked ? checked : ""}`
    }, [value])

    return (
        <div className={styles.checkbox + " " + className}>
            <button className="p-0 me-1 me-md-2" onKeyDown={onEnterKeyDown} disabled={disabled}>
                <label className={getLabelClassName} htmlFor={id}>
                    {value && <Image src="/icons/check-solid.svg" alt="X" width={20} height={20} />}
                </label>
            </button>
            <label htmlFor={id}>
                {children}
            </label>
            <input checked={value} className={styles.checkbox__input} onChange={({ target }) => setValue(target.checked)} id={id} type="checkbox" disabled={disabled} />
        </div>
    );
}

export default InputCheckbox;
