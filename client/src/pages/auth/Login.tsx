import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { FormType } from 'src/types';
import {
    MAIN_URL,
    SIGN_UP_URL,
    TOKEN,
    SUBMIT_BUTTON_CLASS,
    LOGIN_API_URL,
    TODO_URL,
} from '@/constants';
import { emailValidation, passwordValidation } from '@/utils';
import { useMutationPost } from 'src/api/query';
import { FormInput } from '@/components';

const initialState = {
    email: '',
    password: '',
} as const;

function Login() {
    const navigate = useNavigate();

    const { mutate } = useMutationPost({
        url: LOGIN_API_URL,
    });

    const [formState, setForm] = useState<FormType>(initialState);
    const [errorMsgState, setErrorMsg] = useState<FormType>(initialState);

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

        mutate(formState, {
            onSuccess: (data) => {
                localStorage.setItem(TOKEN, data.token);
                navigate(TODO_URL);
            },
            onError: (error) => {
                console.error(error);
            },
        });
    };

    useEffect(() => {
        if (!localStorage.getItem(TOKEN)) {
            navigate(MAIN_URL);
        }
    }, [navigate]);

    return (
        <section className="flex flex-col items-center flex-1 p-10 gap-[1rem]">
            <FormInput
                onFocus={(e) => handleFormFocus(e)}
                type="text"
                name="email"
                label="이메일"
                onChange={handleFormChange}
                errorMsg={errorMsgState.email}
            />
            <FormInput
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
                로그인
            </button>
            <Link to={SIGN_UP_URL}>회원가입</Link>
        </section>
    );
}

export default Login;
