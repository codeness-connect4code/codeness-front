import React, { useState, useEffect } from "react";
import axios from "axios"; // Axios를 사용하여 API 호출
import Sidebar from "../../components/sidebar/Sidebar"; // 필터를 위한 사이드바 컴포넌트
import Pagination from "../../components/Pagenation"; // 페이지네이션 컴포넌트
import "../../styles/mentoring/MentoringPostSearch.css"; // 스타일 파일

const MentoringPostPage = () => {
  // 상태 관리
  const [posts, setPosts] = useState([]); // API에서 가져온 멘토링 공고 데이터
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [selectedField, setSelectedField] = useState("전체"); // 사이드바에서 선택된 분야 필터
  const [searchInput, setSearchInput] = useState(""); // 검색창 입력값
  const [searchParams, setSearchParams] = useState({
    keyword: "", // 제목, 닉네임, 분야를 한 번에 검색하는 키워드
    field: "", // 선택된 필터
  });
  const [error, setError] = useState(null); // API 호출 에러 상태

  /**
   * 검색 입력값 변경 핸들러
   * - 검색창에서 입력된 값의 상태를 업데이트합니다.
   * - 입력값이 비어 있으면 검색 조건 초기화.
   */
  const handleInputChange = (e) => {
    const value = e.target.value.trim(); // 앞뒤 공백 제거
    setSearchInput(value);

    // 입력값이 없을 경우 keyword 조건 초기화
    if (!value) {
      setSearchParams((prev) => ({ ...prev, keyword: "" }));
    }
  };

  /**
   * 검색 버튼 클릭 핸들러
   * - 검색창 입력값을 keyword로 설정하고 검색 조건을 업데이트합니다.
   */
  const handleSearchClick = () => {
    const keyword = searchInput.trim(); // 입력값의 앞뒤 공백 제거
    console.log("검색 버튼 클릭: 검색어와 필터", { keyword, field: selectedField });
    setSearchParams({
      keyword, // 검색어 업데이트
      field: selectedField !== "전체" ? selectedField : "", // 선택된 필터
    });
    setCurrentPage(1); // 검색 시 페이지 번호 초기화
  };

  /**
   * 사이드바 필터 선택 핸들러
   * - 사이드바에서 선택된 필터를 상태에 반영합니다.
   */
  const handleFieldSelect = (field) => {
    console.log("사이드바 필터 선택: 필터 값", field);
    setSelectedField(field); // 선택된 필터 업데이트
    setSearchParams((prev) => ({
      ...prev,
      field: field !== "전체" ? field : "", // 필터 값이 "전체"가 아닌 경우만 적용
    }));
    setCurrentPage(1); // 필터 변경 시 페이지 번호 초기화
  };

  /**
   * URL 인코딩 함수
   * - 특수 문자가 포함된 경우에도 안전하게 API 호출 가능하도록 인코딩합니다.
   */
  const encodeParam = (param) => {
    return encodeURIComponent(param || ""); // 빈 값일 경우 안전하게 처리
  };

  /**
   * API 호출 함수
   * - 현재 검색 조건(searchParams)과 페이지 번호(currentPage)에 따라 데이터를 가져옵니다.
   */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // API 요청 파라미터 준비
        const params = {
          pageNumber: currentPage - 1, // 페이지 번호 (백엔드는 0부터 시작)
          pageSize: 10, // 한 페이지에 표시할 데이터 수
          keyword: encodeParam(searchParams.keyword), // 검색 키워드
          field: encodeParam(searchParams.field), // 선택된 필터
        };

        console.log("API 호출 파라미터:", params);

        // API 호출
        const response = await axios.get("http://localhost:8080/mentoring", { params });

        // API 응답 데이터 설정
        setPosts(response.data.data.content); // 멘토링 공고 데이터
        setTotalPages(response.data.data.totalPages); // 전체 페이지 수
        setError(null); // 성공 시 에러 상태 초기화
      } catch (error) {
        console.error("멘토링 공고를 가져오는 중 오류 발생:", error);
        setError("멘토링 공고를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
    };

    fetchPosts(); // API 호출 실행
  }, [currentPage, searchParams]); // currentPage 또는 searchParams가 변경될 때 실행

  return (
      <div className="mentoring-page">
        {/* 검색창 */}
        <div className="search-container">
          <input
              type="text"
              placeholder="제목, 멘토 닉네임, 분야를 검색하세요"
              value={searchInput}
              onChange={handleInputChange} // 검색창 입력값 변경 이벤트 핸들러
              className="search-input"
          />
          <button onClick={handleSearchClick} className="search-button">
            검색
          </button>
        </div>

        {/* 사이드바: 분야 필터 */}
        <Sidebar selectedField={selectedField} setSelectedField={handleFieldSelect} />

        {/* 멘토링 공고 리스트 */}
        <div className="main-content">
          {/* 에러 메시지 */}
          {error && <p className="error-message">{error}</p>} {/* 에러 메시지 표시 */}

          <div className="post-list">
            {/* 검색 결과가 없을 경우 */}
            {posts.length === 0 && !error ? (
                <p>멘토링 공고가 없습니다.</p>
            ) : (
                // 검색 결과 렌더링
                posts.map((post) => (
                    <div key={post.mentoringPostId} className="post-item">
                      <h4>{post.title}</h4> {/* 공고 제목 */}
                      <p>분야: {post.field}</p> {/* 분야 */}
                      <p>멘토: {post.userNickname}</p> {/* 멘토 닉네임 */}
                      <p>평점: {post.starRating.toFixed(1)}</p> {/* 평균 별점 */}
                    </div>
                ))
            )}
          </div>

          {/* 페이지네이션 */}
          <Pagination
              currentPage={currentPage} // 현재 페이지 번호
              totalPages={totalPages} // 전체 페이지 수
              onPageChange={setCurrentPage} // 페이지 변경 이벤트 핸들러
          />
        </div>
      </div>
  );
};

export default MentoringPostPage;
