import {useEffect, useState} from "react";
import axios from "axios";

const CategoriesPage = () => {
    const [list,setList] = useState([])

    useEffect(()=>{
        axios.get('http://localhost:5187/api/Categories')
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
            <div className={"card shadow-lg"}>
                {list.length ===0 ? <h1>list is empty</h1>:
                    <table className="table">
                        <thead>
                        <tr>
                            <th>id</th>
                            <th>Name</th>
                            <th>Image</th>
                        </tr>
                        </thead>
                        <tbody>
                        {list.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td><img src={`http://localhost:5187/images/200_${item.image}`} alt={item.name} width={75}/></td>
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