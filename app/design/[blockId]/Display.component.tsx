import { Dispatch, FunctionComponent, SetStateAction, useEffect, useMemo } from "react";

import InputCheckbox from "../../../components/inputs/Input-Checkbox.component";
import InputDropdown from "../../../components/inputs/Input-Dropdown.component";
import InputList from "../../../components/inputs/Input-List.component";
import InputRadio from "../../../components/inputs/Input-Radio.component";
import InputText from "../../../components/inputs/Input-Text.component";
import { BooleanDisplay, EditField, NumberDisplay, TextDisplay } from "../../../models/Block.model";
import { InputErrors } from "../../../models/Input.model";



interface DisplayProps {
    data: EditField
    setData: Dispatch<SetStateAction<EditField>>,
    dataErrors: InputErrors[],
    setDataErrors: Dispatch<SetStateAction<InputErrors[]>>,
}

const Display: FunctionComponent<DisplayProps> = ({ data, setData, dataErrors, setDataErrors }) => {
    const isAlreadySelected = useMemo(() => !!(data.isInputText || data.isCheckbox || data.isRadio || data.isList || data.isDropdown), [data])
    const isAllowedValueList = useMemo(() => data.allowedValues && data.allowedValues.length !== 0, [data])

    useEffect(() => {
        if (data.isInputText && data.type === "text") {
            data.display = TextDisplay.isInputText
        } else if (data.isInputText && data.type === "number") {
            data.display = NumberDisplay.isInputText
        } else if (data.isCheckbox && data.type === "boolean") {
            data.display = BooleanDisplay.isCheckbox
        } else if (data.isRadio && data.type === "text") {
            data.display = TextDisplay.isRadio
        } else if (data.isRadio && data.type === "boolean") {
            data.display = BooleanDisplay.isRadio
        } else if (data.isList && data.type === "text") {
            data.display = TextDisplay.isList
        } else if (data.isDropdown && data.type === "text") {
            data.display = TextDisplay.isDropdown
        } else {
            data.display = TextDisplay.isInputText
        }
    }, [data])

    return (
        <div className="mt-3 nowrap">
            <div className="row">
                <div className="col-4">
                    <h3 className="mt-0 mb-3">Display as:</h3>
                </div>
                <div className="col-8">
                    <h3 className="mt-0 mb-3">Result:</h3>
                </div>
            </div>
            {(data.type === "text" || data.type === "number") && (
                <div className="row">
                    <div className="col-4">
                        <InputCheckbox keyName="isInputText" defaultValue={true} data={data} setData={setData} id="is-input-text" disabled={isAlreadySelected && !data.isInputText}>
                            <span>Text</span>
                        </InputCheckbox>
                    </div>
                    <div className="col-8 d-flex align-items-center">
                        <div className="ellipsis nowrap max-50 me-3 mb-4">
                            <span>{data.name ? data.name : "Example"}: </span>
                        </div>
                        <InputText keyName="inputTextExample" data={data} setData={setData} dataErrors={dataErrors} setDataErrors={setDataErrors} disabled={!data.isInputText} />
                    </div>
                </div>
            )}
            {data.type === "boolean" && (
                <div className="row">
                    <div className="col-4">
                        <InputCheckbox keyName="isCheckbox" defaultValue={true} data={data} setData={setData} id="is-checkbox" disabled={isAlreadySelected && !data.isCheckbox}>
                            <span>Checkbox</span>
                        </InputCheckbox>
                    </div>
                    <div className="col-8 d-flex align-items-center">
                        <InputCheckbox keyName="inputCheckboxExample" id="input-checkbox-example" data={data} setData={setData} disabled={!data.isCheckbox}>
                            <span>{data.name}</span>
                        </InputCheckbox>
                    </div>
                </div>
            )}
            {(data.type === "text" || data.type === "boolean") && isAllowedValueList && (
                <div className="row pb-3">
                    <div className="col-4">
                        <InputCheckbox keyName="isRadio" data={data} setData={setData} id="is-radio" disabled={isAlreadySelected && !data.isRadio}>
                            <span>Radio</span>
                        </InputCheckbox>
                    </div>
                    <div className="col-8 d-flex align-items-center" style={{ flexWrap: "wrap" }}>
                        <div className="ellipsis nowrap max-50 me-3">
                            <span>{data.name ? data.name : "Example"}: </span>
                        </div>
                        {data.type === "text" && (
                            <InputRadio keyName="radioTextExample" className="d-flex" data={data} setData={setData} valueList={data.allowedValues!} disabled={!data.isRadio} />
                        )}
                        {data.type === "boolean" && (
                            <InputRadio keyName="radioBooleanExample" className="d-flex" data={data} setData={setData} valueList={["true", "false"]} disabled={!data.isRadio} />
                        )}
                    </div>
                </div>
            )}
            {data.type === "text" && isAllowedValueList && (
                <div className="row pb-3">
                    <div className="col-4">
                        <InputCheckbox keyName="isList" data={data} setData={setData} id="is-list" disabled={isAlreadySelected && !data.isList}>
                            <span>List</span>
                        </InputCheckbox>
                    </div>
                    <div className="col-8 d-flex align-items-center flex-wrap">
                        <div className="ellipsis nowrap max-50 me-3">
                            <span>{data.name ? data.name : "Example"}: </span>
                        </div>
                        <InputList keyName="listExample" className="me-2" data={data} setData={setData} valueList={data.allowedValues!} disabled={!data.isList} />
                    </div>
                </div>
            )}
            {data.type === "text" && isAllowedValueList && (
                <div className="row pb-3">
                    <div className="col-4">
                        <InputCheckbox keyName="isDropdown" data={data} setData={setData} id="is-dropdown" disabled={isAlreadySelected && !data.isDropdown}>
                            <span>Dropdown</span>
                        </InputCheckbox>
                    </div>
                    <div className="col-8 d-flex align-items-center">
                        <span className="nowrap ellipsis max-50 me-3">{data.name ? data.name : "Example"}: </span>
                        <InputDropdown valueList={data.allowedValues!} keyName="dropdownExample" data={data} setData={setData} disabled={!data.isDropdown} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Display