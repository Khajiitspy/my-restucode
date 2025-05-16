import { useState } from 'react';
import axios from 'axios';

const AddCategoryPage = () => {
    const [Name, setName] = useState('');
    const [Image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('Name', Name);
        formData.append('Image', Image);

        try {
            await axios.post('http://localhost:5187/api/Categories', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Category added!');
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
                <div className="mb-3">
                    <label className="form-label">Category Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={Name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setImage(e.target.files[0])}
                        accept="image/*"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add</button>
            </form>
        </div>
    );
};

export default AddCategoryPage;
