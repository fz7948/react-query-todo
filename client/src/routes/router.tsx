import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import {
    LOGIN_URL,
    LOGOUT_URL,
    MAIN_URL,
    SIGN_UP_URL,
    TODO_URL,
} from '@/constants';
import { Login, SignUp, Root, TodoList } from '@/pages';

const router = createBrowserRouter([
    {
        path: MAIN_URL,
        element: <Root />,
    },
    {
        path: LOGOUT_URL,
    },
    {
        path: LOGIN_URL,
        element: <Login />,
    },
    {
        path: SIGN_UP_URL,
        element: <SignUp />,
    },
    {
        path: TODO_URL,
        element: <TodoList />,
    },
]);

export default router;
