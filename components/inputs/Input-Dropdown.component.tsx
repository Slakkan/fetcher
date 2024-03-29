"use client"
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import styles from "./Input-Dropdown.module.scss"
import useWindowSize from "../../hooks/useWidth"
import { HasKeyname } from "./Input-Text.component"

interface InputDropdownProps<T extends HasKeyname> {
    valueList: string[]
    keyName: string,
    data: T,
    setData: Dispatch<SetStateAction<T>>,
    disabled?: boolean,
}

const InputDropdown = <T extends HasKeyname,>({ valueList, keyName, data, setData, disabled: isDisabled = false }: InputDropdownProps<T>) => {
    const [value, setValue] = useState<string>(data[keyName] ?? valueList[0])
    const [isOpen, setIsOpen] = useState(false)
    const [width, setWidth] = useState(0)
    const [windowWidth] = useWindowSize()

    const getDropdownWidth = useCallback((node: HTMLDivElement) => {
        if (node && windowWidth) {
            setWidth(node.getBoundingClientRect().width)
        }
    }, [windowWidth])

    const getImgSrc = useMemo(() => isOpen ? "/icons/chevron-up-solid.svg" : "/icons/chevron-down-solid.svg", [isOpen])

    useEffect(() => {
        setData(prev => ({ ...prev, [keyName]: value }))
    }, [keyName, setData, value])

    const onDropdownClick = () => {
        if (!isDisabled) {
            setIsOpen(prev => !prev)
        }
    }

    useEffect(() => { if (isDisabled) { setIsOpen(false) } }, [isDisabled])

    const getDropdownClass = useMemo(() => {
        const base = styles.dropdown
        const open = styles["dropdown--open"]
        const disabled = styles["dropdown--disabled"]

        return `${base} ${isOpen ? open : ""} ${isDisabled ? disabled : ""}`
    }, [isDisabled, isOpen])

    const getOptionClass = useCallback((option: string) => {
        const base = styles.dropdown__option

        const selected = "d-none"
        const isSelected = option === value

        return `${base} ${isSelected ? selected : ""} text-align--center py-2`
    }, [value])


    return (
        <div className={styles.dropdown__dummy} style={{ width }} >
            <div className={getDropdownClass} style={{ width }} tabIndex={-1} onClick={onDropdownClick} onBlur={() => setIsOpen(false)}>
                <div className={styles.dropdown__frame + " pe-5"}>
                    <Image className={styles.dropdown__chevron} src={getImgSrc} alt="v" width={24} height={24} />
                    <div className="ps-2 pe-5" ref={getDropdownWidth}>{value}</div>
                </div>
                {valueList.map((value, index) => (
                    <div key={"#" + index + "-" + value} className={getOptionClass(value)} onClick={() => setValue(value)}>{value}</div>
                ))}
            </div>
        </div>

    )
}

export default InputDropdown