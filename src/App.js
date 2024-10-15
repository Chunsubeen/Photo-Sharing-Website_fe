import { Routes, Route, useNavigate } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import HomePage from './pages/HomePage/HomePage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LoginPage from './pages/LoginPage/LoginPage';
import BookmarkPage from './pages/BookmarkPage/BookmarkPage';
import { useEffect, useState } from 'react';
import PrivateRoute from './route/PrivateRoute';
import api from './utils/api';
import MyPage from './pages/MyPage/MyPage';
import NearbyPlaces from './pages/RecommendPage/NearbyPlaces';

function App() {
  const [myPhotos, setMyPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 사용자의 사진 목록 가져오기
  const getMyPhotos = async () => {
    const response = await api.get('/photo');
    setMyPhotos(response.data.data);
  };

  useEffect(() => {
    getMyPhotos();
  }, []);

  // 사용자 정보 가져오기
  const getUser = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const response = await api.get("/user/me");
        if (response.data.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    getUser();
  }, []);


  // 로그아웃 함수
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  // 사진 업데이트 함수
  const updatePhoto = async (photoId, updatedData) => {
    await api.put(`/photo/${photoId}`, updatedData);
    getMyPhotos();
  };

  // 사진 삭제 함수
  const deletePhoto = async (photoId) => {
    await api.delete(`/photo/${photoId}`);
    getMyPhotos();
  };

  // 북마크 추가 함수
  const addBookmark = async (photoId) => {
    try {
      const response = await api.post('/bookmark', { photoId });
      console.log('Bookmark added successfully:', response.data);
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };
  const updatePhotoInState = (updatedPhoto) => {
    setMyPhotos((prevPhotos) =>
      prevPhotos.map((photo) =>
        photo._id === updatedPhoto._id ? updatedPhoto : photo
      )
    );
  };
  // 북마크 삭제 함수
  const deleteBookmark = async (bookmarkId) => {
    try {
      const response = await api.delete(`/bookmark/${bookmarkId}`);
      console.log('Bookmark deleted successfully:', response.data);
      // 북마크 삭제 후 필요한 작업 (ex: 북마크 리스트 다시 불러오기)
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };


  return (
    <Routes>
      <Route path="/" element={<AppLayout user={user} handleLogout={handleLogout} />}>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage user={user} setUser={setUser} />} />
        <Route index element={<HomePage myPhotos={myPhotos} user={user} addBookmark={addBookmark} updatePhotoInState={updatePhotoInState} />} />
        <Route path="bookmark" element={<PrivateRoute user={user}><BookmarkPage deleteBookmark={deleteBookmark} /></PrivateRoute>} />
        <Route path="mypage" element={<PrivateRoute user={user}><MyPage myPhotos={myPhotos} user={user} /></PrivateRoute>} />
        <Route path="nearbyplaces" element={<NearbyPlaces />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
