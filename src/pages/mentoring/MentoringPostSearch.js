import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"; // useHistory for React Router v5
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Pagination from "../../components/Pagenation";
import "../../styles/mentoring/MentoringPostSearch.css";

const MentoringPostSearchPage = () => {
  const history = useHistory(); // useHistory hook

  // 상태 관리
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedField, setSelectedField] = useState("전체");
  const [searchInput, setSearchInput] = useState("");
  const [searchCategory, setSearchCategory] = useState("title");
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    field: "",
    category: "title",
  });
  const [error, setError] = useState(null);

  /**
   * 멘토링 공고 작성 페이지로 이동
   */
  const handleMentoringPostForm = () => {
    history.push("/mentoring-post-form"); // React Router v5의 useHistory 사용
  };

  const handleInputChange = (e) => {
    const value = e.target.value.trim();
    setSearchInput(value);
  };

  const handleSearchClick = () => {
    setSearchParams({
      keyword: searchInput,
      field: selectedField !== "전체" ? selectedField : "",
      category: searchCategory,
    });
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSearchCategory(e.target.value);
  };

  const handleFieldSelect = (field) => {
    setSelectedField(field);
    if (field === "전체") {
      setSearchParams({
        keyword: "",
        field: "",
        category: "title",
      });
    } else {
      setSearchParams((prev) => ({
        ...prev,
        field: field !== "전체" ? field : "",
      }));
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const params = {
          pageNumber: currentPage - 1,
          pageSize: 10,
          field: searchParams.field,
          [searchParams.category]: searchParams.keyword,
        };

        console.log("API 호출 파라미터:", params);

        const response = await axios.get("http://localhost:8080/mentoring", { params });

        setPosts(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
        setError(null);
      } catch (error) {
        console.error("멘토링 공고를 가져오는 중 오류 발생:", error);
        setError("멘토링 공고를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
    };

    fetchPosts();
  }, [currentPage, searchParams]);

  return (
      <div className="mentoring-page">
        <div className="search-container">
          <select value={searchCategory} onChange={handleCategoryChange} className="search-category">
            <option value="title">제목</option>
            <option value="nickname">멘토 닉네임</option>
          </select>
          <input
              type="text"
              placeholder={`${
                  searchCategory === "title" ? "제목으로 검색" : "닉네임으로 검색"
              }`}
              value={searchInput}
              onChange={handleInputChange}
              className="search-input"
          />
          <button onClick={handleSearchClick} className="search-button">
            검색
          </button>
          <button className="upload-button" onClick={handleMentoringPostForm}>
            멘토 공고 올리기
          </button>
        </div>

        <Sidebar selectedField={selectedField} setSelectedField={handleFieldSelect} />

        <div className="main-content">
          {error && <p className="error-message">{error}</p>}

          <div className="post-list">
            {posts.length === 0 && !error ? (
                <p>멘토링 공고가 없습니다.</p>
            ) : (
                posts.map((post) => (
                    <div key={post.mentoringPostId} className="post-item">
                      <h4>{post.title}</h4>
                      <p>분야: {post.field}</p>
                      <p>멘토: {post.userNickname}</p>
                      <p>평점: {post.starRating.toFixed(1)}</p>
                    </div>
                ))
            )}
          </div>

          <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
          />
        </div>
      </div>
  );
};

export default MentoringPostSearchPage;
