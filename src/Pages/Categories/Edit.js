import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from "../../api/axiosInstance";
import { BASE_URL } from "../../api/apiConfig";
import BasicInput from "../../Components/common/BasicInput";
import BasicFileInput from "../../Components/common/BasicFileInput";

const EditCategoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [Name, setName] = useState('');
    const [ViewImage, setViewImage] = useState('');
    const [Image, setImage] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        axiosInstance.get(`/api/Categories/${id}`)
            .then(res => {
                setName(res.data.name);
                setViewImage(res.data.viewImage); // 👈 make sure it's camelCase
            }).catch(err => {
            alert("Failed to load category");
            console.error(err);
        });
    }, [id]);

    const validate = () => {
        const newErrors = {};

        if (!Name.trim()) {
            //   Apperenty I can organize the array with keys. (Like name is used here)
            newErrors.name = "Name is required.";
        }

        if (Image) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']; // I will use this array to check
            const maxSizeInBytes = 2 * 1024 * 1024; // This should make the maximum be 2MB

            if (!allowedTypes.includes(Image.type)) {
                newErrors.image = "Only JPG, PNG, or WEBP files are allowed.";
            } else if (Image.size > maxSizeInBytes) {
                newErrors.image = "Image must be smaller than 2MB.";
            }
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const formData = new FormData();
        formData.append('Name', Name);
        if (Image) formData.append('Image', Image);

        try {
            await axiosInstance.put(`/api/Categories/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Category updated!');
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('Failed to update category');
        }
    };

    return (
        <div className="card p-4 shadow-sm">
            <h2 className="mb-4">Edit Category</h2>
            <form onSubmit={handleSubmit} noValidate>
                <BasicInput
                    label="Name"
                    value={Name}
                    onChange={(e) => setName(e.target.value)}
                    className={errors.name ? 'is-invalid' : ''}
                />

                {/*   I learned I can do this:                                                   */}
                {/*   {[statement that returns a boolean] && [HTML to render if true]}           */}
                {/*   Where the Html will only load if the statement is true. without using if() */}

                {errors.name && <div className="text-danger mb-2">{errors.name}</div>}

                {ViewImage && (
                    <div className="mb-3">
                        <label>Current Image:</label>
                        <div>
                            <img src={`${BASE_URL}/images/200_${ViewImage}`} alt="Current" width={100} />
                        </div>
                    </div>
                )}

                <BasicFileInput
                    label="New Image"
                    onChange={(e) => setImage(e.target.files[0])}
                    required={false}
                />

                {errors.image && <div className="text-danger mb-2">{errors.image}</div>}

                <button type="submit" className="btn btn-primary mt-3">Save</button>
            </form>
        </div>
    );
};

export default EditCategoryPage;
