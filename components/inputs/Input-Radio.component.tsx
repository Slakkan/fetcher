"use client"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

import styles from "./Input-Radio.module.scss"
import { HasKeyname } from "./Input-Text.component"

interface InputRadioProps<T extends HasKeyname> {
    valueList: string[],
    className?: string,
    keyName: string,
    data: T,
    setData: Dispatch<SetStateAction<T>>,
    disabled?: boolean
}

const InputRadio = <T extends HasKeyname>({ valueList, className, keyName, data, setData, disabled = false }: InputRadioProps<T>) => {
    const [value, setValue] = useState(data[keyName] ?? valueList[0])

    useEffect(() => {
        setData(prev => ({ ...prev, [keyName]: value }))
    }, [keyName, setData, value])

    return (
        <>
            {valueList.map((listElement, index) => (
                <div key={"#" + index + "-" + listElement} className={styles.radio + " me-2 " + className}>
                    <input className={styles.radio__input} id={listElement} checked={listElement === value} type="radio" onChange={() => setValue(listElement)} disabled={disabled} />
                    <label htmlFor={listElement}>{listElement}</label>
                </div>
            ))}
        </>
    )
}

export default InputRadio