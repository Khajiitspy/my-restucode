import {useState} from "react";
import axiosInstance from "../../api/axiosInstance";
import {BASE_URL} from "../../api/apiConfig";
import {useNavigate} from "react-router-dom";
import BasicInput from "../../Components/common/BasicInput";
import BasicFileInput from "../../Components/common/BasicFileInput";

import * as Yup from "yup";
import {useFormik} from "formik";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    imageFile: Yup.mixed().nullable()
});

const AddCategoryPage = () => {

    const initValues = {
        name: "",
        imageFile: null,
    };

    const handleFormikSubmit = async (values, { setErrors }) => {
        const formData = new FormData();
        formData.append("Name", values.name);
        if (values.imageFile) {
            formData.append("Image", values.imageFile);
        }

        try {
            await axiosInstance.post(`${BASE_URL}/api/Categories`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate("..");

        } catch (error) {
            if (error.response && error.response.status === 400) {
                const data = error.response.data;
                const fieldErrors = {};

                const fieldMap = {
                    Name: "name",
                    Image: "imageFile"
                };

                if (Array.isArray(data)) {
                    data.forEach(err => {
                        if (err.field && err.error) {
                            const formField = fieldMap[err.field] ?? err.field.toLowerCase();
                            fieldErrors[formField] = err.error;
                        }
                    });
                }

                console.log("Parsed field errors", fieldErrors);
                setErrors(fieldErrors);
            } else {
                alert("An unexpected error occurred.");
                console.error(error);
            }
        }

    };



    const formik = useFormik({
        initialValues: initValues,
        onSubmit: handleFormikSubmit,
        validationSchema: validationSchema,
    });

    const {values, handleSubmit, errors, touched, handleChange, setFieldValue} = formik;

    console.log("Errors", errors)
    console.log("Touched", touched)

    const navigate = useNavigate();

    const onHandleFileChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            setFieldValue("imageFile", files[0]);
        } else {
            setFieldValue("imageFile", null);
        }

        formik.setTouched({ ...formik.touched, imageFile: true });
    };

    return (
        <>
            <h1 className={"text-center"}>Add Categories</h1>
            <form onSubmit={handleSubmit} className={"col-md-6 offset-md-3"}>
                <BasicInput
                    label={"Name"}
                    field={"name"}
                    error={errors.name}
                    touched={touched.name}
                    value={values.name}
                    onChange={handleChange}
                    onBlur={formik.handleBlur} // Add this!
                    required={true}
                />

                <BasicFileInput
                    label={"Choose Photo"}
                    field={"imageFile"}
                    onChange={onHandleFileChange}
                    error={errors.imageFile}
                    touched={touched.imageFile}
                    required={true}
                />


                <button type="submit" className="btn btn-primary">Додати</button>
            </form>
        </>
    )
}

export default AddCategoryPage;