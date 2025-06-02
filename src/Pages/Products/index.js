import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {BASE_URL} from "../../api/apiConfig";
import axiosInstance from "../../api/axiosInstance";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 6;

    useEffect(() => {
        axiosInstance.get('/api/products', {
            params: {
                search: searchTerm,
                page: currentPage,
                pageSize: pageSize
            }
        }).then(res => {
            setProducts(res.data.items);
            setTotalPages(Math.ceil(res.data.totalItems / pageSize));
        });
    }, [searchTerm, currentPage]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Products</h2>
                <input
                    type="text"
                    className="form-control w-25"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <div className="row g-4">
                {products.map(product => (
                    <div className="col-md-4" key={product.id}>
                        <div className="card h-100 shadow-sm">
                            <img
                                src={`${BASE_URL}/images/200_${product.image}`}
                                className="card-img-top"
                                alt={product.name}
                                style={{objectFit: "cover", height: "200px"}}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text text-muted">₴{product.price}</p>
                                <Link to={`/productdetails/${product.id}`} className="btn btn-primary mt-auto">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
                <button className="btn btn-outline-secondary mx-1" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                    &laquo;
                </button>
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        className={`btn mx-1 ${i + 1 === currentPage ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => goToPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button className="btn btn-outline-secondary mx-1" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    &raquo;
                </button>
            </div>
        </div>
    );
};

export default ProductsPage;
