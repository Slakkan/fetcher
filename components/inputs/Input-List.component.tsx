import { Dispatch, FunctionComponent, SetStateAction, useCallback, useEffect, useMemo, useState } from "react"
import InputCheckbox from "./Input-Checkbox.component"

interface InputListProps {
    valueList: string[],
    className?: string,
    keyName: string,
    data: Record<string, any>,
    setData: Dispatch<SetStateAction<Record<string, any[]>>>,
}

const InputList: FunctionComponent<InputListProps> = ({ valueList, className, keyName, data, setData }) => {
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
            {valueList.map((value, index) => <InputCheckbox key={value} keyName={value} data={values} setData={setValues} id={keyName + "-" + index}><span className={className}>{value}</span></InputCheckbox>)}
        </>
    )
}

export default InputList