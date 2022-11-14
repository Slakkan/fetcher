import { Dispatch, FunctionComponent, SetStateAction, useMemo } from "react";

import InputCheckbox from "../../../components/inputs/Input-Checkbox.component";
import InputFrame from "../../../components/inputs/Input-Frame.component";
import InputText, { InputTextValidation } from "../../../components/inputs/Input-Text.component";
import { InputErrors } from "../../../models/Input.model";
import { isObjectNotEmpty } from "../../../utils/validators";

interface TypesProps {
    data: Record<string, any>,
    setData: Dispatch<SetStateAction<Record<string, any>>>,
    setDataErrors: Dispatch<SetStateAction<InputErrors[]>>,
}

const Types: FunctionComponent<TypesProps> = ({ data, setData, setDataErrors }) => {
    const nameValidations = useMemo(() => [InputTextValidation.isRequired], [])
    const keyValidations = useMemo(() => [InputTextValidation.isRequired, InputTextValidation.isValidKey], [])
    const typeList = useMemo(() => ["text", "number", "boolean", "media", "block"], [])
    const copyTarget = useMemo(() => isObjectNotEmpty(data) && data["isCustomKeyName"] ? "" : "name", [data])

    return (
        <div className="mt-3 nowrap">
            <div className="row">
                <div className="col-2 py-2 py-md-0">
                    <label className="weight--bold text-align--end" htmlFor="block-name">Name:</label>
                </div>
                <div className="col-6 col-sm-5 col-lg-4">
                    <InputText id="block-name" keyName="name" validations={nameValidations} data={data} setData={setData} setDataErrors={setDataErrors} autocomplete="off" />
                </div>
                <div className="col-4"></div>
            </div>
            <div className="row">
                <div className="col-2 py-2 py-md-0">
                    <label className="weight--bold text-align--end" htmlFor="block-key">Key:</label>
                </div>
                <div className="col-6 col-sm-5 col-lg-4">
                    <InputText id="block-key" keyName="keyName" validations={keyValidations} data={data} setData={setData} setDataErrors={setDataErrors} autocomplete="off" copyTarget={copyTarget} disabled={!!copyTarget} />
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