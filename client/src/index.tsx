import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);

const client = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 0,
            useErrorBoundary: true,
            suspense: true,
        },
    },
});

root.render(
    <React.StrictMode>
        <QueryClientProvider client={client}>
            <App />
        </QueryClientProvider>
    </React.StrictMode>,
);

reportWebVitals();
