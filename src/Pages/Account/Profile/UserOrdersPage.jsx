// src/pages/UserOrdersPage.jsx
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../api/apiConfig";
import axios from "axios";
import {useAuth} from "../../../context/AuthContext";

const UserOrdersPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.token) return;

        const fetchOrders = async () => {
            try {
                console.log(user.token);
                const response = await axios.get(`${BASE_URL}/api/orders`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user?.token]);



    return (
        <div className="container mt-5">
            <h2>Your Orders</h2>
            {loading ? (
                <p>Loading...</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map(order => (
                    <div key={order.id} className="card mb-3">
                        <div className="card-body">
                            <h5>Order #{order.id}</h5>
                            <p>Status: {order.status}</p>
                            <p>Created: {new Date(order.createdAt).toLocaleString()}</p>

                            <ul className="list-group mt-3">
                                {order.items.map(item => (
                                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{item.productVariantName}</strong> x{item.count}
                                        </div>
                                        <span>{item.priceBuy} ₴</span>
                                    </li>
                                ))}
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>Total</strong> x{order.items.reduce((sum, item) => sum + item.count, 0)}
                                    </div>
                                    <span>{order.items.reduce((sum, item) => sum + (item.count * item.priceBuy), 0)} ₴</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default UserOrdersPage;
