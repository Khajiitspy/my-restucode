import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {BASE_URL} from "../../api/apiConfig";
import axiosInstance from "../../api/axiosInstance";

const CategoriesPage = () => {
    const [list, setList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 5;

    const fetchData = () => {
        axiosInstance.get(`/api/Categories/pagedlist`, {
            params: {
                search: searchTerm,
                page: currentPage,
                pageSize: pageSize
            }
        }).then(res => {
            const {data} = res;
            console.log('Get list of categories', data);
            setList(data.items);
            setTotalPages(Math.ceil(data.totalItems / pageSize));
        });
    }

    useEffect(() => {
        fetchData();
    }, [searchTerm, currentPage]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    }

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    }

    return (
        <>
            <h1>Categories</h1>
            <div className="d-flex justify-content-between mb-2">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="form-control w-25"
                />
                <Link to={"categoriesCreate"} className="btn btn-primary">Додати</Link>
            </div>
            <div className="card shadow-lg">
                {list.length === 0 ? <h5 className="m-3">List is empty</h5> :
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {list.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td><img src={`${BASE_URL}/images/200_${item.image}`} alt={item.name} width={75}/></td>
                                <td>
                                    <Link to={`/categoriesEdit/${item.id}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                }

                {/* Pagination Controls */}
                <div className="d-flex justify-content-center my-3">
                    <button className="btn btn-secondary mx-1" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
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
                    <button className="btn btn-secondary mx-1" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                        &raquo;
                    </button>
                </div>
            </div>
        </>
    );
}

export default CategoriesPage;

