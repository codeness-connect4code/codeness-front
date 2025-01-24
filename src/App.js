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
import MainNewsPage from "./pages/news/ViewMainNews";
import MentoringPostSearchPage from "./pages/mentoring/MentoringPostSearch";
import MentoringPostFormPage from "./pages/mentoring/MentoringPostForm";
import MyPageHome from "./pages/mypage/MyPageHome";
import UserSchedulePage from "./pages/mypage/schedule/UserSchedule";
import DeleteUserPage from "./pages/mypage/delete-user/DeleteUser";
import MentoringPostDetailPage from "./pages/mentoring/MentoringPostDetail";
import MentoringReservationPage from "./pages/payment/MentoringReservation";
import AdminRoutes from "./pages/admin/mentor-request/AdminRoutes";

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
        <Header />
        <Switch>
          <Route path="/admin" component={AdminRoutes} />
          <Route exact path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignUpPage} />
          <Route path="/community" component={CommunityPage} />
          <Route path="/news" component={NewsPage} />
          <Route path="/mypage/payments/review/:paymentHistoryId" component={ViewReviewPage} />
          <Route path="/mypage/payments/review" component={WriteReviewPage} />
          <Route path="/main/news" component={MainNewsPage} />
          <Route path="/news" component={NewsPage} />
          <Route path="/mypage/profile" component={MyPageHome} />

          <PrivateRoute path="/mentoring/:mentoringPostId/mentoring-reservation" component={MentoringReservationPage} />
          <Route path="/mentoring/:mentoringPostId" component={MentoringPostDetailPage} />
          <Route path="/mentoring" component={MentoringPostSearchPage} />

          <PrivateRoute path="/profile" component={MyPage} />
          <PrivateRoute path="/user/update" component={UserUpdatePage} />
          <PrivateRoute path="/user/mentor" component={MentorRequestPage} />
          <PrivateRoute path="/payment" component={MentoringPaymentPage} />
          <PrivateRoute path="/mentoring-post-form" component={MentoringPostFormPage} />
          <Route path="/schedule" component={UserSchedulePage} />
          <Route path="/delete-user" component={DeleteUserPage} />
        </Switch>
      </Router>
  );
}

export default App;