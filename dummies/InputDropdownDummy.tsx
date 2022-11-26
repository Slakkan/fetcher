import { FunctionComponent, useState } from "react";
import InputDropdown from "../components/inputs/Input-Dropdown.component";

interface InputDropdownDummyProps {
    valueList: string[]
}

const InputDropdownDummy: FunctionComponent<InputDropdownDummyProps> = ({ valueList }) => {
    const [fakeData, setFakeData] = useState<any>({})
    return <InputDropdown keyName="dummy" valueList={valueList} data={fakeData} setData={setFakeData} />
}

export default InputDropdownDummy