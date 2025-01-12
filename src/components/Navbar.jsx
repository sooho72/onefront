import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCurrentUser } from "../store/actions/user";
import Role from "../models/Role";
import "../components/Navbar.css";

// react-bootstrap 사용 시
import { Modal, Button } from "react-bootstrap";

const Navbar = () => {
  const currentUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 모달 제어를 위한 상태값
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 로그아웃 모달 열기
  const handleLogoutModalOpen = () => {
    setShowLogoutModal(true);
  };

  // 로그아웃 모달 닫기
  const handleLogoutModalClose = () => {
    setShowLogoutModal(false);
  };

  // 실제 로그아웃 로직
  const handleConfirmLogout = () => {
    // 모달을 먼저 닫고
    setShowLogoutModal(false);

    // 유저 상태 초기화
    dispatch(clearCurrentUser());

    // 로그인 페이지로 이동
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand navbar-light">
        <NavLink to="/main" className="nav-link">
          <div className="logo-container">
            <span className="animated-word">ONE</span>
            <span className="animated-word">POINT</span>
            <span className="animated-word">UP!</span>
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
              <a href="#!" className="nav-link" onClick={handleLogoutModalOpen}>
                로그아웃
              </a>
            </li>
          </div>
        )}
      </nav>

      {/* 로그아웃 확인 모달 */}
      <Modal show={showLogoutModal} onHide={handleLogoutModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>로그아웃</Modal.Title>
        </Modal.Header>
        <Modal.Body>정말 로그아웃 하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleLogoutModalClose}>
            취소
          </Button>
          <Button variant="primary" onClick={handleConfirmLogout}>
            로그아웃
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Navbar;
