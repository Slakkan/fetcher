import { Dispatch, FunctionComponent, SetStateAction, useMemo } from "react";

import InputCheckbox from "../../../components/inputs/Input-Checkbox.component";
import InputFrame from "../../../components/inputs/Input-Frame.component";
import InputText, { InputTextValidation } from "../../../components/inputs/Input-Text.component";
import { Block, EditField } from "../../../models/Block.model";
import { InputErrors } from "../../../models/Input.model";

interface TypesProps {
    data: EditField,
    setData: Dispatch<SetStateAction<EditField>>,
    dataErrors: InputErrors[],
    setDataErrors: Dispatch<SetStateAction<InputErrors[]>>,
    block: Block,
    keyNameBlackList: string[]
}


const Types: FunctionComponent<TypesProps> = ({ data, setData, dataErrors, setDataErrors, keyNameBlackList }) => {
    const nameValidations = useMemo(() => [InputTextValidation.isRequired], [])
    const keyValidations = useMemo(() => [InputTextValidation.isRequired, InputTextValidation.isValidKey, InputTextValidation.isBlackList], [])
    const typeList = useMemo(() => ["text", "number", "boolean", "media", "block"], [])
    const copyTarget = useMemo(() => data["isCustomKeyName"] ? "" : "name", [data])

    return (
        <div className="mt-3 nowrap">
            <div className="row">
                <div className="col-2 py-2 py-md-0">
                    <label className="weight--bold text-align--end" htmlFor="block-name">Name:</label>
                </div>
                <div className="col-6 col-sm-5 col-lg-4">
                    <InputText keyName="name" formKeyName="Types" validations={nameValidations} data={data} setData={setData} dataErrors={dataErrors} setDataErrors={setDataErrors} autocomplete="off" autoFocus={true} />
                </div>
                <div className="col-4"></div>
            </div>
            <div className="row">
                <div className="col-2 py-2 py-md-0">
                    <label className="weight--bold text-align--end" htmlFor="block-key">Key:</label>
                </div>
                <div className="col-6 col-sm-5 col-lg-4">
                    <InputText keyName="keyName" formKeyName="Types" validations={keyValidations} blackList={keyNameBlackList} blackListErrorMessage="That key is already in use" data={data} setData={setData} dataErrors={dataErrors} setDataErrors={setDataErrors} autocomplete="off" copyTarget={copyTarget} disabled={!!copyTarget} validateDisabled={true} />
                </div>
                <div className="col-4">
                    <InputCheckbox keyName="isCustomKeyName" data={data} setData={setData} id="keyname-checkbox">
                        <span className="hint">custom key?</span>
                    </InputCheckbox>
                </div>
            </div>

            <div className="row">
                <label className="weight--bold">Field type:</label>
            </div>
            <InputFrame keyName="type" data={data} setData={setData} valueList={typeList} />
        </div>
    )
}

export default Types
