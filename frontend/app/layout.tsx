import React from 'react';

import { BlockchainStateProvider } from './components/providers/BlockchainStateProvider'
import { AppProvider } from './components/providers/providers'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
    title: "Comedy Clash App",
    description: "Welcome to the the show of comedy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
