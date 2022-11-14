import { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from "react"

import styles from "./Input-Radio.module.scss"

interface InputRadioProps {
    valueList: string[],
    className: string,
    keyName: string,
    data: Record<string, any>,
    setData: Dispatch<SetStateAction<Record<string, any>>>,
}

const InputRadio: FunctionComponent<InputRadioProps> = ({ valueList, className, keyName, data, setData }) => {
    const [value, setValue] = useState(data[keyName] ?? valueList[0])

    useEffect(() => {
        setData(prev => ({ ...prev, [keyName]: value }))
    }, [keyName, setData, value])

    return (
        <>
            {valueList.map(listElement => (
                <div key={listElement} className={styles.radio + " " + className}>
                    <input className={styles.radio__input} id={listElement} checked={listElement === value} type="radio" onChange={() => setValue(listElement)} />
                    <label htmlFor={listElement}>{listElement}</label>
                </div>
            ))}
        </>
    )
}

export default InputRadio