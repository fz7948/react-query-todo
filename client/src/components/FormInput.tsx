import { InputAdornment, TextField } from '@mui/material';
import FillEyeIcon from './icons/FillEyeIcon';
import FillEyeInvisibleIcon from './icons/FillEyeInvisibleIcon';
import CloseCircleIcon from './icons/CloseCircleIcon';
import React from 'react';

type Props = {
    dataCy?: string;
    onReset: (name: string) => void;
    type: string;
    name: string;
    label: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errorMsg: string;
    value: string;
};

export default function TextInput(props: Props) {
    const {
        dataCy,
        onReset,
        type,
        name,
        label,
        onChange,
        errorMsg,
        value, //
    } = props;

    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [hover, setHover] = React.useState<boolean>(false);
    const [focus, setFocus] = React.useState<boolean>(false);

    const isEyeIcon = [
        'password', //
    ].some((item) => item === type);

    return (
        <section className="flex flex-col">
            <TextField
                value={value}
                data-cy={dataCy}
                className="w-[20rem]"
                type={type}
                name={name}
                size="medium"
                label={label}
                onChange={onChange}
                onMouseOver={() => setHover(true)}
                onMouseOut={() => setHover(false)}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end" className="gap-2">
                            {hover || focus ? (
                                <button
                                    type="reset"
                                    tabIndex={-1}
                                    onClick={() => onReset(name)} //
                                >
                                    {value && <CloseCircleIcon />}
                                </button>
                            ) : (
                                <></>
                            )}
                            {isEyeIcon && (
                                <div
                                    className="cursor-pointer"
                                    tabIndex={-1}
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <FillEyeIcon />
                                    ) : (
                                        <FillEyeInvisibleIcon />
                                    )}
                                </div>
                            )}
                        </InputAdornment>
                    ),
                }}
            />

            <span className="self-start text-[10px] font-[600] pl-2 pt-1 text-[#B22212]">
                {errorMsg}
            </span>
        </section>
    );
}
