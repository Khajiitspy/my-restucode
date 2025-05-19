import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {BASE_URL} from "../../api/apiConfig";
import axiosInstance from "../../api/axiosInstance";

const CategoriesPage = () => {
    const [list,setList] = useState([])

    useEffect(()=>{
        axiosInstance.get(`/api/Categories`)
            .then(res=>{
                const {data} = res;
                console.log('Get list of categories', res.data);
                setList(data);
            });
        console.log('UseEffect APP', 'After Render');
    },[]);

    return (
        <>
            <h1>Categories</h1>
            <Link to={"categoriesCreate"} className={"btn btn-primary"}>Додати</Link>
            <div className={"card shadow-lg"}>
                {list.length ===0 ? <h1>list is empty</h1>:
                    <table className="table">
                        <thead>
                        <tr>
                            <th>id</th>
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
            </div>
        </>
    );
}

export default CategoriesPage;
