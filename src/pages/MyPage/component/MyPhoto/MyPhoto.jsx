import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./MyPhoto.style.css";
import api from "../../../../utils/api";

const MyPhoto = ({ photo }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleEditPhoto = async () => {
    const newDescription = prompt(
      "새로운 설명을 입력하세요:",
      photo.description
    );
    if (newDescription !== null && newDescription !== photo.description) {
      try {
        const response = await api.put(`/photo/${photo._id}`, {
          description: newDescription,
        });

        if (response.status === 200) {
          alert("사진이 성공적으로 수정되었습니다.");
          handleClose();
        } else {
          alert(`수정 실패: ${response.data.error}`);
        }
      } catch (error) {
        alert(`수정 중 오류 발생: ${error.message}`);
      }
    }
  };

  const handleDeletePhoto = async () => {
    const confirmDelete = window.confirm("정말로 이 사진을 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        const response = await api.delete(`/photo/${photo._id}`);

        if (response.status === 200) {
          alert("사진이 성공적으로 삭제되었습니다.");
          handleClose();
        } else {
          alert(`삭제 실패: ${response.data.error}`);
        }
      } catch (error) {
        alert(`삭제 중 오류 발생: ${error.message}`);
      }
    }
  };

  return (
    <>
      <img
        className="photo-card"
        src={photo.image}
        style={{ width: "100%", cursor: "pointer", marginBottom: "10px" }}
        onClick={handleShow}
      />

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body>
          <img
            src={photo.image}
            alt={photo.description}
            style={{ width: "100%" }}
          />
          <p>{photo.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditPhoto}>
            Edit
          </Button>
          <Button variant="danger" onClick={handleDeletePhoto}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyPhoto;
