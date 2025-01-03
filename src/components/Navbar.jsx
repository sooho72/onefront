import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCurrentUser } from "../store/actions/user";
import Role from "../models/Role";
import "../components/Navbar.css";

const Navbar = () => {
    const currentUser = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = () => {
        dispatch(clearCurrentUser());
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand navbar-light">
            <NavLink to="/main" className="nav-link">
            <div class="logo-container">
                <span class="animated-word">ONE</span>
                <span class="animated-word">POINT</span>
                <span class="animated-word">UP!</span>
            </div>
            </NavLink>
            <div className="navbar-nav me-auto">
                {currentUser?.role === Role.ADMIN && (
                    <li className="nav-item">
                        <NavLink to="/admin" className="nav-link">
                            관리자
                        </NavLink>
                    </li>
                )}
                <li className="nav-item">
                    <NavLink to="/challengeregister" className="nav-link">
                        챌린지 시작하기
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/challengeme" className="nav-link">
                        나의 챌린지
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/challenge" className="nav-link">
                        챌린지 게시판
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/famous" className="nav-link">
                        오늘의 명언카드
                    </NavLink>
                </li>
            </div>
            {!currentUser ? (
                <div className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <NavLink to="/login" className="nav-link">
                            로그인
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/register" className="nav-link">
                            가입하기
                        </NavLink>
                    </li>
                </div>
            ) : (
                <div className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <NavLink to="/profile" className="nav-link">
                            {currentUser.name}
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <a href="#" className="nav-link" onClick={logout}>
                            로그아웃
                        </a>
                    </li>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
