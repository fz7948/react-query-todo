import cx from 'classnames';
import { TextInput } from '@/components';
import { SIGN_UP_API_URL, SUBMIT_BUTTON_CLASS } from '@/constants';
import React, { useState } from 'react';
import { useReactQueryMutation } from 'src/api/query';
import { formType } from 'src/types';
import { emailValidation, passwordValidation } from '@/utils';

const initialState = {
    email: '',
    password: '',
} as const;

function SignUp() {
    const { mutate } = useReactQueryMutation({ url: SIGN_UP_API_URL });

    const [formState, setForm] = useState<formType>(initialState);
    const [errorMsgState, setErrorMsg] = useState<formType>(initialState);

    const isActive =
        Object.values(formState).every((value) => value) &&
        Object.values(errorMsgState).every((value) => !value);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...formState, [name]: value });
    };

    const handleFormFocus = (
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
    ) => {
        const { name } = e.target;
        setErrorMsg({ ...errorMsgState, [name]: '' });
    };

    const handleFormSubmit = () => {
        setErrorMsg({
            ...errorMsgState,
            email: emailValidation(formState.email) //
                ? ''
                : '이메일 형식이 적합하지 않습니다.',
            password: passwordValidation(formState.password)
                ? ''
                : '비밀번호는 최소 8자리 이상 입력해주세요.',
        });

        mutate(formState);
    };

    return (
        <section className="flex flex-col items-center flex-1 p-10 gap-[1rem]">
            <TextInput
                onFocus={(e) => handleFormFocus(e)}
                type="text"
                name="email"
                label="이메일"
                onChange={handleFormChange}
                errorMsg={errorMsgState.email}
            />
            <TextInput
                onFocus={(e) => handleFormFocus(e)}
                type="password"
                name="password"
                label="비밀번호"
                onChange={handleFormChange}
                errorMsg={errorMsgState.password}
            />
            <button
                className={
                    isActive
                        ? cx(
                              SUBMIT_BUTTON_CLASS,
                              'bg-[#103d52] text-white cursor-pointer',
                          )
                        : cx(
                              SUBMIT_BUTTON_CLASS,
                              'bg-[#eaeaea] text-[#ADADAD] cursor-not-allowed',
                          )
                }
                disabled={!isActive}
                type="submit"
                onClick={handleFormSubmit}
            >
                회원가입
            </button>
        </section>
    );
}

export default SignUp;
