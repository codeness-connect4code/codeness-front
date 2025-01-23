import React, { useState, useEffect } from "react";
import axios from "axios";

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filter, setFilter] = useState("제목"); // 검색 기준 상태 추가
  const [currentTab, setCurrentTab] = useState("전체");
  const [isSearchTriggered, setIsSearchTriggered] = useState(false); // 검색 버튼 클릭 여부

  // 탭과 PostType 매핑 객체
  const postTypeMapping = {
    전체: null,
    "질문 게시판": "QUESTION",
    "자유 게시판": "FREE",
    공지사항: "NOTICE",
  };

  // axios 기본 설정
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    axios.defaults.baseURL = "http://localhost:8080"; // 서버 URL 설정
  }, []);

  // 데이터 요청 함수
  const fetchPosts = async (params = {}) => {
    try {
      const response = await axios.get("/posts", { params });
      console.log("응답 데이터:", response.data); // 응답 데이터 로그
      setPosts(response.data.data.content || []); // 데이터가 없을 경우 빈 배열로 설정
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      alert("데이터를 가져오는 중 오류가 발생했습니다.");
    }
  };

  // 초기 데이터 로드 (페이지 진입 시)
  useEffect(() => {
    fetchPosts({
      postType: postTypeMapping[currentTab] || null,
    });
  }, [currentTab]);

  // 검색 버튼 클릭 시 검색 실행
  useEffect(() => {
    if (isSearchTriggered) {
      const params = {
        postType: postTypeMapping[currentTab] || null,
      };

      if (filter === "제목") {
        params.keyword = searchKeyword;
      } else if (filter === "작성자") {
        params.writer = searchKeyword;
      }

      fetchPosts(params);
      setIsSearchTriggered(false); // 검색 후 초기화
    }
  }, [isSearchTriggered]);

  // 탭 변경 시 검색어 초기화
  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    setSearchKeyword(""); // 검색어 초기화
  };

  return (
      <div className="community-page">
        <div className="main-content">
          {/* 사이드바 */}
          <aside className="sidebar">
            {[
              "전체",
              "질문 게시판",
              "자유 게시판",
              "공지사항",
            ].map((tab) => (
                <button
                    key={tab}
                    className={`tab-button ${currentTab === tab ? "active" : ""}`}
                    onClick={() => handleTabChange(tab)}
                >
                  {tab}
                </button>
            ))}
          </aside>

          {/* 콘텐츠 영역 */}
          <section className="content">
            {/* 검색 바 */}
            <div className="search-bar">
              <select
                  className="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)} // 검색 기준 변경
              >
                <option>제목</option>
                <option>작성자</option>
              </select>
              <input
                  type="text"
                  className="search-input"
                  placeholder={filter === "제목" ? "제목을 입력하세요" : "작성자를 입력하세요"}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)} // 검색어 업데이트
              />
              <button
                  className="search-button"
                  onClick={() => setIsSearchTriggered(true)} // 검색 버튼 클릭 시 트리거 설정
              >
                검색
              </button>
            </div>

            {/* 게시글 목록 */}
            <table className="post-table">
              <thead>
              <tr>
                <th>제목</th>
                <th>작성자</th>
                <th>조회수</th>
                <th>작성일</th>
              </tr>
              </thead>
              <tbody>
              {posts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="no-posts">
                      게시글이 없습니다.
                    </td>
                  </tr>
              ) : (
                  posts.map((post) => (
                      <tr key={post.postId}>
                        <td>{post.title}</td>
                        <td>{post.writer}</td>
                        <td>{post.view}</td>
                        <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                      </tr>
                  ))
              )}
              </tbody>
            </table>
          </section>
        </div>

        <style jsx>{`
          .community-page {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
          }

          .main-content {
            display: flex;
            padding: 20px;
          }

          .sidebar {
            width: 200px;
            border-right: 1px solid #ddd;
            padding-right: 20px;
          }

          .tab-button {
            display: block;
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            text-align: left;
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.2s;
          }

          .tab-button.active {
            background-color: #007bff;
            color: white;
          }

          .content {
            flex: 1;
            padding-left: 20px;
          }

          .search-bar {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
          }

          .filter {
            padding: 10px;
            margin-right: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }

          .search-input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }

          .search-button {
            padding: 10px 15px;
            margin-left: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.2s;
          }

          .search-button:hover {
            background-color: #0056b3;
          }

          .post-table {
            width: 100%;
            border-collapse: collapse;
          }

          .post-table th, .post-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }

          .post-table th {
            background-color: #f4f4f4;
          }

          .no-posts {
            text-align: center;
            color: #888;
          }
        `}</style>
      </div>
  );
};

export default CommunityPage;
