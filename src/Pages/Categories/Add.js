import { useState } from 'react';
import axiosInstance from "../../api/axiosInstance";
import {BASE_URL} from "../../api/apiConfig";
import BasicInput from "../../Components/common/BasicInput";
import BasicFileInput from "../../Components/common/BasicFileInput";

const AddCategoryPage = () => {
    const [Name, setName] = useState('');
    const [Image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('Name', Name);
        formData.append('Image', Image);

        try {
            var result = await axiosInstance.post(`${BASE_URL}/api/Categories`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Category added!',result);
            setName('');
            setImage(null);
        } catch (err) {
            console.error(err);
            alert('Failed to add category');
        }
    };

    return (
        <div className="card p-4 shadow-sm">
            <h2 className="mb-4">Add Category</h2>
            <form onSubmit={handleSubmit}>
                <BasicInput
                    label={"Name"}
                    value={Name}
                    onChange={(e) => setName(e.target.value)}
                />

                <BasicFileInput
                    label={"Image"}
                    onChange={(e) => setImage(e.target.files[0])}
                />

                <button type="submit" className="btn btn-primary">Add</button>
            </form>
        </div>
    );
};

export default AddCategoryPage;