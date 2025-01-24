import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

const PostDetailPage = () => {
  const { postId } = useParams(); // URL에서 postId 가져오기
  const history = useHistory();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]); // 기본값을 빈 배열로 설정
  const [newComment, setNewComment] = useState("");

  // Axios 기본 설정
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    axios.defaults.baseURL = "http://localhost:8080";
  }, []);

  // 게시글 데이터 가져오기
  const fetchPostDetails = async () => {
    try {
      const response = await axios.get(`/posts/${postId}`);
      setPost(response.data.data);
    } catch (error) {
      console.error("Failed to fetch post details:", error);
      alert("게시글 데이터를 가져오는 중 오류가 발생했습니다.");
    }
  };

  // 댓글 데이터 가져오기
  const fetchComments = async () => {
    try {
      const response = await axios.get(`/posts/${postId}/comments`);
      setComments(Array.isArray(response.data.data) ? response.data.data : []); // 배열 확인 후 설정
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      alert("댓글 데이터를 가져오는 중 오류가 발생했습니다.");
    }
  };

  // 댓글 등록
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    try {
      await axios.post(`/posts/${postId}/comments`, { content: newComment });
      setNewComment("");
      fetchComments(); // 댓글 다시 불러오기
    } catch (error) {
      console.error("Failed to submit comment:", error);
      alert("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchPostDetails();
    fetchComments();
  }, [postId]);

  return (
      <div className="post-detail-page">
        {post ? (
            <div className="post-container">
              <div className="post-header">
                <h1>{post.title}</h1>
                <div className="post-meta">
                  <span>작성자: {post.writer}</span>
                  <span>조회수: {post.view}</span>
                  <span>작성일: {new Date(post.modifiedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="post-content">
                <p>{post.content}</p>
              </div>
            </div>
        ) : (
            <p>게시글을 불러오는 중입니다...</p>
        )}

        {/* 댓글 섹션 */}
        <div className="comments-section">
          <h2>댓글</h2>
          <div className="comments-list">
            {comments.length === 0 ? (
                <p>댓글이 없습니다.</p>
            ) : (
                comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <div className="comment-meta">
                        <span>{comment.writer}</span>
                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                ))
            )}
          </div>
          <div className="comment-form">
          <textarea
              placeholder="댓글을 입력하세요"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
          />
            <button onClick={handleCommentSubmit}>등록</button>
          </div>
        </div>

        <button onClick={() => history.push("/community")}>글 목록</button>

        <style jsx>{`
          .post-detail-page {
            font-family: Arial, sans-serif;
            padding: 20px;
          }

          .post-container {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 20px;
          }

          .post-header {
            margin-bottom: 20px;
          }

          .post-meta span {
            margin-right: 15px;
            color: gray;
          }

          .post-content {
            font-size: 16px;
            line-height: 1.5;
          }

          .comments-section {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
          }

          .comments-list .comment {
            border-bottom: 1px solid #ddd;
            padding: 10px 0;
          }

          .comment-meta span {
            margin-right: 10px;
            font-size: 12px;
            color: gray;
          }

          .comment-form textarea {
            width: 100%;
            height: 80px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin-top: 10px;
            margin-bottom: 10px;
          }

          .comment-form button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
          }

          .comment-form button:hover {
            background-color: #0056b3;
          }
        `}</style>
      </div>
  );
};

export default PostDetailPage;