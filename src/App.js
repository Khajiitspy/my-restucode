import {
    Routes, Route } from 'react-router-dom';
import CategoriesPage from "./Pages/Categories";
import AddCategoryPage from "./Pages/Categories/Add";
import Layout from "./Components/Layout";
import NoMatch from "./Pages/NoMatch";
import EditCategoryPage from "./Pages/Categories/Edit";
import LoginPage from "./Pages/Account/Login"
import RegisterPage from "./Pages/Account/Register"
import ProductsPage from "./Pages/Products"
import ProductDetailsPage from "./Pages/Products/Details"
import CreateProductPage from "./Pages/Products/Create"

const App = () => {

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<CategoriesPage />} />
                    <Route path={"categoriesCreate"} element={<AddCategoryPage />} />
                    <Route path="/categoriesEdit/:id" element={<EditCategoryPage />} />
                    <Route path={"Login"} element={<LoginPage />} />
                    <Route path={"Register"} element={<RegisterPage />} />
                    <Route path={"Products"} element={<ProductsPage />} />
                    <Route path="/ProductDetails/:id" element={<ProductDetailsPage />} />
                    <Route path={"ProductCreate"} element={<CreateProductPage />} />

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
