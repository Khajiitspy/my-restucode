import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from "../../api/axiosInstance";
import { BASE_URL } from "../../api/apiConfig";
import BasicInput from "../../Components/common/BasicInput";
import BasicFileInput from "../../Components/common/BasicFileInput";

import {useFormik} from "formik";
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    id: Yup.number().required(),
    name: Yup.string()
        .required('Name is required')
        .max(250, 'Name must be at most 250 characters'),
    image: Yup.mixed()
        .nullable()
        .notRequired()
        .test(
            'fileSize',
            'Image must be smaller than 2MB',
            (value) => !value || value.size <= 2 * 1024 * 1024
        )
        .test(
            'fileType',
            'Only JPG, PNG, or WEBP files are allowed',
            (value) =>
                !value ||
                ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(value.type)
        )
});


const EditCategoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState({
        id: '',
        name: '',
        image: null
    });

    const [viewImage, setViewImage] = useState('');

    useEffect(() => {
        axiosInstance.get(`/api/Categories/${id}`)
            .then(res => {
                setInitialValues({
                    id: res.data.id,
                    name: res.data.name,
                    image: null
                });
                console.log('Initial values', initialValues);
                setViewImage(res.data.image);
            })
            .catch(err => {
                alert("Failed to load category");
                console.error(err);
            });
    }, [id]);

    const handleFormikSubmit = async (values, { setErrors }) =>{
        const formData = new FormData();
        formData.append('Id', values.id);
        formData.append('Name', values.name);
        if (values.image) {
            formData.append('Image', values.image);
        }

        try {
            await axiosInstance.put(`/api/Categories/${values.id}`, formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            });
            alert('Category updated!');
            navigate('/');
        } catch(err) {
            console.error("Send request error", err);

            const serverErrors = {};
            const {response} = err;
            const {data} = response;
            if(data) {
                const {errors} = data;
                Object.entries(errors).forEach(([key, messages]) => {
                    let messageLines = "";
                    messages.forEach(message => {
                        messageLines += message+" ";
                        console.log(`${key}: ${message}`);
                    });
                    const field = key.charAt(0).toLowerCase() + key.slice(1);
                    serverErrors[field] = messageLines;

                });
            }
            console.log("response", response);
            console.log("serverErrors", serverErrors);
            setErrors(serverErrors);
        }
    }

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: handleFormikSubmit,
        validationSchema: validationSchema,
        enableReinitialize: true,
    });

    const {values, handleSubmit, errors, touched, handleChange, setFieldValue} = formik;

    console.log("Errors", errors)
    console.log("Touched", touched)

    const onHandleFileChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            setFieldValue("image", files[0]);
        } else {
            setFieldValue("image", null);
        }

        formik.setTouched({ ...formik.touched, imageFile: true });
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete the category: ${values.name}?`)) {
            try {
                await axiosInstance.delete(`/api/Categories/${id}`);
                alert("Category deleted!");
                navigate("/");
            } catch (error) {
                console.error("Delete failed", error);
                alert("Failed to delete category.");
            }
        }
    }

    return (
        <div className="card p-4 shadow-sm">
            <h2 className="mb-4">Edit Category</h2>
            <form onSubmit={handleSubmit} noValidate>
                <BasicInput
                    label={"Name"}
                    field={"name"}
                    value={values.name}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                    error={errors.name}
                    touched={touched.name}
                    required={false}
                />

                {viewImage && (
                    <div className="mb-3">
                        <label>Current Image:</label>
                        <div>
                            <img src={`${BASE_URL}/images/200_${viewImage}`} alt="Current" width={100} />
                        </div>
                    </div>
                )}

                <BasicFileInput
                    label={"New Image"}
                    field={"imageFile"}
                    onChange={onHandleFileChange}
                    error={errors.image}
                    touched={touched.image}
                    required={false}
                />

                <div className="d-flex justify-content-between mt-4">
                    <button type="submit" className="btn btn-primary">Save</button>
                    <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                </div>

            </form>
        </div>
    );
};

export default EditCategoryPage;
