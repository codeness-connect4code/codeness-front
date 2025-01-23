import React, { useEffect, useState } from "react";
import axios from 'axios';
import TrashButton from "../../../components/button/TrashButton";
import { MoveRight } from "lucide-react";

function ViewReview(props){
    //상태 관리
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); 
    const [data, setData] = useState(null);

    //토큰 가져오기
    const token = localStorage.getItem("jwtToken");
    //경로 변수 받아오기
    const paymentHistoryId = props.match.params.paymentHistoryId;

    useEffect(() => {
    const controller = new AbortController();
        
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/payment-history/${paymentHistoryId}/reviews`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    signal: controller.signal
                });
                setData(response.data.data);
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error('데이터 가져오기 실패:', error);
                    setError(error);
                }
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    
        return () => controller.abort();
    }, [paymentHistoryId, token]);

    // API 호출로 리뷰 삭제
    const deleteItem = async (id) => {
        try {
        await axios.delete(`http://localhost:8080/reviews/${id}`,{
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        
        } catch (error) {
        console.error('삭제 실패:', error);
        }
    };



    if (loading) return <div>로딩중...</div>;
    if (error) return <div>에러가 발생했습니다</div>;
    if (!data) return null;

    return(
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
                src= {data.profileUrl || "https://codeness.s3.ap-northeast-1.amazonaws.com/Profile/1-Profile.png"}
                alt="멘토 이미지"
                style={{
                    borderRadius: "50%",
                    border: "2px solid #000",
                    width: "50px",
                    height: "50px",
                    objectFit: "cover"
                }}
                />
                <span>{data.mentorNick} {data.mentoringTitle}</span> <span>{data.createdAt}</span></p>
                <hr/>
                <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            style={{ 
                                color: star <= data.starRating ? '#FFD700' : '#e4e5e9',  // 3은 rating 값
                                fontSize: '24px'
                            }}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <hr/>
                <div 
                style={{
                    width: '80%',
                    padding: '10px',
                    resize: 'vertical',
                      // 수직으로만 크기 조절 가능
                }}
                >{data.content}</div>
                <TrashButton style={{
                    float: "right"
                }} onDelete={(id) => deleteItem(id)} id={data.reviewId} url='/home'/>
                <br/>
            </div>
    )
}


export default ViewReview;