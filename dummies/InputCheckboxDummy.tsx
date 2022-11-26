import { FunctionComponent, PropsWithChildren, useState } from "react"
import InputCheckbox from "../components/inputs/Input-Checkbox.component"


const InputCheckboxDummy: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const [fakeData, setFakeData] = useState<any>({})
    return <InputCheckbox id="dummy" keyName="dummy" data={fakeData} setData={setFakeData}>{children}</InputCheckbox>
}

export default InputCheckboxDummy