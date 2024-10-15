import React from "react";
import { Container } from "react-bootstrap";
import "./Banner.style.css";

const Banner = ({ title }) => {
  return (
    <Container className="banner-container">
      <div className="banner-content">{title}</div>
    </Container>
  );
};

export default Banner;
