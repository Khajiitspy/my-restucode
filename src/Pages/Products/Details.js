import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { BASE_URL } from "../../api/apiConfig";

const ProductDetailsPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        axiosInstance.get(`/api/products/${id}`).then(res => {
            setProduct(res.data);
        });
    }, [id]);

    const handleSizeChange = (size) => {
        const newIndex = product.variants.findIndex(v => v.size === size);
        if (newIndex !== -1) {
            setSelectedVariantIndex(newIndex);
            setCurrentImageIndex(0); // reset image carousel
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

    const currentVariant = product.variants[selectedVariantIndex];
    const currentImage = currentVariant.images[currentImageIndex];

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
            </div>
        </div>
    );
};

export default ProductDetailsPage;
