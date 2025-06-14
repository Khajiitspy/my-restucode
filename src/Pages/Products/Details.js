import { useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { BASE_URL } from "../../api/apiConfig";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const ProductDetailsPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    console.log("DetailsPage");
    const { addToCart } = useCart();

    useEffect(() => {
        axiosInstance.get(`/api/products/${id}`).then(res => {
            setProduct(res.data);
            console.log(product);
        });
    }, [id]);

    const navigate = useNavigate();

    const handleDelete = async () => {
        const confirm = window.confirm("Are you sure you want to delete this product?");
        if (!confirm) return;

        try {
            await axiosInstance.delete(`/api/products/remove/${currentVariant.id}`);
            alert("Product deleted successfully.");
            navigate("/products");
        } catch (err) {
            console.error("Delete failed", err);
            alert("Failed to delete the product.");
        }
    };

    const handleAddToCart = async () => {
        try {
            await addToCart({
                productVariantId: currentVariant.id,
                quantity: 1,
                imageName: currentVariant.images[0],
                name: currentVariant.name,
                categoryName: currentVariant.category,
                price: currentVariant.price,
            });
            alert("Added to cart!");
        } catch (err) {
            console.error("Add to cart failed", err);
            alert("Failed to add to cart.");
        }
    };

    const handleSizeChange = (size) => {
        const newIndex = product.variants.findIndex(v => v.size === size);
        if (newIndex !== -1) {
            setSelectedVariantIndex(newIndex);
            setCurrentImageIndex(0);
        }
    };

    const nextImage = () => {
        setCurrentImageIndex(prev =>
            (prev + 1) % (currentVariant?.images?.length || 1)
        );
    };

    const prevImage = () => {
        setCurrentImageIndex(prev =>
            (prev - 1 + (currentVariant?.images?.length || 1)) %
            (currentVariant?.images?.length || 1)
        );
    };

    if (!product) return <div>Loading...</div>;

    console.log(product)
    const currentVariant = product.variants[selectedVariantIndex];
    const currentImage = currentVariant.images[currentImageIndex];

    console.log(currentVariant);

    const availableSizes = [
        ...new Set(product.variants.map(v => v.size).filter(Boolean))
    ];

    return (
        <div className="container py-5">
            <h1 className="mb-4 text-center">{currentVariant.name}</h1>
            <div className="row g-4">
                <div className="col-md-6 d-flex flex-column align-items-center">
                    <img
                        src={`${BASE_URL}/images/800_${currentImage}`}
                        alt={currentVariant.name}
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: '400px', objectFit: 'cover' }}
                    />
                    <div className="mt-3 d-flex gap-3">
                        <button onClick={prevImage} className="btn btn-outline-secondary">&laquo;</button>
                        <button onClick={nextImage} className="btn btn-outline-secondary">&raquo;</button>
                    </div>
                </div>

                <div className="col-md-6">
                    <h4>Price: ₴{currentVariant.price}</h4>
                    <p>Weight: {currentVariant.weight}g</p>

                    {availableSizes.length > 0 && (
                        <div className="mb-3">
                            <p><strong>Available Sizes:</strong></p>
                            <div className="d-flex gap-2 flex-wrap">
                                {availableSizes.map((size, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSizeChange(size)}
                                        className={`btn ${currentVariant.size === size ? 'btn-primary' : 'btn-outline-primary'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <p className="mt-4"><strong>Ingredients:</strong></p>
                    <div className="d-flex flex-wrap gap-3">
                        {currentVariant.ingredients.map((ingredient, index) => (
                            <div key={index} className="text-center">
                                <img
                                    src={`${BASE_URL}/images/200_${ingredient.imageUrl}`}
                                    alt={ingredient.name}
                                    width={80}
                                    height={80}
                                    className="rounded-circle border shadow-sm mb-1"
                                    style={{ objectFit: "cover" }}
                                />
                                <div>{ingredient.name}</div>
                            </div>
                        ))}
                    </div>

                    <p className="mt-4"><strong>Category:</strong> {currentVariant.category}</p>
                </div>
                <div className="d-flex justify-content-end gap-3 mt-4">
                    <Link to={`/ProductEdit/${currentVariant.id}`} className="btn btn-outline-primary">
                        Edit Product
                    </Link>
                    <button onClick={handleDelete} className="btn btn-outline-danger">
                        Delete Product
                    </button>
                    <button onClick={handleAddToCart} className="btn btn-success">
                        Add to Cart
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ProductDetailsPage;
