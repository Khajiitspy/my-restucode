import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CategoriesPage from "./Pages/Categories";
import AddCategoryPage from "./Pages/Categories/Add";

const App = () => {
    return (
        <Router>
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4 App-header">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">Categories</Link>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to="/add-category" className="nav-link">Add Category</Link>
                        </li>
                    </ul>
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<CategoriesPage />} />
                <Route path="/add-category" element={<AddCategoryPage />} />
            </Routes>
        </Router>
    );
};

export default App;
