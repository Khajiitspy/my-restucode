import {
    Routes, Route } from 'react-router-dom';
import CategoriesPage from "./Pages/Categories";
import AddCategoryPage from "./Pages/Categories/Add";
import Layout from "./Components/Layout";
import NoMatch from "./Pages/NoMatch";
import EditCategoryPage from "./Pages/Categories/Edit";
import LoginPage from "./Pages/Account/Login"
import RegisterPage from "./Pages/Account/Register"
// import {useAuthStore} from "./Store/AuthStore";
// import {jwtDecode} from "jwt-decode";
// import {useEffect} from "react";
//import LoginPage from "./Pages/Account/Login/index"

const App = () => {
    // const { setUser } = useAuthStore((state) => state);
    //
    // useEffect(() => {
    //     const token = localStorage.getItem("jwt");
    //     if (token) {
    //         const decoded = jwtDecode(token);
    //         setUser(decoded);
    //     }
    // },[]);

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<CategoriesPage />} />
                    <Route path={"categoriesCreate"} element={<AddCategoryPage />} />
                    <Route path="/categoriesEdit/:id" element={<EditCategoryPage />} />
                    <Route path={"Login"} element={<LoginPage />} />
                    <Route path={"Register"} element={<RegisterPage />} />

                    {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
                    <Route path="*" element={<NoMatch />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;
