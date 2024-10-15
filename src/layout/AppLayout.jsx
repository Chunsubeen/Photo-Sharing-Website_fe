import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "./logo.png";
import "./AppLayout.style.css";
import { FiBookmark } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { TbCameraPlus } from "react-icons/tb";
import { FiLogIn } from "react-icons/fi";
import UploadPhotoForm from "./component/UploadPhotoForm";
import NearbyPlaces from "../pages/RecommendPage/NearbyPlaces";

const AppLayout = ({ user, handleLogout }) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const navigate = useNavigate();

  // 업로드 버튼 클릭 시 처리
  const handleUploadClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      setShowUploadForm(true);
    }
  };

  // 업로드 모달 닫기
  const handleCloseUploadForm = () => {
    setShowUploadForm(false);
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid className="navbar-container">
          {/* Logo */}
          <Navbar.Brand as={Link} to="/">
            <img src={logo} alt="Logo" width="300" />
          </Navbar.Brand>
          {/* Bookmark, Upload, Dropdown */}
          <div className="navbar-right">
            {/* 업로드 버튼 */}
            <Button className="navbar-icon" onClick={handleUploadClick}>
              <TbCameraPlus size={32} />
            </Button>

            {/* 북마크 링크 */}
            <Nav.Link as={Link} to="/Bookmark" className="navbar-icon">
              <FiBookmark size={32} />
            </Nav.Link>

            {/* 사용자 드롭다운 */}
            {user ? (
              <NavDropdown
                title={<FaUserCircle size={32} />}
                id="navbarScrollingDropdown"
                align="end"
                className="navbar-icon"
              >
                <NavDropdown.Item as={Link} to="/Mypage">
                  Mypage
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <MdLogout />
                  logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              // 로그인되지 않은 경우 로그인 버튼 표시
              <Button
                as={Link}
                to="/login"
                variant="primary"
                className="btn-navy"
              >
                <FiLogIn size={32} />
              </Button>
            )}
          </div>
        </Container>
      </Navbar>

      {/* UploadPhotoForm 컴포넌트에 handleClose 전달 */}
      <UploadPhotoForm
        show={showUploadForm}
        handleClose={handleCloseUploadForm}
      />
      <div className="sidebar">
        <Nav.Link as={Link} to="/nearbyplaces">
          <Button className="nearby-places-btn">Nearby Places</Button>
        </Nav.Link>
      </div>
      <Outlet />
    </>
  );
};

export default AppLayout;
