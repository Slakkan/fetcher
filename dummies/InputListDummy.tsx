import { FunctionComponent, useState } from "react";
import InputList from "../components/inputs/Input-List.component";

interface InputListDummyProps {
    valueList: string[]
}

const InputListDummy: FunctionComponent<InputListDummyProps> = ({ valueList }) => {
    const [fakeData, setFakeData] = useState<any>({})
    return <InputList keyName="dummy" valueList={valueList} data={fakeData} setData={setFakeData} />
}

export default InputListDummy