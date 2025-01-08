'use client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Navigation from './components/Navigation';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <Navigation />
          {children}
          <Toaster position="top-right" />
        </Provider>
      </body>
    </html>
  );
}