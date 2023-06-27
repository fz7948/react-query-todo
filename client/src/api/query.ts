import { LOGIN_API_URL, TOKEN } from '@/constants';
import { instance } from '@/libs';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { responseType, variableType } from 'src/types';

export const useReactQueryMutation = (params: any) => {
    const { url } = params;

    const { mutate, isLoading, error } = useMutation<
        responseType,
        AxiosError<{ details: string }>,
        variableType
    >({
        mutationFn: (variables) => {
            return instance.post(url, variables);
        },
        onSuccess: (data) => {
            localStorage.setItem(TOKEN, data.token);
        },
        onError: (error: AxiosError<{ details: string }>) => {
            !!error.response && console.log(error.response);
        },
    });

    return {
        mutate,
        isLoading,
        error,
    } as const;
};
