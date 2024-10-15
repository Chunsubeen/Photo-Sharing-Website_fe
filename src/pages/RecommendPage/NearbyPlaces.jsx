import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import { LoadScript } from "@react-google-maps/api";
import "./NearbyPlaces.style.css";

const NearbyPlaces = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [places, setPlaces] = useState([]);
  const [placeType, setPlaceType] = useState("tourist_attraction");
  const [loading, setLoading] = useState(false);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [sortOption, setSortOption] = useState("distance");

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => console.error("Geolocation is not supported or permission denied")
      );
    }
  }, []);

  const fetchNearbyPlaces = () => {
    if (!currentPosition || !isApiLoaded) return;

    setLoading(true);

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    const request = {
      location: new window.google.maps.LatLng(
        currentPosition.lat,
        currentPosition.lng
      ),
      radius: 5000,
      type: placeType,
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        let sortedResults = [...results];
        if (sortOption === "rating") {
          sortedResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }
        setPlaces(sortedResults);
      } else {
        console.error("PlacesService failed: " + status);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    if (currentPosition && isApiLoaded) {
      fetchNearbyPlaces();
    }
  }, [currentPosition, placeType, sortOption, isApiLoaded]);

  const handlePlaceTypeChange = (e) => {
    setPlaceType(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleApiLoad = () => {
    setIsApiLoaded(true);
  };

  // 장소 세부 정보를 가져오는 함수
  const fetchPlaceDetails = (placeId) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    const request = {
      placeId: placeId,
      fields: [
        "name",
        "rating",
        "formatted_address",
        "formatted_phone_number",
        "opening_hours",
        "website",
        "photos",
      ],
    };

    service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setSelectedPlace(place);
        setShowModal(true); // 모달 표시
      } else {
        console.error("Details request failed: " + status);
      }
    });
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
      onLoad={handleApiLoad}
    >
      <Container>
        <h2>주변 관광지 추천</h2>

        <Form className="mb-4">
          <Form.Group controlId="placeTypeSelect">
            <Form.Label>장소 유형 선택</Form.Label>
            <Form.Control
              as="select"
              value={placeType}
              onChange={handlePlaceTypeChange}
            >
              <option value="tourist_attraction">관광 명소</option>
              <option value="restaurant">레스토랑</option>
              <option value="cafe">카페</option>
              <option value="lodging">호텔</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="sortSelect">
            <Form.Label>정렬 기준</Form.Label>
            <Form.Control
              as="select"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="distance">거리순</option>
              <option value="rating">평점 높은순</option>
            </Form.Control>
          </Form.Group>
        </Form>

        {loading && <p>로딩 중...</p>}

        {!loading && places.length === 0 && (
          <p>해당 위치에서 검색된 장소가 없습니다.</p>
        )}

        <Row>
          {places.map((place) => (
            <Col
              key={place.place_id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="mb-4"
            >
              <Card>
                <Card.Body>
                  <Card.Title>{place.name}</Card.Title>
                  <Card.Text>{place.vicinity}</Card.Text>
                  <Card.Text>평점: {place.rating || "N/A"}</Card.Text>
                  <Button
                    className="detail-button"
                    onClick={() => fetchPlaceDetails(place.place_id)}
                  >
                    자세히 보기
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 장소 세부 정보 모달 */}
        {selectedPlace && (
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>{selectedPlace.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>주소: {selectedPlace.formatted_address}</p>
              <p>전화번호: {selectedPlace.formatted_phone_number || "N/A"}</p>
              <p>평점: {selectedPlace.rating || "N/A"}</p>
              {selectedPlace.opening_hours && (
                <div>
                  <h6>영업 시간:</h6>
                  <ul>
                    {selectedPlace.opening_hours.weekday_text.map(
                      (time, index) => (
                        <li key={index}>{time}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
              {selectedPlace.website && (
                <p>
                  웹사이트:{" "}
                  <a
                    href={selectedPlace.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedPlace.website}
                  </a>
                </p>
              )}
            </Modal.Body>
          </Modal>
        )}
      </Container>
    </LoadScript>
  );
};

export default NearbyPlaces;
