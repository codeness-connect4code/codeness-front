// App.js
import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import HomePage from "./pages/home/Home";
import LoginPage from "./pages/auth/Login";
import SignUpPage from "./pages/auth/SignUp";
import CommunityPage from "./pages/community/PostMain";
import NewsPage from "./pages/news/ViewNews";
import MyPage from "./pages/mypage/profile/MyPage";
import UserUpdatePage from "./pages/mypage/profile/UserUpdate";
import Header from "./components/header/Header";
import MentoringPaymentPage from "./pages/payment/MentoringPayment";
import MentorRequestPage from "./pages/mentor-request/MentorRequest";
import ViewReviewPage from "./pages/mypage/review/ViewReview";
import WriteReviewPage from "./pages/mypage/review/WriteReview";
import MainNewsPage from "./pages/news/MainNews";
import MentoringPostSearchPage from "./pages/mentoring/MentoringPostSearch";
import MentoringPostFormPage from "./pages/mentoring/MentoringPostForm";
import MyPageHome from "./pages/mypage/MyPageHome";
import UserSchedulePage from "./pages/mypage/schedule/UserSchedule";
import DeleteUserPage from "./pages/mypage/delete-user/DeleteUser";
import MentorRequestListPage from "./pages/mypage/mentor-request/MentorRequestList";
import MentoringPostDetailPage from "./pages/mentoring/MentoringPostDetail";
import MentoringReservationPage from "./pages/payment/MentoringReservation";

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
          <Route path="/mypage/payments/review/:paymentHistoryId" component={ViewReviewPage} />
          <Route path="/mypage/payments/review" component={WriteReviewPage} />
          <Route path="/main/news" component={MainNewsPage} />  {/* TODO: 나중에 삭제할 요소 */}
          <Route path="/news" component={NewsPage} />
          <Route path="/mypage/profile" component={MyPageHome} />

          <PrivateRoute path="/mentoring/:mentoringPostId/mentoring-reservation" component={MentoringReservationPage} />
          <Route path="/mentoring/:mentoringPostId" component={MentoringPostDetailPage} />
          <Route path="/mentoring" component={MentoringPostSearchPage} />

          {/* 로그인 필요한 페이지는 PrivateRoute로 보호 */}
          <PrivateRoute path="/mypage" component={MyPage} />
          <PrivateRoute path="/user/update" component={UserUpdatePage} />
          <PrivateRoute path="/user/mentor" component={MentorRequestPage} />
          <PrivateRoute path="/payment" component={MentoringPaymentPage} />
          <PrivateRoute path="/mentoring-post-form" component={MentoringPostFormPage} />
          <Route path="/schedule" component={UserSchedulePage} />
          <Route path="/delete-user" component={DeleteUserPage} />
          <Route path="/mentor-request-list" component={MentorRequestListPage} />
        </Switch>
      </Router>
  );
}

export default App;
