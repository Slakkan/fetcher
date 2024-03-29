"use client"
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"

import styles from "./Input-Frame.module.scss"
import { HasKeyname } from "./Input-Text.component"

interface InputFrameProps<T extends HasKeyname> {
    defaultValue?: string,
    data: T,
    setData: Dispatch<SetStateAction<T>>,
    keyName: string,
    valueList: string[],
}

const InputFrame = <T extends HasKeyname,>({ data, setData, keyName, defaultValue, valueList }: InputFrameProps<T>) => {
    const [selectedValue, setSelectedValue] = useState(data[keyName] ?? defaultValue ?? valueList[0])

    useEffect(() => {
        setData(prev => ({ ...prev, [keyName]: selectedValue }))
    }, [keyName, selectedValue, setData])

    const getFrameClass = useCallback((value: string) => {
        const base = styles.input__frame;
        const active = styles["input__frame--active"]
        const isActive = selectedValue === value

        return `${base} ${isActive ? active : ""} weight--bold`
    }, [selectedValue])

    return (
        <div className="row">
            {valueList.map(value => (
                <div key={value} className="d-flex col-4 col-sm-3 p-2">
                    <button className={getFrameClass(value)} onClick={() => setSelectedValue(value)}>
                        {value}
                    </button>
                </div>
            ))}
        </div>
    )
}

export default InputFrame