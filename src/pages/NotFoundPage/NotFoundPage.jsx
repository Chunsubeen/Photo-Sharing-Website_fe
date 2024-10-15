import React from "react";
import { Link } from "react-router-dom";
import "./NotFoundPage.style.css";

const NotFoundPage = () => {
  return (
    <div className="page-container">
      <p className="error-message">error</p>
      <h1 className="error-code">404</h1>
      <p className="page-heading">It seems that you're lost</p>
      <p className="inline-text">
        Go back to{" "}
        <Link to="/" className="page-link">
          home
        </Link>
      </p>
    </div>
  );
};

export default NotFoundPage;
