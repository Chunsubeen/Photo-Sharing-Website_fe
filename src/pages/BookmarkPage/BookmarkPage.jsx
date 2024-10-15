import React, { useEffect, useState } from "react";
import Banner from "../component/Banner";
import { FiBookmark } from "react-icons/fi";
import { Row, Col, Container, Spinner } from "react-bootstrap";
import api from "../../utils/api";
import BookmarkPhoto from "./component/BookmarkPhoto";

const BookmarkPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 북마크 데이터 가져오기
  const fetchBookmarks = async () => {
    try {
      const response = await api.get("/bookmark");
      setBookmarks(response.data.data || []);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      setError("북마크 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  if (loading) {
    return (
      <Container className="text-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
        <p>북마크 데이터를 불러오는 중입니다...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center">
        <p>{error}</p>
      </Container>
    );
  }

  return (
    <Container>
      <Banner
        title={
          <>
            <FiBookmark /> bookmark
          </>
        }
      />
      {bookmarks.length > 0 ? (
        <Row>
          {bookmarks.map((bookmark) => (
            <Col
              key={bookmark._id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="mb-4"
            >
              <BookmarkPhoto bookmark={bookmark} />
            </Col>
          ))}
        </Row>
      ) : (
        <p>북마크가 없습니다.</p>
      )}
    </Container>
  );
};

export default BookmarkPage;
