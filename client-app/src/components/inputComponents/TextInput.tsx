import { useField } from "formik";

interface TI {
    placeholder: string;
    name: string;
    label?: string;
    type?: string;
    labellWidth?: string;
    inputWidth?: string;
    inputDescr?: string;
    required?: boolean;
    controlsAlign?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextInput({ labellWidth, inputWidth, inputDescr, required,
    controlsAlign, ...rest }: TI) {

    const [field, meta, helpers] = useField(rest.name);
    const { setValue } = helpers;
    return (
        <>
            <div className={`flex col-sm-6 offset-sm-3 col-xs-12 mt-4 ${controlsAlign}`}>
                <label className={labellWidth ? labellWidth : 'w-6/12'}>
                    {rest.label}
                    {required && (<span>*</span>)}
                </label>
                <input
                    className={`border-gray-400 border ml-[5px] pl-[5px]
                ${inputWidth ? inputWidth : 'w-6/12'}`}
                    {...field}
                    {...rest}
                    onChange={(e) => { setValue(e.currentTarget.value); rest.onChange!(e) }}
                />
                {inputDescr && (
                    <label className="ml-3">{inputDescr}</label>
                )}
            </div>
            <div className="text-left">
                {
                    meta.touched && meta.error ?
                        <p className="text-red-500">{meta.error}</p>
                        : null
                }
            </div>
        </>
    )
}