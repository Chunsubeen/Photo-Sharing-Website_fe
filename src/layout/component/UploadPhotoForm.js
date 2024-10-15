import React, { useState } from 'react';
import { Form, Modal, Button, Alert } from "react-bootstrap";
import EXIF from 'exif-js';
import api from '../../utils/api';
import axios from 'axios';

const UploadPhotoForm = ({ show, handleClose }) => {
    const [photo, setPhoto] = useState(null);
    const [description, setDescription] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [country, setCountry] = useState('Unknown');
    const [error, setError] = useState('');

    // 사진 선택 시 위치 정보를 읽어오는 함수
    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        setPhoto(file);
        setShowAlert(false); // 새로운 파일 선택 시 경고 메시지 숨김

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const image = new Image();
                image.src = e.target.result;
                image.onload = function () {
                    EXIF.getData(image, async function () {
                        const lat = EXIF.getTag(this, 'GPSLatitude');
                        const lon = EXIF.getTag(this, 'GPSLongitude');
                        const latRef = EXIF.getTag(this, 'GPSLatitudeRef');
                        const lonRef = EXIF.getTag(this, 'GPSLongitudeRef');

                        if (lat && lon) {
                            const latitude = convertDMSToDD(lat[0], lat[1], lat[2], latRef);
                            const longitude = convertDMSToDD(lon[0], lon[1], lon[2], lonRef);
                            setLatitude(latitude);
                            setLongitude(longitude);
                            console.log("Latitude:", latitude, "Longitude:", longitude);
                            // 좌표로부터 국가 정보를 가져옴
                            const countryName = await getCountryFromCoordinates(latitude, longitude);
                            setCountry(countryName);
                        } else {
                            console.log("No location information available.");
                            setLatitude(null);
                            setLongitude(null);
                            setCountry("Unknown");
                        }
                    });
                };
            };
            reader.readAsDataURL(file);
        }
    };

    // DMS 형식을 DD 형식으로 변환
    const convertDMSToDD = (degrees, minutes, seconds, direction) => {
        let dd = degrees + minutes / 60 + seconds / 3600;
        if (direction === "S" || direction === "W") {
            dd = dd * -1;
        }
        return dd;
    };

    // 좌표로부터 국가 정보를 가져오는 함수
    const getCountryFromCoordinates = async (latitude, longitude) => {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`;
        try {
            const response = await axios.get(url);
            const country = response.data.address.country || "Unknown";
            return country;
        } catch (error) {
            console.error("Country information fetching error:", error);
            return "Unknown";
        }
    };

    // 폼 제출 시 처리 함수
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!photo) {
            setShowAlert(true);
            return;
        }

        try {
            // FormData 생성
            const formDataToSend = new FormData();
            formDataToSend.append('image', photo);
            formDataToSend.append('description', description);

            if (latitude && longitude) {
                formDataToSend.append('latitude', latitude); // 위도 추가
                formDataToSend.append('longitude', longitude); // 경도 추가
            }

            formDataToSend.append('country', country); // 국가 정보 추가

            console.log("Image to be uploaded:", formDataToSend.get('image'));
            console.log("Description:", description);
            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);
            console.log("Country:", country);


            const response = await api.post("/photo", formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
            });

            if (response.status !== 200) throw new Error(response.error);

            alert("Photo uploaded successfully");
            resetForm(); // 폼 초기화
            handleClose(); // 업로드 성공 후 모달 닫기

        } catch (error) {
            setError(error.message);
            console.error("Error occurred while uploading photo:", error);
        }
    };



    // 폼과 상태 초기화 함수
    const resetForm = () => {
        setPhoto(null);
        setDescription('');
        setLatitude(null);
        setLongitude(null);
        setCountry('Unknown');
        setShowAlert(false);
        setError('');
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    return (
        <Modal show={show} onHide={() => { handleClose(); resetForm(); }} backdrop={true}>
            <Modal.Header closeButton onClick={() => { handleClose(); resetForm(); }}>
                <Modal.Title>Upload New Photo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {showAlert && <Alert variant="danger">Please upload a photo.</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Photo</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description (optional)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter a description (optional)"
                            onChange={handleDescriptionChange}
                            value={description}
                        />
                    </Form.Group>
                    <Button type="submit" className="mt-3">
                        Upload
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};


export default UploadPhotoForm;
