import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import { AuthProvider } from './context/AuthContext.js';
import {CartProvider} from "./context/CartContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // What is the difference between just Router?
    <React.StrictMode>
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
