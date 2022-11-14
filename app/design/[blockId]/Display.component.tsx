import { Dispatch, FunctionComponent, SetStateAction, useMemo } from "react";

import InputCheckbox from "../../../components/inputs/Input-Checkbox.component";
import InputDropdown from "../../../components/inputs/Input-Dropdown.component";
import InputList from "../../../components/inputs/Input-List.component";
import InputRadio from "../../../components/inputs/Input-Radio.component";
import { isObjectNotEmpty } from "../../../utils/validators";

interface DisplayProps {
    data: Record<string, any>
    setData: Dispatch<SetStateAction<Record<string, any>>>,
}

const Display: FunctionComponent<DisplayProps> = ({ data, setData }) => {
    const isAlreadySelected = useMemo(() => data.isRadio || data.isList || data.isDropdown, [data])

    return (
        <div className="mt-3 nowrap">
            <div className="row">
                <div className="col-4">
                    <h3 className="mt-0 mb-3">Display as:</h3>
                </div>
                <div className="col-8 d-flex align-items-center">
                    <h3 className="mt-0 mb-3">Examples:</h3>
                </div>
            </div>
            <div className="row pb-3">
                <div className="col-4">
                    <InputCheckbox keyName="isRadio" data={data} setData={setData} id="is-radio" disabled={isAlreadySelected && !data.isRadio}>
                        <span>Radio</span>
                    </InputCheckbox>
                </div>
                <div className="col-8 d-flex align-items-center">
                    <InputRadio keyName="radioExample" className="d-flex" data={data} setData={setData} valueList={["like", "this"]} />
                </div>
            </div>
            <div className="row pb-3">
                <div className="col-4">
                    <InputCheckbox keyName="isList" data={data} setData={setData} id="is-list" disabled={isAlreadySelected && !data.isList}>
                        <span>List</span>
                    </InputCheckbox>
                </div>
                <div className="col-8 d-flex align-items-center">
                    <InputList keyName="listExample" className="me-2" data={data} setData={setData} valueList={["accepts", "multiple", "values"]} />
                </div>
            </div>
            <div className="row pb-3">
                <div className="col-4">
                    <InputCheckbox keyName="isDropdown" data={data} setData={setData} id="is-dropdown" disabled={isAlreadySelected && !data.isDropdown}>
                        <span>Dropdown</span>
                    </InputCheckbox>
                </div>
                <div className="col-8 d-flex align-items-center">
                    <InputDropdown valueList={["useful", "when", "you", "have", "a", "lot", "of", "options"]} keyName="dropdownExample" data={data} setData={setData} />
                </div>
            </div>
        </div>
    )
}

export default Display