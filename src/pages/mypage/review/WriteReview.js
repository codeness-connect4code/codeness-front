import React, { useEffect, useState } from "react";
import axios from 'axios';

function WriteReview(){
    //상태 관리
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); 
    const [content, setContent] = useState('');
    const [mentorInfo, setMentorInfo] = useState(null); //멘토 프로필 주소, 멘토 닉네임, 멘토 공고 제목
    const [rating, setRating] = useState(0);
    const stars = [1, 2, 3, 4, 5];
    //
    // useEffect(() =>{
    //     fetchMentorInfo();
    // })
    const handleStarClick = (value) => {
        setRating(value);
    }

    //토큰 가져오기
    const token = localStorage.getItem("jwtToken");

    //후기 작성 버튼 누르면 서버에 요청
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const result = await axios.post(`http://localhost:8080/payment-history/${response.data.paymentHistoryId}/reviews`, 
                {
                    "mentoringPostId": response.data.mentoringPostId,
                      "content": content,
                      "starRating": rating
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`
                    },
                    withCredentials: true, // CORS 요청에 credential 포함
                  });
        }catch(error){
            console.error('리뷰 등록 실패:', error);
        }
    }

    //거래내역에서 후기 작성 누르면 받아올 데이터
    const response = {
            data: {
                profileUrl : "https://codeness.s3.ap-northeast-1.amazonaws.com/Profile/1-Profile.jpg",
                mentorNick : "김멘토1",
                mentoringPost : "[한달 안에 파이썬 부시기]",
                mentoringPostId : 1,
                paymentHistoryId : 1,
            }
        }
       
    
    

    //로딩 중일 때
    if(loading) return <div>로딩중. . .</div>

    //에러 발생 시
    if(error) return <div>{error}</div>

    return(
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
                <p><img
                src={response.data.profileUrl}
                alt="멘토 이미지"
                style={{
                    borderRadius: "50%",
                    border: "2px solid #000",
                    width: "50px",
                    height: "50px",
                    objectFit: "cover"
                }}
                />
                <span>{response.data.mentorNick} {response.data.mentoringPost}</span></p>
                <hr/>
                <div>
                {stars.map((star) => (
                    <span
                        key={star}
                        onClick={() => handleStarClick(star)}
                        style={{ 
                            cursor: 'pointer',
                            color: star <= rating ? '#FFD700' : '#e4e5e9',
                            fontSize: '24px'
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
                rows={5}  // 기본 보여질 줄 수
                style={{
                    width: '80%',
                    padding: '10px',
                    resize: 'vertical',
                      // 수직으로만 크기 조절 가능
                }}
                />
                <br/>
                <div style={{
                    textAlign: "right"
                }}>
                    <button type="submit">후기 등록하기</button>
                </div>
            </div>
        </form>
    )
}


export default WriteReview;