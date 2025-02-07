import React from 'react';
import './styles/globals.css';  // Import global Tailwind styles

import { BlockchainStateProvider } from './components/providers/BlockchainStateProvider'
import { AppProvider } from './components/providers/providers'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';

export const metadata = {
  title: "Comedy Clash App",
  description: "Welcome to the the show of comedy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <BlockchainStateProvider>
          <AppProvider>
            {/* Sticky Header */}
            <Header />

            {/* Main Content (Forces Full Height Even If Empty) */}
            <main className="flex flex-grow flex-col w-full">
              {children}
            </main>

            {/* Sticky Footer */}
            <Footer />
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