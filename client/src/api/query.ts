import { TODO_API_URL } from '@/constants';
import { instance } from '@/libs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TodoInterface, ResponseType } from 'src/types';

type ParamsType = {
    url: string;
};

const MutationMethod = {
    delete: 'delete',
    post: 'post',
    put: 'put',
} as const;

const getTodoList = async (): Promise<TodoInterface[]> => {
    const { data } = await instance.get(TODO_API_URL);
    return data;
};

const deleteTodo = async (id: string): Promise<{ data: null }> => {
    const { data } = await instance.delete(`${TODO_API_URL}/${id}`);
    return data;
};

const useReactQueryMutation = (
    params: ParamsType,
    method: keyof typeof MutationMethod,
) => {
    const queryClient = useQueryClient();
    const { url } = params;

    return useMutation<ResponseType, AxiosError<{ details: string }>, any>({
        mutationFn: (variables) => {
            return instance[method](url, variables);
        },
        onSuccess: async () => {
            await queryClient.refetchQueries(['todos']);
        },
        onError: (error: AxiosError<{ details: string }>) => {
            !!error.response && console.log(error.response);
        },
    });
};

export const useQueryTodoList = () => {
    const { data, isLoading, isSuccess, isError } = useQuery(
        ['todos'],
        async () => await getTodoList(),
    );

    return {
        data,
        isLoading,
        isSuccess,
        isError,
    };
};

export const useDeleteTodo = () => {
    const queryClient = useQueryClient();

    return useMutation(async (id: string) => await deleteTodo(id), {
        onError: (error: AxiosError<{ details: string }>) => {
            window.alert(error.response?.data.details);
        },
        onSuccess: async () => {
            await queryClient.refetchQueries(['todos']);
        },
    });
};

export const useMutationDelete = (params: ParamsType) => {
    return useReactQueryMutation(params, MutationMethod.delete);
};

export const useMutationPost = (params: ParamsType) => {
    return useReactQueryMutation(params, MutationMethod.post);
};

export const useMutationPut = (params: ParamsType) => {
    return useReactQueryMutation(params, MutationMethod.put);
};
