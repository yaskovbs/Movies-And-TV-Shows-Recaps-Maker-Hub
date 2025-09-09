import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// FIX: Access document via window to resolve TypeScript error "Cannot find name 'document'".
// This is a workaround for a build environment that lacks DOM typings.
const rootElement = (window as any).document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);