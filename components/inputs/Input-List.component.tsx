"use client"
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import InputCheckbox from "./Input-Checkbox.component"
import { HasKeyname } from "./Input-Text.component"

interface InputListProps<T extends HasKeyname> {
    valueList: string[],
    className?: string,
    keyName: string,
    data: T,
    setData: Dispatch<SetStateAction<T>>,
    disabled?: boolean
}

const InputList = <T extends HasKeyname,>({ valueList, className, keyName, data, setData, disabled = false }: InputListProps<T>) => {
    const getInitialValues = useMemo(() => {
        const object: Record<string, boolean> = {}
        if (data[keyName]) {
            (data[keyName] as string[]).forEach((value) => {
                object[value] = true
            })
        }
        return object
    }, [data, keyName])

    const [values, setValues] = useState<Record<string, boolean>>(getInitialValues)

    useEffect(() => {
        const selected: string[] = []
        Object.entries(values).forEach(([key, value]) => {
            if (value) {
                selected.push(key)
            }
        })
        setData(prev => ({ ...prev, [keyName]: selected }))
    }, [keyName, setData, values])


    return (
        <>
            {valueList.map((value, index) => <InputCheckbox key={"#" + index + "-" + value} keyName={value} className="me-2" data={values} setData={setValues} id={keyName + "-" + index} disabled={disabled}><span className={className}>{value}</span></InputCheckbox>)}
        </>
    )
}

export default InputList