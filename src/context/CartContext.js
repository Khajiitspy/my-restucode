import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { BASE_URL } from "../api/apiConfig";
import axiosInstance from "../api/axiosInstance";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);

    const localStorageKey = "guest_cart";

    useEffect(() => {
        if (user?.token) {
            axios.get(`${BASE_URL}/api/Cart/GetCartItems`, {
                headers: { Authorization: `Bearer ${user.token}` }
            })
                .then(res => setCartItems(res.data))
                .catch(err => {
                    console.error("Failed to fetch server cart", err);
                });
        } else if (!user) {
            const localCart = JSON.parse(localStorage.getItem(localStorageKey)) || [];
            setCartItems(localCart);
        }
    }, [user?.token]);

    const updateLocalStorage = (items) => {
        localStorage.setItem(localStorageKey, JSON.stringify(items));
    };

    const addToCart = async (item) => {
        if (user) {
            try {
                await axios.post(`${BASE_URL}/api/Cart/CreateUpdate`, item, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                const res = await axios.get(`${BASE_URL}/api/Cart/GetCartItems`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setCartItems(res.data);
            } catch (err) {
                console.error("Server cart update failed", err);
            }
        } else {
            const existing = [...cartItems];
            const index = existing.findIndex(i => i.productId === item.productId);
            if (index !== -1) {
                existing[index].quantity += item.quantity;
            } else {
                existing.push(item);
            }
            setCartItems(existing);
            updateLocalStorage(existing);
        }
    };

    const removeFromCart = async (id) => {
        if (user) {
            try {
                await axios.delete(`${BASE_URL}/api/Cart/RemoveFromCart/${id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                const res = await axios.get(`${BASE_URL}/api/Cart/GetCartItems`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setCartItems(res.data);
            }
            catch (err) {
                console.error("Server cart update failed", err);
            }
        } else {
            const existing = [...cartItems];
            const index = existing.findIndex(i => i.productVariantId === id);
            if (index !== -1) {
                existing.splice(index,1);
            } 
            setCartItems(existing);
            updateLocalStorage(existing);
        }
    }

    const syncGuestCartToServer = async (token) => {
        const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];

        for (const item of guestCart) {
            try {
                await axiosInstance.post(`${BASE_URL}/api/Cart/CreateUpdate`, item, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                console.error("Failed to sync item to server cart", item, error);
            }
        }
        
        localStorage.removeItem("guest_cart");

        const res = await axios.get(`${BASE_URL}/api/Cart/GetCartItems`, {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        setCartItems(res.data);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, syncGuestCartToServer }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
