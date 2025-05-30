
import axiosInstance from "../../api/axiosInstance";
import {BASE_URL} from "../../api/apiConfig";
import {useNavigate} from "react-router-dom";
import BasicInput from "../../Components/common/BasicInput";
import { useAuth } from "../../context/AuthContext";
import {useState} from "react";
import {mapServerErrorsToFormik} from "../../Helpers/FormikErrorHelper.js";
import {EmailInput} from "../../Components/common/EmailInput";
import {PasswordInput} from "../../Components/common/PasswordInput";
import * as Yup from "yup";
import {useFormik} from "formik";
import {jwtDecode} from "jwt-decode";
import LoadingOverlay from "../../Components/common/LoadingOverlay";
import BasicFileInput from "../../Components/common/BasicFileInput/index.js";

const validationSchema = Yup.object().shape({
	email: Yup.string().required("Please Enter Email!"),
	firstName: Yup.string(),
	lastName: Yup.string(),
	imageFile: Yup.mixed().nullable(),
	password: Yup.string().required("Please Enter Password!"),
});

const RegisterPage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const {setUser} = useAuth();

	const initValues = {
		email: "",
		firstName: "",
		lastName: "",
		imageFile: null,
		password: "",
	}

	const handleFormikSubmit = async (values, {setErrors}) => {
		setIsLoading(true);
		console.log("submit formik", values);
		
		values.Image = values.imageFile;
		
		try{
			const response = await axiosInstance.post(`${BASE_URL}/api/Account/Register` , values, {
				headers: {
				    "Content-Type": "multipart/form-data",
				},
			});
			const token = response.data.token;
			localStorage.setItem('token', token);

			const payload = jwtDecode(token);
			setUser({
				email: payload['email'],
				name: payload['name'],
				image: payload['image'],
			});
			
			navigate('/');
		} catch (error) {
			if(error.response && error.response.status === 400) {
				console.error("Send request error", error);

				const fieldMap = {
					Email: "email",
					FirstName: "firstName",
					LastName: "lastName",
					Image: "imageFile",
					Password: "password",
				}
				
				mapServerErrorsToFormik(error, setErrors, fieldMap);
			}
			else if (error.response && error.response.status === 401){
				
				const serverErrors = {};
				serverErrors["email"] = error.response.data;
				serverErrors["password"] = error.response.data;
				setErrors(serverErrors);
				console.log(error.response.data);
			} else{
				alert("An unexpected error occurred...");
				console.error(error);
			}
		}
		setIsLoading(false);
	};
	
	const formik = useFormik({
		initialValues: initValues,
		onSubmit: handleFormikSubmit,
		validationSchema: validationSchema
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
	        <h1 className={"text-center"}>Register</h1>
	        <form onSubmit={handleSubmit} className={"col-md-6 offset-md-3"}>
	            <EmailInput
	                label="Email"
	                field="email"
	                error={errors.email}
	                touched={touched.email}
	                value={values.email}
	                onChange={handleChange}
	            />
	            
	            <BasicInput
	                label="First Name"
	                field="firstName"
	                error={errors.firstName}
	                touched={touched.firstName}
	                value={values.firstName}
	                onChange={handleChange}
	                required={false}
	            />
	            
	            <BasicInput
	                label="Last Name"
	                field="lastName"
	                error={errors.lastName}
	                touched={touched.lastName}
	                value={values.lastName}
	                onChange={handleChange}
	                required={false}
	            />
	            
	            <BasicFileInput
	            	label={"Choose Photo"} 
	            	field={"imageFile"}
	            	onChange={onHandleFileChange}
	            	error={errors.imageFile}
	            	touched={touched.imageFile}
	            	required={true}
	            />

	            <PasswordInput
	                label="Пароль"
	                field="password"
	                error={errors.password}
	                touched={touched.password}
	                value={values.password}
	                onChange={handleChange}
	            />

	            <button type="submit" className="btn btn-primary">Register</button>

	            {isLoading && <LoadingOverlay />}
	        </form>
	    </>
	)
}

export default RegisterPage;
