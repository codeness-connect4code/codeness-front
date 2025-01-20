import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom"; // useHistory는 함수형 컴포넌트 내에서만 호출해야 합니다.

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const history = useHistory();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // CORS 요청에 credential 포함
        }
      );

      // 응답 헤더에서 토큰 추출 (서버 응답 방식에 따라 조정 필요)
      const token = response.headers["authorization"] || response.data.token;

      if (token) {
        // Bearer 접두사가 없다면 추가
        const tokenWithBearer = token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;
        localStorage.setItem("token", tokenWithBearer);

        // axios 기본 헤더 설정 (이후 요청에 사용)
        axios.defaults.headers.common["Authorization"] = tokenWithBearer;

        setMessage("로그인 성공!");
        history.push("/payment"); // payment 경로로 이동
      } else {
        setMessage("로그인 실패: 토큰을 받지 못했습니다.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        // 서버에서 보낸 에러 메시지 표시
        const errorMessage =
          error.response.data?.message || error.response.data;
        setMessage(`로그인 실패: ${errorMessage}`);
      } else if (error.request) {
        // 요청은 보냈으나 응답을 받지 못한 경우
        setMessage("로그인 실패: 서버 응답이 없습니다.");
      } else {
        // 요청 설정 중 에러 발생
        setMessage("로그인 실패: " + error.message);
      }
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>아이디:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>비밀번호:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">로그인</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};
export default Login;
