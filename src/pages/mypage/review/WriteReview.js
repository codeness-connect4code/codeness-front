import React, { useEffect, useState } from "react";
import axios from "axios";

function WriteReview() {
    // 상태 관리
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [content, setContent] = useState('');
    const [mentorInfo, setMentorInfo] = useState(null); // 멘토 정보 상태 추가
    const [rating, setRating] = useState(0);
    const stars = [1, 2, 3, 4, 5];

    // 토큰 가져오기
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        axios.defaults.baseURL = "http://localhost:8080";

        // 거래내역에서 받아올 데이터 (임시)
        const response = {
            data: {
                profileUrl: "https://codeness.s3.ap-northeast-1.amazonaws.com/Profile/1-Profile.png",
                mentorNick: "김멘토1",
                mentoringPost: "[한달 안에 파이썬 부시기]",
                mentoringPostId: 1,
                paymentHistoryId: 1,
            }
        };

        setMentorInfo(response.data);
    }, []);

    const handleStarClick = (value) => {
        setRating(value);
    };

    // 후기 작성 버튼 누르면 서버에 요청
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!mentorInfo) {
            console.error("⛔ 멘토 정보가 없습니다.");
            return;
        }

        try {
            const token = localStorage.getItem("jwtToken"); // 최신 토큰 가져오기
            if (!token) throw new Error("⛔ 인증 토큰이 없습니다.");

            await axios.post(`/payment-history/${mentorInfo.paymentHistoryId}/reviews`,
                {
                    mentoringPostId: mentorInfo.mentoringPostId,
                    content: content,
                    starRating: rating
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    withCredentials: true, // CORS 요청에 credential 포함
                }
            );

            alert("✅ 리뷰가 성공적으로 등록되었습니다.");
            setContent('');
            setRating(0);
        } catch (error) {
            console.error("🚨 리뷰 등록 실패:", error.response?.data || error.message);
        }
    };

    if (loading) return <div>로딩중...</div>;
    if (error) return <div>{error}</div>;
    if (!mentorInfo) return <div>멘토 정보를 불러오는 중...</div>;

    return (
        <form onSubmit={handleSubmit}>
            <div style={{
                width: "70%",
                height: "100%",
                paddingTop: "30px",
                paddingLeft: "5px",
                margin: "auto",
                border: "2px solid gray",
                borderRadius: "10px"
            }}>
                <p>
                    <img
                        src={mentorInfo.profileUrl}
                        alt="멘토 이미지"
                        style={{
                            borderRadius: "50%",
                            border: "2px solid #000",
                            width: "50px",
                            height: "50px",
                            objectFit: "cover"
                        }}
                    />
                    <span> {mentorInfo.mentorNick} {mentorInfo.mentoringPost}</span>
                </p>
                <hr/>
                <div>
                    {stars.map((star) => (
                        <span
                            key={star}
                            onClick={() => handleStarClick(star)}
                            style={{
                                cursor: "pointer",
                                color: star <= rating ? "#FFD700" : "#e4e5e9",
                                fontSize: "24px"
                            }}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <hr/>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="리뷰를 입력해주세요"
                    rows={5}
                    style={{
                        width: "80%",
                        padding: "10px",
                        resize: "vertical", // 수직으로만 크기 조절 가능
                    }}
                />
                <br/>
                <div style={{ textAlign: "right" }}>
                    <button type="submit">후기 등록하기</button>
                </div>
            </div>
        </form>
    );
}

export default WriteReview;
