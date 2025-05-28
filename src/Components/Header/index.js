import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {BASE_URL} from "../../api/apiConfig";

const Header = () => {
    const { user, logout } = useAuth();


    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className={"container"}>
                <NavLink className="navbar-brand" to={"/"}>Admin Panel</NavLink>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink to="/categories" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                                Categories
                            </NavLink>
                        </li>
                    </ul>

                    <ul className="navbar-nav ms-auto">

                        {user ? (
                            <div className="flex items-center gap-2">
                                <img src={`${BASE_URL}/images/50_${user.image}`} alt="Avatar" className="rounded-circle mx-3" />
                                <span className={"mx-3 text-white"}>{user.name}</span>
                                <button className={"mx-3 btn btn btn-light"} onClick={logout}>Вийти</button>
                            </div>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <NavLink to="/register" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                                        Реєстрація
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <NavLink to="/login" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                                        Вхід
                                    </NavLink>
                                </li>
                            </>
                        )}


                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
