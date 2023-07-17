import {
    SORT_BUTTON_CLASS,
    TODO_API_URL,
    TODO_LIST_BUTTON_CLASS,
    TODO_LIST_CONTENT_CLASS,
} from '@/constants';
import cx from 'classnames';
import dayjs from 'dayjs';
import React from 'react';
import {
    useDeleteTodo,
    useMutationPost,
    useMutationPut,
    useQueryTodoList,
} from 'src/api/query';
import { SortType } from 'src/enums';
import { TodoInterface } from 'src/types';

const initialState = {
    title: '',
    content: '',
};

export default function TodoList() {
    const [message, setMessage] = React.useState(initialState);
    const [sortTypeState, setSortType] = React.useState<string>(SortType.ALL);
    const [editedById, setEditedById] = React.useState<string>('');
    const [checkedById, setCheckedById] = React.useState<Set<string>>(
        new Set(),
    );

    const { data } = useQueryTodoList();

    const formatData = React.useMemo(() => {
        if (data) {
            return data.reduce((res: TodoInterface[], cur: TodoInterface) => {
                if (sortTypeState === SortType.ALL) {
                    return [...res, cur];
                } else if (
                    sortTypeState === SortType.ACTIVE &&
                    !checkedById.has(cur.id) //
                ) {
                    return [...res, cur];
                } else if (
                    sortTypeState === SortType.COMPLETED &&
                    checkedById.has(cur.id)
                ) {
                    return [...res, cur];
                }
                return res;
            }, []);
        }
    }, [sortTypeState, checkedById, data]);

    const { mutate: addTodoList } = useMutationPost({
        url: TODO_API_URL,
    });

    const { mutate: removeTodoList } = useDeleteTodo();

    const { mutate: updateMutation } = useMutationPut({
        url: `${TODO_API_URL}/${editedById}`,
    });

    const editInputRef = React.useRef<HTMLInputElement>(null);

    const isMessageValid = !!message.title && !!message.content;

    const handleMessageChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { value, name } = e.target;
        setMessage({
            ...message,
            [name]: value,
        });
    };

    const handleCheckedIdUpdate = async (id: string) => {
        const updatedCheckedById = new Set(checkedById);
        if (updatedCheckedById.has(id)) {
            updatedCheckedById.delete(id);
        } else {
            updatedCheckedById.add(id);
        }
        setCheckedById(updatedCheckedById);
    };

    const handleTodoListAdd = () => {
        if (isMessageValid) {
            addTodoList(message, {
                onSuccess: () => {
                    setMessage(initialState);
                },
                onError: (error) => {
                    console.error(error);
                },
            });
        } else {
            alert('내용을 확인해주세요.');
        }
    };

    const handleTodoListUpdate = async () => {
        const editInputValue = editInputRef?.current?.value;

        if (editInputValue) {
            updateMutation(
                { ...message, title: editInputValue },
                {
                    onSuccess: () => {
                        setEditedById('');
                    },
                    onError: (error) => {
                        console.error(error);
                    },
                },
            );
        } else {
            alert('내용을 확인해주세요.');
        }
    };

    return (
        <section className="flex flex-col items-center w-full h-full py-[1rem]">
            <h1 className="text-[3rem] font-[800]">Todo-List ✏️</h1>
            <section className="flex w-full h-[10rem] gap-[0.3rem] pt-[0.5rem]">
                <div className="flex-1 flex flex-col h-full gap-2">
                    <input
                        className="h-[3rem] w-full text-[0.9rem] bg-[#fffacd] pl-[8px] rounded-[5px]"
                        placeholder="제목을 입력해주세요."
                        name="title"
                        value={message.title}
                        onChange={handleMessageChange}
                    />
                    <textarea
                        className="h-full rounded-[5px] text-[0.9rem] pt-[8px] pl-[8px] bg-[#fffacd] resize-none"
                        placeholder="내용을 입력해주세요."
                        name="content"
                        value={message.content}
                        onChange={handleMessageChange}
                    />
                </div>
                <button
                    type="submit"
                    className="h-full bg-[#d4d4d4] px-[1.2rem] text-[1.1rem] font-[600]"
                    onClick={handleTodoListAdd}
                >
                    Add Todo
                </button>
            </section>
            <section className="flex w-full h-full flex-col pt-[0.8rem]">
                <div className="flex justify-between items-center h-[2rem] pt-[0.8rem] pr-[0.5rem] pl-[0.2rem]">
                    <h4 className="font-[600]">{formatData?.length} tasks</h4>
                    <div className="flex gap-1">
                        {Object.values(SortType).map((type) => (
                            <button
                                type="button"
                                key={type}
                                className={
                                    sortTypeState === type
                                        ? cx(SORT_BUTTON_CLASS, 'bg-[#ffb6c1]')
                                        : cx(SORT_BUTTON_CLASS, 'bg-[#fff]')
                                }
                                onClick={() => setSortType(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col pt-[1rem] gap-[0.5rem]">
                    {formatData &&
                        formatData.map((list: TodoInterface) => (
                            <article className="flex flex-col" key={list.id}>
                                <div className="flex items-center w-full h-[2.5rem] bg-[#f4f4f4] pl-[0.5rem]">
                                    <input
                                        type="checkbox"
                                        className="w-[23px] h-[23px] rounded-[5px]"
                                        checked={checkedById.has(list.id)}
                                        onChange={() =>
                                            handleCheckedIdUpdate(list.id)
                                        }
                                    />
                                    {editedById === list.id ? (
                                        <input
                                            ref={editInputRef}
                                            className="mr-[1rem] ml-[0.3rem] flex-1 h-[25px] rounded-[5px]"
                                        />
                                    ) : (
                                        <div className="flex justify-between pr-[0.7rem] pl-[0.3rem] items-center flex-1">
                                            <h3
                                                className={
                                                    checkedById.has(list.id)
                                                        ? cx(
                                                              TODO_LIST_CONTENT_CLASS,
                                                              'decoration-[3px] decoration-[#000] line-through',
                                                          )
                                                        : cx(
                                                              TODO_LIST_CONTENT_CLASS,
                                                          )
                                                }
                                            >
                                                {list.title}
                                            </h3>
                                            <div className="flex items-center gap-[1.2rem]">
                                                <h6 className="text-[lightgray] text-[0.7rem]">{`작성일: ${dayjs(
                                                    list.createdAt,
                                                ).format('YYYY-MM-DD')}`}</h6>
                                                {list.updatedAt && (
                                                    <h6 className="text-[lightgray] text-[0.7rem]">{`최종수정일: ${dayjs(
                                                        list.updatedAt,
                                                    ).format(
                                                        'YYYY-MM-DD',
                                                    )}`}</h6>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex gap-[0.6rem] pr-[0.5rem]">
                                        {editedById === list.id ? (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        setEditedById('')
                                                    }
                                                    className={cx(
                                                        TODO_LIST_BUTTON_CLASS,
                                                    )}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleTodoListUpdate()
                                                    }
                                                    className={cx(
                                                        TODO_LIST_BUTTON_CLASS,
                                                    )}
                                                >
                                                    Update
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEditedById(list.id)
                                                    }
                                                    className={cx(
                                                        TODO_LIST_BUTTON_CLASS,
                                                    )}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeTodoList(list.id)
                                                    }
                                                    className={cx(
                                                        TODO_LIST_BUTTON_CLASS,
                                                    )}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                </div>
            </section>
        </section>
    );
}
