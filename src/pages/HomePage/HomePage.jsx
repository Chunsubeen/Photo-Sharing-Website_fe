import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { FiBookmark } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "./HomePage.style.css";

const HomePage = ({ myPhotos, user, updatePhotoInState }) => {
  const googleHeadquarters = { lat: 37.422, lng: -122.084 };
  const [center, setCenter] = useState(googleHeadquarters);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.error("위치를 가져올 수 없습니다. 기본 위치로 설정합니다.");
          setCenter(googleHeadquarters);
        }
      );
    } else {
      setCenter(googleHeadquarters);
    }
  }, []);

  const handleMapLoad = () => {
    setIsMapLoaded(true);
  };
  const handleBookmark = async (photo) => {
    if (!user) {
      alert("로그인 후 북마크 기능을 사용할 수 있습니다.");
      return navigate("/login");
    }

    try {
      const response = await api.post("/bookmark", { photoId: photo._id });

      if (response.status === 200) {
        const updatedPhoto = { ...photo, isBookmarked: !photo.isBookmarked };
        updatePhotoInState(updatedPhoto); // 상태 업데이트
        setError(""); // 성공하면 에러 초기화
        alert("사진이 북마크되었습니다.");
      } else {
        setError("북마크 실패: 서버 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("북마크 중 오류 발생:", error);
      setError(`북마크 중 오류 발생: ${error.message}`);
      alert(`이미 북마크한 사진입니다.`);
    }
  };

  const handleMarkerClick = (photo) => {
    setSelectedPhoto(photo);
    console.log("Selected photo image URL:", photo.image); // 이미지 URL 콘솔 로그 추가
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      onLoad={handleMapLoad}
    >
      <div className="map-container">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={13}
          options={{ minZoom: 3 }}
          onClick={() => setSelectedPhoto(null)} // 지도 클릭 시 InfoWindow 닫기
        >
          {isMapLoaded &&
            window.google &&
            myPhotos.length > 0 &&
            myPhotos.map((photo) => (
              <Marker
                key={photo._id}
                position={{
                  lat: photo.location.latitude,
                  lng: photo.location.longitude,
                }}
                onClick={() => handleMarkerClick(photo)}
              />
            ))}

          {selectedPhoto && (
            <InfoWindow
              position={{
                lat: selectedPhoto.location.latitude,
                lng: selectedPhoto.location.longitude,
              }}
              onCloseClick={() => setSelectedPhoto(null)}
            >
              <div className="info-window">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.description}
                  className="info-window-image"
                />
                <p className="info-window-description">
                  {selectedPhoto.description}
                </p>
                <div className="info-window-footer">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPhoto.location.latitude},${selectedPhoto.location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="info-window-directions"
                  >
                    길찾기
                  </a>
                  <button
                    className={`info-window-bookmark ${
                      selectedPhoto.isBookmarked ? "active" : ""
                    }`}
                    onClick={() => handleBookmark(selectedPhoto)}
                  >
                    <FiBookmark />
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default HomePage;
