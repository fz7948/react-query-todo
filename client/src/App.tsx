import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from '@/routes';

function App() {
    return (
        <main className="flex flex-col w-full h-full max-w-screen-md mx-auto">
            <RouterProvider router={router} />
            <ReactQueryDevtools
                initialIsOpen={false}
                position={'bottom-right'}
            />
        </main>
    );
}

export default App;
