import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../api/apiConfig";
import DragDropUpload from "../../Components/common/ImageUploader/DragDropUplaod";
import {Input, Modal} from "antd";

const EditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [productData, setProductData] = useState({
        name: "",
        slug: "",
        price: "",
        weight: "",
        productSizeId: "",
        categoryId: "",
        ingredientIds: [],
    });

    const [images, setImages] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    const [isIngModalVisible, setIsIngModalVisible] = useState(false);
    const[newIngredient, setNewIngredient] = useState({
        Name: "",
        Image : null
    });


    useEffect(() => {
        if (!id) return;

        axiosInstance.get(`/api/Products/variant/${id}`)
            .then(res => {
                const current = res.data;

                setProductData({
                    ...productData,
                    ...current
                });

                console.log("Product Data", productData);

                const updatedFileList = (current.productImages || []).map((imageName, idx) => ({
                    uid: `${idx}`,
                    name: imageName,
                    url: `${BASE_URL}/images/800_${imageName}`,
                    originFileObj: new File([new Blob([''])], imageName, { type: 'old-image' }),
                }));

                setImages(updatedFileList);
            })
            .catch(err => console.error("Error loading product", err));
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sizesRes, categoriesRes, ingredientsRes] = await Promise.all([
                    axiosInstance.get("/api/Products/sizes"),
                    axiosInstance.get("/api/Categories/list"),
                    axiosInstance.get("/api/Products/ingredients"),
                ]);
                setSizes(sizesRes.data || []);
                setCategories(categoriesRes.data || []);
                setIngredients(ingredientsRes.data || []);
            } catch (err) {
                console.error("Failed to fetch product data:", err);
            }
        };
        fetchData();
    }, []);

    const handleIngredientToggle = (id) => {
        setProductData(prev => {
            const has = prev.ingredientIds.includes(id);
            const newIds = has
                ? prev.ingredientIds.filter(x => x !== id)
                : [...prev.ingredientIds, id];
            return { ...prev, ingredientIds: newIds };
        });
    };

    const handleEditProduct = async () => {
        try {
            const updatedProductData = {
                ...productData,
                VariantId: id,
                imageFiles: images.map(x => x.originFileObj)
            };

            console.log("Sending updated product:", updatedProductData);

            const res = await axiosInstance.put("/api/Products/edit", updatedProductData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            navigate("..");
            console.log("Product updated:", res.data);

        } catch (err) {
            setErrorMessage(err);
            console.error(err);
        }
    };

    const showIngModal = () => {
        setIsIngModalVisible(true);
    };

    const handleIngModalOk = async () => {
        try {
            // const formData = new FormData();
            // formData.append("name", newIngredient.name);
            // formData.append("imageFile", newIngredient.imageFile);

            const res = await axiosInstance.post("/api/Products/ingredients", newIngredient, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log("server responded:", res.data);

            const newIng = res.data;

            setIngredients(prev => [...prev, newIng]);

            setProductData(prev => {
                const updatedIds = prev.ingredientIds.includes(newIng.id)
                    ? prev.ingredientIds
                    : [...prev.ingredientIds, newIng.id];

                return {
                    ...prev,
                    ingredientIds: updatedIds
                };
            });

            setIsIngModalVisible(false);
        } catch (error) {
            console.log("Помилка при створенні інгредієнта");
        }
    };

    const handleIngModalCancel = () => {
        setIsIngModalVisible(false);
        newIngredient.Name = "";
        newIngredient.Image = null;
    };


    return (
        <div className="container mt-5">
            <h2 className="mb-4">Редагування продукту</h2>

            {errorMessage && (
                <div className="alert alert-danger">
                    {typeof errorMessage === 'string'
                        ? errorMessage
                        : JSON.stringify(errorMessage)}
                </div>
            )}

            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="border rounded p-3 h-100">
                        <DragDropUpload fileList={images} setFileList={setImages} />
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="border rounded p-3 h-100">
                        <div className="mb-3">
                            <label className="form-label">Назва</label>
                            <input
                                type="text"
                                className="form-control"
                                value={productData.name}
                                onChange={e => setProductData({ ...productData, name: e.target.value })}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Слаг (латинськими)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={productData.slug}
                                onChange={e => setProductData({ ...productData, slug: e.target.value })}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Вага (г)</label>
                            <input
                                type="number"
                                className="form-control"
                                value={productData.weight}
                                onChange={e => setProductData({ ...productData, weight: e.target.value })}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Ціна (грн)</label>
                            <input
                                type="number"
                                className="form-control"
                                value={productData.price}
                                onChange={e => setProductData({ ...productData, price: e.target.value })}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Розмір</label>
                            <select
                                className="form-select"
                                value={productData.productSizeId}
                                onChange={e => setProductData({ ...productData, productSizeId: e.target.value })}
                            >
                                <option value="">Оберіть розмір</option>
                                {sizes.map(size => (
                                    <option key={size.id} value={size.id}>{size.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Категорія</label>
                            <select
                                className="form-select"
                                value={productData.categoryId}
                                onChange={e => setProductData({ ...productData, categoryId: e.target.value })}
                            >
                                <option value="">Оберіть категорію</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <button className="btn btn-primary" onClick={handleEditProduct}>
                            Зберегти зміни
                        </button>
                    </div>
                </div>
            </div>

            <div className="border rounded p-3 mb-4">
                <h5>Інгредієнти</h5>
                <div className="d-flex flex-wrap gap-3 mb-3">
                    {ingredients.length === 0 && <span>Завантаження інгредієнтів...</span>}
                    {ingredients.map(ing => (
                        <div
                            key={ing.id}
                            onClick={() => handleIngredientToggle(ing.id)}
                            style={{
                                cursor: "pointer",
                                userSelect: "none",
                                padding: "5px 10px",
                                borderRadius: "5px",
                                border: productData.ingredientIds.includes(ing.id) ? "2px solid green" : "1px solid #ccc",
                                backgroundColor: productData.ingredientIds.includes(ing.id) ? "#d4f5d4" : "#f9f9f9",
                                marginRight: 8,
                                marginBottom: 8,
                            }}
                        >
                            {ing.name}
                        </div>
                    ))}
                    <div
                        onClick={() => showIngModal()} 
                        style={{
                            cursor: "pointer",
                            userSelect: "none",
                            padding: "5px 10px",
                            border: "1px solid black",
                            backgroundColor: "gray",
                            marginRight: 8,
                            marginBottom: 8
                        }}
                    >+
                    </div>
                    
                    {productData.ingredientIds.length === 0 && (
                        <span className="text-muted">Жодного інгредієнта не додано</span>
                    )}
                </div>
            </div>

            <Modal
                title="Add Ingredient"
                open={isIngModalVisible}
                onOk={handleIngModalOk}
                onCancel={handleIngModalCancel}
                okText="Add"
                cancelText="Cancel"
            >
                <Input
                    placeholder="Ingredient Name"
                    value={newIngredient.Name}
                    onChange={(e) => setNewIngredient({...newIngredient, Name: e.target.value})}
                />
                
                
                <Input
                    type="file"
                    placeholder="file"
                    className={`form-control mt-4`}
                    onChange={(e) => setNewIngredient({...newIngredient, Image: e.target.files[0]})}
                    accept="image/*"
                />
            </Modal>
        </div>
    );
};

export default EditProductPage;
