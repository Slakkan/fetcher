import { FunctionComponent, useState } from "react";
import InputRadio from "../components/inputs/Input-Radio.component";

interface InputRadioDummyProps {
    valueList: string[]
}

const InputRadioDummy: FunctionComponent<InputRadioDummyProps> = ({ valueList }) => {
    const [fakeData, setFakeData] = useState<any>({})
    return <InputRadio keyName="dummy" valueList={valueList} data={fakeData} setData={setFakeData} />
}

export default InputRadioDummy