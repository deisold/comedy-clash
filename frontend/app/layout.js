import React from 'react';

import { BlockchainStateProvider } from './components/providers/BlockchainStateProvider'
import { AppProvider } from './components/providers'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <BlockchainStateProvider>
                    <AppProvider>
                        {children}
                    </AppProvider>
                </BlockchainStateProvider>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    closeOnClick
                    pauseOnHover
                />
            </body>
        </html>
    );
}
