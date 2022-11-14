import { Dispatch, FunctionComponent, KeyboardEventHandler, PropsWithChildren, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image"

import styles from './Input-Checkbox.module.scss';

interface InputCheckboxProps {
    id: string,
    keyName: string,
    data: Record<string, any>,
    setData: Dispatch<SetStateAction<Record<string, any>>>,
    defaultValue?: boolean,
    disabled?: boolean
}

const InputCheckbox: FunctionComponent<PropsWithChildren<InputCheckboxProps>> = ({ id, keyName, data, setData, defaultValue = false, children, disabled = false }) => {
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
        <div className={styles.checkbox}>
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
