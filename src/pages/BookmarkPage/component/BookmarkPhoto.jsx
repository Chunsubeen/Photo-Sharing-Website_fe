import React, { useState } from "react";
import api from "../../../utils/api";
import { Modal, Button } from "react-bootstrap";

const BookmarkPhoto = ({ bookmark }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDeletePhoto = async () => {
    const confirmDelete = window.confirm("정말로 이 사진을 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        const response = await api.delete(`/bookmark/${bookmark._id}`);

        if (response.status === 200) {
          alert("사진이 성공적으로 삭제되었습니다.");
          handleClose();
        } else {
          alert(`삭제 실패`);
        }
      } catch (error) {
        alert(`삭제 중 오류 발생: ${error.message}`);
        console.log(error);
      }
    }
  };

  console.log(bookmark);
  return (
    <div>
      <img
        className="photo-card"
        src={bookmark.photoId.image}
        style={{ width: "100%", cursor: "pointer", marginBottom: "10px" }}
        onClick={handleShow}
      />

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body>
          <img src={bookmark.photoId.image} style={{ width: "100%" }} />
          <p>{bookmark.photoId.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeletePhoto}>
            Delete
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookmarkPhoto;
