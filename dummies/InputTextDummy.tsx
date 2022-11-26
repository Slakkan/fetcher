import { FunctionComponent, useState } from "react"
import InputText from "../components/inputs/Input-Text.component"

const InputTextDummy: FunctionComponent = () => {
    const [fakeData, setFakeData] = useState<any>({})
    const [fakeErrors, setFakeErrors] = useState<any>([])
    return <InputText keyName="dummy" data={fakeData} setData={setFakeData} dataErrors={fakeErrors} setDataErrors={setFakeErrors} notFocusWithTab={true} />
}

export default InputTextDummy