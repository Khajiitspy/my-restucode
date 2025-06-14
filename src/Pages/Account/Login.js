
import axiosInstance from "../../api/axiosInstance";
import {BASE_URL} from "../../api/apiConfig";
import {useNavigate} from "react-router-dom";
// import BasicInput from "../../Components/common/BasicInput";
import { useAuth } from "../../context/AuthContext";
import {useState} from "react";
import {mapServerErrorsToFormik} from "../../Helpers/FormikErrorHelper.js";
import {EmailInput} from "../../Components/common/EmailInput";
import {PasswordInput} from "../../Components/common/PasswordInput";
//import {useAuthStore} from "../../Store/AuthStore.js";

import { useCart } from "../../context/CartContext";



import * as Yup from "yup";
import {useFormik} from "formik";
import {jwtDecode} from "jwt-decode";
import LoadingOverlay from "../../Components/common/LoadingOverlay";

const validationSchema = Yup.object().shape({
    email: Yup.string().required("Please Enter Email!"),
	password: Yup.string().required("Please Enter Password!"),
});

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);

    // const { setUser, user } = useAuthStore((state) => state);
    // console.log("User authenticated", user);
    const { setUser } = useAuth();
    const { syncGuestCartToServer } = useCart();


    const initValues = {
        email: "",
        password: "",
    };

    const handleFormikSubmit = async (values, { setErrors }) => {
        setIsLoading(true);
        console.log("Submit formik", values);
        const formData = new FormData();
        formData.append("email", values.email);
        formData.append("password", values.password);

        try {
            const response = await axiosInstance.post(`${BASE_URL}/api/Account/Login` , formData, {});
            const token = response.data.token;
            localStorage.setItem('token', token);

            // const decoded = jwtDecode(token);
            // setUser(decoded);
            const payload = jwtDecode(token);
            setUser({
                email: payload['email'],
                name: payload['name'],
                image: payload['image'],
            });
            
            await syncGuestCartToServer(token);

            navigate('/');

        } catch (error) {
            if (error.response && error.response.status === 400) {

                console.error("Send request error", error);

                const fieldMap = {
                    Email: "email",
                    Password: "password"
                };

                mapServerErrorsToFormik(error, setErrors, fieldMap);

                // const serverErrors = {};
                // const {response} = error;
                // const {data} = response;
                // if(data) {
                //     const {errors} = data;
                //     Object.entries(errors).forEach(([key, messages]) => {
                //         let messageLines = "";
                //         messages.forEach(message => {
                //             messageLines += message+" ";
                //             console.log(`${key}: ${message}`);
                //         });
                //         const field = fieldMap[key] ?? key.toLowerCase();
                //         serverErrors[field] = messageLines;
                //
                //     });
                // }
                // console.log("response", response);
                // console.log("serverErrors", serverErrors);
                // setErrors(serverErrors);
            } else if (error.response && error.response.status === 401) { // User unknown

                const serverErrors = {};
                serverErrors["email"] = error.response.data;
                serverErrors["password"] = error.response.data;
                setErrors(serverErrors);
                console.log(error.response.data);

            }else{
                alert("An unexpected error occurred.");
                console.error(error);
            }
        }
        setIsLoading(false);

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

    return (
        <>
            <h1 className={"text-center"}>Login</h1>
            <form onSubmit={handleSubmit} className={"col-md-6 offset-md-3"}>
                <EmailInput
                    label="Email"
                    field="email"
                    error={errors.email}
                    touched={touched.email}
                    value={values.email}
                    onChange={handleChange}
                />

                <PasswordInput
                    label="Пароль"
                    field="password"
                    error={errors.password}
                    touched={touched.password}
                    value={values.password}
                    onChange={handleChange}
                />

                <button type="submit" className="btn btn-primary">Login</button>

                {isLoading && <LoadingOverlay />}
            </form>
        </>
    )
}

export default LoginPage;
