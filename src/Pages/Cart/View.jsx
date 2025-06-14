import React from "react";
import { BASE_URL } from "../../api/apiConfig";
import { useCart } from "../../context/CartContext";

const CartPage = () => {
    const { cartItems, addToCart, removeFromCart } = useCart();

    const handleIncrease = (item) => {
        addToCart({
            productVariantId: item.productVariantId,
            quantity: 1
        });
    };

    const handleDecrease = (item) => {
        addToCart({
            productVariantId: item.productVariantId,
            quantity: -1
        });
    };

    const handleRemove = (id) => {
        removeFromCart(id);
    };

    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="container py-4">
            <h2 className="mb-4">Your Cart</h2>
            {cartItems.length === 0 ? (
                <div className="alert alert-info">Your cart is empty.</div>
            ) : (
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>Image</th>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cartItems.map((item) => (
                        <tr key={item.productVariantId}>
                            <td>
                                <img
                                    src={`${BASE_URL}/images/200_${item.imageName}`}
                                    alt={item.name}
                                    width={60}
                                    height={60}
                                    style={{ objectFit: "cover", borderRadius: "0.5rem" }}
                                />
                            </td>
                            <td>{item.name}</td>
                            <td>{item.categoryName}</td>
                            <td>₴{item.price}</td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => handleDecrease(item)}
                                    >
                                        –
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => handleIncrease(item)}
                                    >
                                        +
                                    </button>
                                </div>
                            </td>
                            <td>₴{item.quantity * item.price}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleRemove(item.productVariantId)}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <div className="text-end">
                <h4>Total: ₴{total.toFixed(2)}</h4>
            </div>
        </div>
    );
};

export default CartPage;
