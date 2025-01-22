// App.js
import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import HomePage from "./pages/home/Home";
import LoginPage from "./pages/auth/Login";
import SignUpPage from "./pages/auth/SignUp";
import CommunityPage from "./pages/community/CommunityMain";
import NewsPage from "./pages/news/NewsMain";
import MyPage from "./pages/mypage/profile/MyPage";
import UserUpdatePage from "./pages/mypage/profile/UserUpdate";
import Header from "./components/header/Header";
import PaymentPage from "./pages/payment/Payment";

// 로그인이 필요한 페이지를 위한 Private Route
const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem("jwtToken");
  return (
      <Route
          {...rest}
          render={(props) =>
              isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
          }
      />
  );
};

function App() {
  return (
      <Router>
        <Header /> {/* 모든 페이지에 헤더 추가 */}
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignUpPage} />
          <Route path="/community" component={CommunityPage} />
          <Route path="/news" component={NewsPage} />
          <Route path="/payment" component={PaymentPage} />

          {/* 로그인 필요한 페이지는 PrivateRoute로 보호 */}
          <PrivateRoute path="/mypage" component={MyPage} />
          <PrivateRoute path="/user/update" component={UserUpdatePage} />
        </Switch>
      </Router>
  );
}

export default App;