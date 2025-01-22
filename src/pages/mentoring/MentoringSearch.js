import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Pagination from "/src/components/Pagenation";

const MentoringPostPage = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedField, setSelectedField] = useState("전체");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiClient.get("/payments", {
          params: {
            pageNumber: currentPage - 1, // 백엔드가 0부터 시작하는 페이지 번호 사용
            pageSize: 10, // 한 페이지 당 항목 수
            field: selectedField === "전체" ? null : selectedField, // "전체" 선택 시 필터 없음
          },
        });
        setPosts(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
      } catch (error) {
        console.error("공고를 가져오는 중 오류 발생:", error);
      }
    };

    fetchPosts();
  }, [currentPage, selectedField]);

  return (
      <div className="mentoring-page">
        <Sidebar selectedField={selectedField} setSelectedField={setSelectedField} />
        <div className="main-content">
          <MentoringPostList posts={posts} />
          <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
          />
        </div>
      </div>
  );
};

export default MentoringPostPage;
